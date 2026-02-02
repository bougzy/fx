'use server';

import { z } from 'zod';
import { connectDB } from '@/lib/db/connect';
import { Trade } from '@/lib/db/models/trade.model';
import { TradePlan } from '@/lib/db/models/trade-plan.model';
import { RiskProfile } from '@/lib/db/models/risk-profile.model';
import { auth } from '@/lib/auth/auth';
import { validateTradeExecution, checkCooldownTriggers } from '@/lib/engines/risk.engine';
import { evaluatePreTradeCheck } from '@/lib/engines/mentorship.engine';
import { calculatePnlPips, calculatePnlAmount, calculateRiskRewardRatio } from '@/lib/utils/forex';
import { type Stage } from '@/lib/constants/stages';

const tradePlanSchema = z.object({
  pair: z.string(),
  direction: z.enum(['long', 'short']),
  marketBias: z.string().min(10),
  biasReasoning: z.string().min(20),
  setupType: z.string().min(3),
  entryTrigger: z.string().min(10),
  invalidationPoint: z.string().min(5),
  invalidationReasoning: z.string().min(10),
  riskAmount: z.number().positive(),
  riskPercent: z.number().positive().max(5),
  riskRewardRatio: z.number().positive(),
});

export async function submitTradePlan(data: z.infer<typeof tradePlanSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const validated = tradePlanSchema.parse(data);

  const userStage = session.user.currentStage as Stage;
  const mentorResponse = evaluatePreTradeCheck({
    pair: validated.pair,
    direction: validated.direction,
    marketBias: validated.marketBias,
    biasReasoning: validated.biasReasoning,
    setupType: validated.setupType,
    entryTrigger: validated.entryTrigger,
    invalidationPoint: validated.invalidationPoint,
    invalidationReasoning: validated.invalidationReasoning,
    riskRewardRatio: validated.riskRewardRatio,
    riskPercent: validated.riskPercent,
  }, userStage);

  const plan = await TradePlan.create({
    userId: session.user.id,
    ...validated,
    mentoringResponse: mentorResponse,
    status: mentorResponse.approved ? 'approved' : 'rejected',
  });

  return { planId: plan._id.toString(), mentorResponse };
}

export async function executeTrade(data: {
  planId: string;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number;
  lotSize: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const plan = await TradePlan.findById(data.planId);
  if (!plan || plan.userId.toString() !== session.user.id) throw new Error('Plan not found');

  const riskProfile = await RiskProfile.findOne({ userId: session.user.id });
  if (!riskProfile) throw new Error('Risk profile not found');

  const riskAmount = riskProfile.accountBalance * (plan.riskPercent / 100);
  const userStage = session.user.currentStage as Stage;

  const validation = validateTradeExecution(
    { pair: plan.pair, direction: plan.direction, entryPrice: data.entryPrice, stopLossPrice: data.stopLossPrice, takeProfitPrice: data.takeProfitPrice, lotSize: data.lotSize, riskAmount, riskPercent: plan.riskPercent },
    { accountBalance: riskProfile.accountBalance, dailyPnl: riskProfile.currentState.dailyPnl, weeklyPnl: riskProfile.currentState.weeklyPnl, dailyTradeCount: riskProfile.currentState.dailyTradeCount, openPositionCount: riskProfile.currentState.openPositionCount, consecutiveLosses: riskProfile.currentState.consecutiveLosses, isInCooldown: riskProfile.currentState.isInCooldown, cooldownEndsAt: riskProfile.currentState.cooldownEndsAt, lastTradeAt: riskProfile.currentState.lastTradeAt },
    userStage
  );

  if (validation.isBlocked) {
    return { success: false, blockers: validation.blockers, warnings: validation.warnings };
  }

  const trade = await Trade.create({
    userId: session.user.id,
    tradePlanId: plan._id,
    tradeType: 'demo_basic',
    pair: plan.pair,
    direction: plan.direction,
    entryPrice: data.entryPrice,
    stopLossPrice: data.stopLossPrice,
    takeProfitPrice: data.takeProfitPrice,
    lotSize: data.lotSize,
    riskAmount,
    riskPercent: plan.riskPercent,
    stopDistancePips: validation.calculatedRisk.stopDistancePips,
    plannedRR: validation.calculatedRisk.riskRewardRatio ?? undefined,
    status: 'open',
    entryTime: new Date(),
    preTradeCheck: { completed: true, approved: true, warnings: validation.warnings },
  });

  await RiskProfile.updateOne(
    { userId: session.user.id },
    { $inc: { 'currentState.dailyTradeCount': 1, 'currentState.openPositionCount': 1 }, $set: { 'currentState.lastTradeAt': new Date() } }
  );

  await TradePlan.updateOne({ _id: plan._id }, { tradeId: trade._id, status: 'executed' });

  return { success: true, tradeId: trade._id.toString(), warnings: validation.warnings };
}

export async function closeTrade(tradeId: string, exitPrice: number, exitReason: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const trade = await Trade.findById(tradeId);
  if (!trade || trade.userId.toString() !== session.user.id) throw new Error('Trade not found');

  const pnlPips = calculatePnlPips(trade.direction, trade.entryPrice, exitPrice, trade.pair);
  const pnlAmount = calculatePnlAmount(pnlPips, trade.lotSize, trade.pair);
  const riskProfile = await RiskProfile.findOne({ userId: session.user.id });
  const pnlPercent = riskProfile ? (pnlAmount / riskProfile.accountBalance) * 100 : 0;
  const actualRR = calculateRiskRewardRatio(trade.entryPrice, trade.stopLossPrice, exitPrice);
  const duration = Math.round((Date.now() - trade.entryTime.getTime()) / 60000);

  await Trade.updateOne({ _id: tradeId }, {
    exitPrice, exitTime: new Date(), pnlPips, pnlAmount, pnlPercent, actualRR,
    tradeDurationMinutes: duration, exitReason, status: 'closed',
  });

  if (riskProfile) {
    const isLoss = pnlAmount < 0;
    const newConsecutiveLosses = isLoss ? riskProfile.currentState.consecutiveLosses + 1 : 0;

    await RiskProfile.updateOne({ userId: session.user.id }, {
      $inc: { 'currentState.dailyPnl': pnlAmount, 'currentState.weeklyPnl': pnlAmount, 'currentState.openPositionCount': -1 },
      $set: { 'currentState.consecutiveLosses': newConsecutiveLosses, accountBalance: riskProfile.accountBalance + pnlAmount },
    });

    const cooldown = checkCooldownTriggers(newConsecutiveLosses, riskProfile.currentState.dailyPnl + pnlAmount, riskProfile.accountBalance, false);
    if (cooldown) {
      const cooldownEnd = new Date(Date.now() + cooldown.durationMinutes * 60000);
      await RiskProfile.updateOne({ userId: session.user.id }, { $set: { 'currentState.isInCooldown': true, 'currentState.cooldownEndsAt': cooldownEnd } });
    }
  }

  return { success: true, pnlPips, pnlAmount };
}

export async function submitDebrief(tradeId: string, debrief: { followedPlan: boolean; emotionalState: string; lessonsLearned: string; rating: number }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  await Trade.updateOne({ _id: tradeId, userId: session.user.id }, { debrief: { completed: true, ...debrief } });
  return { success: true };
}
