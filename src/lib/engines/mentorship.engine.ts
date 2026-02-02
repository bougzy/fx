import { type Stage } from '@/lib/constants/stages';
import { PAIR_INFO } from '@/lib/constants/pairs';

export interface TradePlanInput {
  pair: string;
  direction: 'long' | 'short';
  marketBias: string;
  biasReasoning: string;
  setupType: string;
  entryTrigger: string;
  invalidationPoint: string;
  invalidationReasoning: string;
  riskPercent: number;
  riskRewardRatio: number;
}

export interface MentoringResponse {
  approved: boolean;
  confidence: 'low' | 'medium' | 'high';
  warnings: string[];
  logicGaps: string[];
  suggestions: string[];
}

export function evaluatePreTradeCheck(plan: TradePlanInput, userStage: Stage): MentoringResponse {
  const warnings: string[] = [];
  const logicGaps: string[] = [];
  const suggestions: string[] = [];
  let confidence: 'low' | 'medium' | 'high' = 'high';

  if (plan.biasReasoning.length < 20) {
    logicGaps.push('Your market bias reasoning is too brief. Explain what evidence supports your directional view.');
    confidence = 'low';
  }
  if (plan.invalidationReasoning.length < 15) {
    logicGaps.push('Your invalidation reasoning needs more detail. What specifically would prove your thesis wrong?');
    confidence = 'low';
  }
  if (plan.entryTrigger.length < 10) {
    logicGaps.push('Entry trigger is vague. What specific price action or condition will trigger your entry?');
    confidence = 'low';
  }

  const biasLower = plan.marketBias.toLowerCase();
  if ((plan.direction === 'long' && biasLower.includes('bearish')) || (plan.direction === 'short' && biasLower.includes('bullish'))) {
    warnings.push('Your trade direction conflicts with your stated market bias. Review your analysis.');
    confidence = 'low';
  }

  if (plan.riskRewardRatio < 1.5) {
    warnings.push(`Risk-reward ratio of ${plan.riskRewardRatio} is below the recommended minimum of 1.5.`);
  }
  if (plan.riskRewardRatio > 5) {
    suggestions.push('Very high R:R targets (>5:1) have lower probability of being hit. Ensure your target is realistic.');
  }
  if (plan.riskPercent > 1) {
    warnings.push(`Risking ${plan.riskPercent}% per trade. Consider keeping risk at or below 1%.`);
  }

  const pairInfo = PAIR_INFO[plan.pair];
  if (pairInfo && pairInfo.category === 'exotic') {
    warnings.push('Exotic pairs have wider spreads and lower liquidity.');
  }
  if (plan.setupType.length < 3) {
    logicGaps.push('Specify which pattern or setup type you are trading.');
  }

  const approved = logicGaps.length === 0 && warnings.filter((w) => w.includes('conflicts')).length === 0;
  if (logicGaps.length > 0) confidence = 'low';
  else if (warnings.length > 0) confidence = 'medium';

  if (approved && suggestions.length === 0 && warnings.length === 0) {
    suggestions.push('Plan looks structured. Execute with discipline and respect your invalidation point.');
  }

  return { approved, confidence, warnings, logicGaps, suggestions };
}
