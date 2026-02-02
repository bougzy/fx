import { type Stage, STAGES } from './stages';

export interface StageLimits {
  maxRiskPerTradePercent: number;
  maxDailyDrawdownPercent: number;
  maxWeeklyDrawdownPercent: number;
  maxOpenPositions: number;
  maxDailyTrades: number;
  minRiskRewardRatio: number;
  allowedPairCategories: ('major' | 'minor' | 'exotic')[];
  allowedSessions: ('asian' | 'london' | 'newyork')[];
  maxLotSize: number;
}

export const STAGE_LIMITS: Partial<Record<Stage, StageLimits>> = {
  [STAGES.STAGE_3_SIM_BASIC]: {
    maxRiskPerTradePercent: 1,
    maxDailyDrawdownPercent: 3,
    maxWeeklyDrawdownPercent: 5,
    maxOpenPositions: 1,
    maxDailyTrades: 3,
    minRiskRewardRatio: 1.5,
    allowedPairCategories: ['major'],
    allowedSessions: ['london', 'newyork'],
    maxLotSize: 1.0,
  },
  [STAGES.STAGE_4_SIM_REALISTIC]: {
    maxRiskPerTradePercent: 1,
    maxDailyDrawdownPercent: 3,
    maxWeeklyDrawdownPercent: 5,
    maxOpenPositions: 2,
    maxDailyTrades: 5,
    minRiskRewardRatio: 1.5,
    allowedPairCategories: ['major', 'minor'],
    allowedSessions: ['asian', 'london', 'newyork'],
    maxLotSize: 1.0,
  },
  [STAGES.STAGE_5_SIM_STRESS]: {
    maxRiskPerTradePercent: 1,
    maxDailyDrawdownPercent: 3,
    maxWeeklyDrawdownPercent: 5,
    maxOpenPositions: 2,
    maxDailyTrades: 5,
    minRiskRewardRatio: 1.5,
    allowedPairCategories: ['major', 'minor'],
    allowedSessions: ['asian', 'london', 'newyork'],
    maxLotSize: 1.0,
  },
  [STAGES.STAGE_6_LIVE_MICRO]: {
    maxRiskPerTradePercent: 0.5,
    maxDailyDrawdownPercent: 2,
    maxWeeklyDrawdownPercent: 3,
    maxOpenPositions: 1,
    maxDailyTrades: 3,
    minRiskRewardRatio: 2.0,
    allowedPairCategories: ['major'],
    allowedSessions: ['london', 'newyork'],
    maxLotSize: 0.1,
  },
  [STAGES.STAGE_7_LIVE_MINI]: {
    maxRiskPerTradePercent: 1,
    maxDailyDrawdownPercent: 3,
    maxWeeklyDrawdownPercent: 5,
    maxOpenPositions: 2,
    maxDailyTrades: 5,
    minRiskRewardRatio: 1.5,
    allowedPairCategories: ['major', 'minor'],
    allowedSessions: ['asian', 'london', 'newyork'],
    maxLotSize: 1.0,
  },
  [STAGES.STAGE_8_LIVE_STANDARD]: {
    maxRiskPerTradePercent: 1,
    maxDailyDrawdownPercent: 3,
    maxWeeklyDrawdownPercent: 5,
    maxOpenPositions: 3,
    maxDailyTrades: 8,
    minRiskRewardRatio: 1.5,
    allowedPairCategories: ['major', 'minor', 'exotic'],
    allowedSessions: ['asian', 'london', 'newyork'],
    maxLotSize: 10.0,
  },
};

export const COOLDOWN_RULES = {
  CONSECUTIVE_LOSSES_3: { threshold: 3, durationMinutes: 30, message: 'Cooldown: 3 consecutive losses. Take a break and review.' },
  CONSECUTIVE_LOSSES_5: { threshold: 5, durationMinutes: 120, message: 'Extended cooldown: 5 consecutive losses. Mandatory 2-hour break.' },
  DAILY_DRAWDOWN_WARNING: { thresholdPercent: 2, durationMinutes: 240, message: 'Cooldown: Approaching daily drawdown limit. 4-hour break enforced.' },
  REVENGE_TRADE_DETECTED: { durationMinutes: 60, message: 'Cooldown: Revenge trading detected. 1-hour mandatory break.' },
  CRITICAL_FLAGS_SESSION: { threshold: 2, durationMinutes: 999, message: 'Session terminated: Multiple critical behavioral flags. Trading locked until next session.' },
} as const;

export function getLimitsForStage(stage: Stage): StageLimits | null {
  return STAGE_LIMITS[stage] ?? null;
}
