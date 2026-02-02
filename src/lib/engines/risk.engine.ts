import { type Stage } from '@/lib/constants/stages';
import { getLimitsForStage, COOLDOWN_RULES } from '@/lib/constants/risk-limits';
import { PAIR_INFO } from '@/lib/constants/pairs';
import { calculatePositionSize, calculateStopDistancePips, calculateRiskRewardRatio } from '@/lib/utils/forex';

export interface TradeProposal {
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number;
  lotSize: number;
  riskAmount: number;
  riskPercent: number;
}

export interface RiskState {
  accountBalance: number;
  dailyPnl: number;
  weeklyPnl: number;
  dailyTradeCount: number;
  openPositionCount: number;
  consecutiveLosses: number;
  isInCooldown: boolean;
  cooldownEndsAt?: Date;
  lastTradeAt?: Date;
}

export interface ValidationResult {
  isBlocked: boolean;
  blockers: string[];
  warnings: string[];
  calculatedRisk: {
    riskAmount: number;
    riskPercent: number;
    positionSize: number;
    stopDistancePips: number;
    riskRewardRatio: number | null;
  };
}

export function validateTradeExecution(
  proposal: TradeProposal,
  riskState: RiskState,
  stage: Stage
): ValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const limits = getLimitsForStage(stage);

  if (!limits) {
    blockers.push('Trading is not available at your current stage.');
    return { isBlocked: true, blockers, warnings, calculatedRisk: { riskAmount: 0, riskPercent: 0, positionSize: 0, stopDistancePips: 0, riskRewardRatio: null } };
  }

  const stopDistancePips = calculateStopDistancePips(proposal.entryPrice, proposal.stopLossPrice, proposal.pair);
  const riskPercent = (proposal.riskAmount / riskState.accountBalance) * 100;
  const riskRewardRatio = proposal.takeProfitPrice
    ? calculateRiskRewardRatio(proposal.entryPrice, proposal.stopLossPrice, proposal.takeProfitPrice)
    : null;
  const suggestedPositionSize = calculatePositionSize(riskState.accountBalance, limits.maxRiskPerTradePercent, stopDistancePips, proposal.pair);

  if (riskState.isInCooldown) {
    const cooldownEnd = riskState.cooldownEndsAt ? new Date(riskState.cooldownEndsAt) : null;
    if (!cooldownEnd || cooldownEnd > new Date()) {
      blockers.push('Cooldown active. Trading is temporarily suspended.');
    }
  }

  if (riskPercent > limits.maxRiskPerTradePercent) {
    blockers.push(`Risk per trade (${riskPercent.toFixed(2)}%) exceeds maximum (${limits.maxRiskPerTradePercent}%).`);
  }

  const dailyDrawdownPercent = Math.abs(Math.min(0, riskState.dailyPnl)) / riskState.accountBalance * 100;
  if (dailyDrawdownPercent >= limits.maxDailyDrawdownPercent) {
    blockers.push(`Daily drawdown limit reached (${dailyDrawdownPercent.toFixed(2)}%).`);
  }

  const weeklyDrawdownPercent = Math.abs(Math.min(0, riskState.weeklyPnl)) / riskState.accountBalance * 100;
  if (weeklyDrawdownPercent >= limits.maxWeeklyDrawdownPercent) {
    blockers.push(`Weekly drawdown limit reached (${weeklyDrawdownPercent.toFixed(2)}%).`);
  }

  if (riskState.openPositionCount >= limits.maxOpenPositions) {
    blockers.push(`Maximum open positions reached (${riskState.openPositionCount}/${limits.maxOpenPositions}).`);
  }

  if (riskState.dailyTradeCount >= limits.maxDailyTrades) {
    blockers.push(`Daily trade limit reached (${riskState.dailyTradeCount}/${limits.maxDailyTrades}).`);
  }

  if (proposal.lotSize > limits.maxLotSize) {
    blockers.push(`Lot size (${proposal.lotSize}) exceeds maximum for your stage (${limits.maxLotSize}).`);
  }

  const pairInfo = PAIR_INFO[proposal.pair];
  if (pairInfo && !limits.allowedPairCategories.includes(pairInfo.category)) {
    blockers.push(`${proposal.pair} (${pairInfo.category}) is not available at your current stage.`);
  }

  if (riskRewardRatio !== null && riskRewardRatio < limits.minRiskRewardRatio) {
    blockers.push(`Risk-reward ratio (${riskRewardRatio.toFixed(2)}) is below minimum (${limits.minRiskRewardRatio}).`);
  }

  if (riskPercent > limits.maxRiskPerTradePercent * 0.8 && riskPercent <= limits.maxRiskPerTradePercent) {
    warnings.push(`Risk is ${riskPercent.toFixed(2)}% - approaching the ${limits.maxRiskPerTradePercent}% limit.`);
  }
  if (dailyDrawdownPercent > limits.maxDailyDrawdownPercent * 0.6) {
    warnings.push(`Daily drawdown is at ${dailyDrawdownPercent.toFixed(2)}% - approaching limit.`);
  }
  if (riskState.consecutiveLosses >= 2) {
    warnings.push(`You have ${riskState.consecutiveLosses} consecutive losses. Consider reviewing your approach.`);
  }

  return { isBlocked: blockers.length > 0, blockers, warnings, calculatedRisk: { riskAmount: proposal.riskAmount, riskPercent, positionSize: suggestedPositionSize, stopDistancePips, riskRewardRatio } };
}

export function checkCooldownTriggers(
  consecutiveLosses: number,
  dailyPnl: number,
  accountBalance: number,
  hasBehaviorFlags: boolean
): { durationMinutes: number; message: string } | null {
  if (hasBehaviorFlags) {
    return { durationMinutes: COOLDOWN_RULES.REVENGE_TRADE_DETECTED.durationMinutes, message: COOLDOWN_RULES.REVENGE_TRADE_DETECTED.message };
  }
  const dailyDrawdownPercent = Math.abs(Math.min(0, dailyPnl)) / accountBalance * 100;
  if (dailyDrawdownPercent >= COOLDOWN_RULES.DAILY_DRAWDOWN_WARNING.thresholdPercent) {
    return { durationMinutes: COOLDOWN_RULES.DAILY_DRAWDOWN_WARNING.durationMinutes, message: COOLDOWN_RULES.DAILY_DRAWDOWN_WARNING.message };
  }
  if (consecutiveLosses >= COOLDOWN_RULES.CONSECUTIVE_LOSSES_5.threshold) {
    return { durationMinutes: COOLDOWN_RULES.CONSECUTIVE_LOSSES_5.durationMinutes, message: COOLDOWN_RULES.CONSECUTIVE_LOSSES_5.message };
  }
  if (consecutiveLosses >= COOLDOWN_RULES.CONSECUTIVE_LOSSES_3.threshold) {
    return { durationMinutes: COOLDOWN_RULES.CONSECUTIVE_LOSSES_3.durationMinutes, message: COOLDOWN_RULES.CONSECUTIVE_LOSSES_3.message };
  }
  return null;
}

export function calculateSuggestedPositionSize(
  accountBalance: number,
  stage: Stage,
  stopDistancePips: number,
  pair: string
): { lots: number; riskAmount: number; riskPercent: number } | null {
  const limits = getLimitsForStage(stage);
  if (!limits) return null;
  const lots = calculatePositionSize(accountBalance, limits.maxRiskPerTradePercent, stopDistancePips, pair);
  const clampedLots = Math.min(lots, limits.maxLotSize);
  return { lots: clampedLots, riskAmount: accountBalance * (limits.maxRiskPerTradePercent / 100), riskPercent: limits.maxRiskPerTradePercent };
}
