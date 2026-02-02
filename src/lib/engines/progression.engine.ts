import { type Stage, STAGES, STAGE_ORDER, getStageIndex, getNextStage, getPreviousStage, ADVANCEMENT_CRITERIA } from '@/lib/constants/stages';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/user.model';
import { Trade } from '@/lib/db/models/trade.model';
import { LessonProgress } from '@/lib/db/models/lesson-progress.model';
import { PatternProgress } from '@/lib/db/models/pattern-progress.model';
import { SimulationSession } from '@/lib/db/models/simulation-session.model';
import { BehaviorFlag } from '@/lib/db/models/behavior-flag.model';
import { calculateBehaviorScore } from './behavior.engine';

export interface ProgressionStatus {
  currentStage: Stage;
  canAdvance: boolean;
  criteria: Record<string, { required: any; current: any; met: boolean }>;
  nextStage: Stage | null;
  regressionRisk: boolean;
  regressionReasons: string[];
}

export async function checkProgressionStatus(userId: string): Promise<ProgressionStatus> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const currentStage = user.currentStage as Stage;
  const nextStage = getNextStage(currentStage);
  const criteria: Record<string, { required: any; current: any; met: boolean }> = {};
  let canAdvance = true;

  if (!nextStage) {
    return { currentStage, canAdvance: false, criteria: {}, nextStage: null, regressionRisk: false, regressionReasons: [] };
  }

  const advancementReqs = ADVANCEMENT_CRITERIA[currentStage];
  if (!advancementReqs) {
    return { currentStage, canAdvance: false, criteria: {}, nextStage, regressionRisk: false, regressionReasons: [] };
  }

  const recentFlags = await BehaviorFlag.find({ userId, detectedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
  const behaviorScore = calculateBehaviorScore(recentFlags as any[]);

  criteria.behaviorScore = { required: advancementReqs.minBehaviorScore, current: behaviorScore, met: behaviorScore >= advancementReqs.minBehaviorScore };
  if (!criteria.behaviorScore.met) canAdvance = false;

  if (advancementReqs.minTrades) {
    const tradeCount = await Trade.countDocuments({ userId, status: 'closed' });
    criteria.tradeCount = { required: advancementReqs.minTrades, current: tradeCount, met: tradeCount >= advancementReqs.minTrades };
    if (!criteria.tradeCount.met) canAdvance = false;
  }

  if (advancementReqs.minWinRate) {
    const closedTrades = await Trade.find({ userId, status: 'closed' });
    const wins = closedTrades.filter((t) => (t.pnlAmount ?? 0) > 0).length;
    const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;
    criteria.winRate = { required: advancementReqs.minWinRate, current: Math.round(winRate * 10) / 10, met: winRate >= advancementReqs.minWinRate };
    if (!criteria.winRate.met) canAdvance = false;
  }

  if (advancementReqs.requiredCoursesCompleted) {
    const completedLessons = await LessonProgress.countDocuments({ userId, status: 'completed' });
    criteria.coursesCompleted = { required: true, current: completedLessons > 0, met: completedLessons > 0 };
    if (!criteria.coursesCompleted.met) canAdvance = false;
  }

  if (advancementReqs.requiredPatternseMastered) {
    const masteredPatterns = await PatternProgress.countDocuments({ userId, status: 'mastered' });
    criteria.patternsMastered = { required: advancementReqs.requiredPatternseMastered, current: masteredPatterns, met: masteredPatterns >= advancementReqs.requiredPatternseMastered };
    if (!criteria.patternsMastered.met) canAdvance = false;
  }

  if (advancementReqs.requiredStressScenariosPassed) {
    const passedStress = await SimulationSession.countDocuments({ userId, sessionType: 'stress_test', passed: true });
    criteria.stressScenariosPassed = { required: advancementReqs.requiredStressScenariosPassed, current: passedStress, met: passedStress >= advancementReqs.requiredStressScenariosPassed };
    if (!criteria.stressScenariosPassed.met) canAdvance = false;
  }

  const { regressionRisk, regressionReasons } = await checkRegressionRisk(userId, currentStage, behaviorScore);
  return { currentStage, canAdvance, criteria, nextStage, regressionRisk, regressionReasons };
}

async function checkRegressionRisk(userId: string, currentStage: Stage, behaviorScore: number): Promise<{ regressionRisk: boolean; regressionReasons: string[] }> {
  const reasons: string[] = [];
  const stageIndex = getStageIndex(currentStage);
  if (stageIndex <= 1) return { regressionRisk: false, regressionReasons: [] };

  const stageMinBehavior: Record<string, number> = {
    stage_3_sim_basic: 65, stage_4_sim_realistic: 70, stage_5_sim_stress: 75,
    stage_6_live_micro: 80, stage_7_live_mini: 82, stage_8_live_standard: 85,
  };
  const minScore = stageMinBehavior[currentStage] ?? 60;
  if (behaviorScore < minScore) {
    reasons.push(`Behavior score (${behaviorScore}) is below minimum (${minScore}) for this stage.`);
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const criticalFlags = await BehaviorFlag.countDocuments({ userId, severity: 'critical', detectedAt: { $gte: weekAgo } });
  if (criticalFlags >= 3) {
    reasons.push(`${criticalFlags} critical behavioral flags in the past week.`);
  }
  return { regressionRisk: reasons.length > 0, regressionReasons: reasons };
}

export async function advanceStage(userId: string): Promise<{ success: boolean; newStage?: Stage; error?: string }> {
  await connectDB();
  const status = await checkProgressionStatus(userId);
  if (!status.canAdvance || !status.nextStage) return { success: false, error: 'Advancement criteria not met.' };

  const now = new Date();
  await User.updateOne(
    { _id: userId, 'stageHistory.stage': status.currentStage, 'stageHistory.exitedAt': null },
    { $set: { currentStage: status.nextStage, 'stageHistory.$.exitedAt': now, 'stageHistory.$.exitReason': 'advanced' }, $push: { stageHistory: { stage: status.nextStage, enteredAt: now } } }
  );
  return { success: true, newStage: status.nextStage };
}

export async function regressStage(userId: string, reason: string): Promise<{ success: boolean; newStage?: Stage; error?: string }> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return { success: false, error: 'User not found.' };

  const currentStage = user.currentStage as Stage;
  const previousStage = getPreviousStage(currentStage);
  if (!previousStage || getStageIndex(currentStage) <= 1) return { success: false, error: 'Cannot regress from this stage.' };

  const now = new Date();
  await User.updateOne(
    { _id: userId, 'stageHistory.stage': currentStage, 'stageHistory.exitedAt': null },
    { $set: { currentStage: previousStage, 'stageHistory.$.exitedAt': now, 'stageHistory.$.exitReason': reason }, $push: { stageHistory: { stage: previousStage, enteredAt: now } } }
  );
  return { success: true, newStage: previousStage };
}
