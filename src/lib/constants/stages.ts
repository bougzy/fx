export const STAGES = {
  ONBOARDING: 'onboarding',
  STAGE_1_OBSERVER: 'stage_1_observer',
  STAGE_2_STUDENT: 'stage_2_student',
  STAGE_3_SIM_BASIC: 'stage_3_sim_basic',
  STAGE_4_SIM_REALISTIC: 'stage_4_sim_realistic',
  STAGE_5_SIM_STRESS: 'stage_5_sim_stress',
  STAGE_6_LIVE_MICRO: 'stage_6_live_micro',
  STAGE_7_LIVE_MINI: 'stage_7_live_mini',
  STAGE_8_LIVE_STANDARD: 'stage_8_live_standard',
} as const;

export type Stage = (typeof STAGES)[keyof typeof STAGES];

export const STAGE_ORDER: Stage[] = [
  STAGES.ONBOARDING,
  STAGES.STAGE_1_OBSERVER,
  STAGES.STAGE_2_STUDENT,
  STAGES.STAGE_3_SIM_BASIC,
  STAGES.STAGE_4_SIM_REALISTIC,
  STAGES.STAGE_5_SIM_STRESS,
  STAGES.STAGE_6_LIVE_MICRO,
  STAGES.STAGE_7_LIVE_MINI,
  STAGES.STAGE_8_LIVE_STANDARD,
];

export const STAGE_LABELS: Record<Stage, string> = {
  [STAGES.ONBOARDING]: 'Onboarding',
  [STAGES.STAGE_1_OBSERVER]: 'Stage 1: Observer',
  [STAGES.STAGE_2_STUDENT]: 'Stage 2: Student',
  [STAGES.STAGE_3_SIM_BASIC]: 'Stage 3: Simulation (Basic)',
  [STAGES.STAGE_4_SIM_REALISTIC]: 'Stage 4: Simulation (Realistic)',
  [STAGES.STAGE_5_SIM_STRESS]: 'Stage 5: Stress Testing',
  [STAGES.STAGE_6_LIVE_MICRO]: 'Stage 6: Live (Micro)',
  [STAGES.STAGE_7_LIVE_MINI]: 'Stage 7: Live (Mini)',
  [STAGES.STAGE_8_LIVE_STANDARD]: 'Stage 8: Live (Standard)',
};

export const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  [STAGES.ONBOARDING]: 'Complete your profile and baseline assessment.',
  [STAGES.STAGE_1_OBSERVER]: 'Learn how markets work. No trading yet - observe and study.',
  [STAGES.STAGE_2_STUDENT]: 'Study price patterns and develop your first setup.',
  [STAGES.STAGE_3_SIM_BASIC]: 'Practice execution in a controlled demo environment.',
  [STAGES.STAGE_4_SIM_REALISTIC]: 'Trade with realistic spreads, slippage, and volatility.',
  [STAGES.STAGE_5_SIM_STRESS]: 'Prove you can handle adverse conditions and losing streaks.',
  [STAGES.STAGE_6_LIVE_MICRO]: 'Real money, micro lots. Smallest possible live exposure.',
  [STAGES.STAGE_7_LIVE_MINI]: 'Increased position sizes with proven discipline.',
  [STAGES.STAGE_8_LIVE_STANDARD]: 'Full access. You have demonstrated professional-grade discipline.',
};

export const STAGE_ALLOWED_ROUTES: Record<Stage, string[]> = {
  [STAGES.ONBOARDING]: ['/welcome', '/assessment', '/commitment'],
  [STAGES.STAGE_1_OBSERVER]: ['/dashboard', '/learn', '/profile', '/settings'],
  [STAGES.STAGE_2_STUDENT]: ['/dashboard', '/learn', '/patterns', '/profile', '/settings'],
  [STAGES.STAGE_3_SIM_BASIC]: [
    '/dashboard', '/learn', '/patterns', '/simulate/demo',
    '/journal', '/analytics', '/profile', '/settings',
  ],
  [STAGES.STAGE_4_SIM_REALISTIC]: [
    '/dashboard', '/learn', '/patterns', '/simulate/demo',
    '/simulate/realistic', '/journal', '/analytics', '/profile', '/settings',
  ],
  [STAGES.STAGE_5_SIM_STRESS]: [
    '/dashboard', '/learn', '/patterns', '/simulate/demo',
    '/simulate/realistic', '/simulate/replay', '/simulate/stress',
    '/journal', '/analytics', '/profile', '/settings',
  ],
  [STAGES.STAGE_6_LIVE_MICRO]: [
    '/dashboard', '/learn', '/patterns', '/simulate',
    '/trade', '/journal', '/analytics', '/profile', '/settings',
  ],
  [STAGES.STAGE_7_LIVE_MINI]: [
    '/dashboard', '/learn', '/patterns', '/simulate',
    '/trade', '/journal', '/analytics', '/profile', '/settings',
  ],
  [STAGES.STAGE_8_LIVE_STANDARD]: [
    '/dashboard', '/learn', '/patterns', '/simulate',
    '/trade', '/journal', '/analytics', '/profile', '/settings',
  ],
};

export interface StageAdvancementCriteria {
  minBehaviorScore: number;
  minRiskComplianceScore?: number;
  minTrades?: number;
  minWinRate?: number;
  minAvgRR?: number;
  minPlanAdherence?: number;
  minTimeInStageDays?: number;
  requiredCoursesCompleted?: boolean;
  requiredPatternseMastered?: number;
  requiredStressScenariosPassed?: number;
}

export const ADVANCEMENT_CRITERIA: Partial<Record<Stage, StageAdvancementCriteria>> = {
  [STAGES.STAGE_1_OBSERVER]: {
    minBehaviorScore: 0,
    requiredCoursesCompleted: true,
  },
  [STAGES.STAGE_2_STUDENT]: {
    minBehaviorScore: 70,
    requiredPatternseMastered: 1,
    requiredCoursesCompleted: true,
  },
  [STAGES.STAGE_3_SIM_BASIC]: {
    minBehaviorScore: 75,
    minTrades: 50,
    minWinRate: 40,
    minAvgRR: 1.5,
    minPlanAdherence: 80,
  },
  [STAGES.STAGE_4_SIM_REALISTIC]: {
    minBehaviorScore: 80,
    minTrades: 50,
    minWinRate: 40,
    minAvgRR: 1.5,
    minPlanAdherence: 80,
  },
  [STAGES.STAGE_5_SIM_STRESS]: {
    minBehaviorScore: 85,
    requiredStressScenariosPassed: 3,
  },
  [STAGES.STAGE_6_LIVE_MICRO]: {
    minBehaviorScore: 85,
    minRiskComplianceScore: 90,
    minTrades: 100,
    minTimeInStageDays: 90,
  },
  [STAGES.STAGE_7_LIVE_MINI]: {
    minBehaviorScore: 90,
    minRiskComplianceScore: 90,
    minTrades: 200,
    minTimeInStageDays: 180,
  },
};

export function getStageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isStageAtLeast(current: Stage, required: Stage): boolean {
  return getStageIndex(current) >= getStageIndex(required);
}

export function getNextStage(current: Stage): Stage | null {
  const idx = getStageIndex(current);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

export function getPreviousStage(current: Stage): Stage | null {
  const idx = getStageIndex(current);
  if (idx <= 0) return null;
  return STAGE_ORDER[idx - 1];
}
