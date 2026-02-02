export interface BehaviorContext {
  userId: string;
  recentTrades: Array<{
    entryTime: Date;
    exitTime?: Date;
    pnlAmount?: number;
    lotSize: number;
    status: string;
    exitReason?: string;
    stopLossPrice: number;
    tradePlanId?: string;
    entryPrice: number;
    plannedRR?: number;
    actualRR?: number;
  }>;
  currentState: {
    dailyTradeCount: number;
    consecutiveLosses: number;
    lastTradeAt?: Date;
    dailyPnl: number;
  };
  proposedTrade?: { lotSize: number; pair: string };
}

export interface DetectedFlag {
  flagType: string;
  severity: 'info' | 'warning' | 'critical';
  details: string;
}

export function detectBehaviorFlags(phase: 'pre_trade' | 'post_trade', context: BehaviorContext): DetectedFlag[] {
  const flags: DetectedFlag[] = [];
  if (phase === 'pre_trade') {
    flags.push(...detectOvertrading(context));
    flags.push(...detectRevengeTrading(context));
    flags.push(...detectLossChasing(context));
  }
  if (phase === 'post_trade') {
    flags.push(...detectEarlyExit(context));
  }
  return flags;
}

function detectOvertrading(context: BehaviorContext): DetectedFlag[] {
  const flags: DetectedFlag[] = [];
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const recentCount = context.recentTrades.filter((t) => new Date(t.entryTime) > thirtyMinAgo).length;
  if (recentCount >= 3) {
    flags.push({ flagType: 'overtrading', severity: 'critical', details: `${recentCount} trades in the last 30 minutes. This indicates impulsive trading behavior.` });
  } else if (recentCount >= 2) {
    flags.push({ flagType: 'overtrading', severity: 'warning', details: `${recentCount} trades in the last 30 minutes. Slow down and evaluate each setup carefully.` });
  }
  return flags;
}

function detectRevengeTrading(context: BehaviorContext): DetectedFlag[] {
  const flags: DetectedFlag[] = [];
  if (context.recentTrades.length === 0) return flags;
  const lastTrade = context.recentTrades[context.recentTrades.length - 1];
  if (!lastTrade.exitTime || !lastTrade.pnlAmount) return flags;
  if (lastTrade.pnlAmount < 0) {
    const timeSinceLastExit = Date.now() - new Date(lastTrade.exitTime).getTime();
    if (timeSinceLastExit < 5 * 60 * 1000) {
      flags.push({ flagType: 'revenge_trading', severity: 'critical', details: 'New trade attempted within 5 minutes of a loss. This is a common revenge trading pattern.' });
    }
    if (context.proposedTrade && context.proposedTrade.lotSize > lastTrade.lotSize) {
      flags.push({ flagType: 'revenge_trading', severity: 'critical', details: 'Position size increased after a loss. This suggests attempting to recover losses aggressively.' });
    }
  }
  return flags;
}

function detectLossChasing(context: BehaviorContext): DetectedFlag[] {
  const flags: DetectedFlag[] = [];
  if (!context.proposedTrade || context.recentTrades.length < 2) return flags;
  const recentLosses = context.recentTrades.filter((t) => t.pnlAmount !== undefined && t.pnlAmount < 0).slice(-3);
  if (recentLosses.length >= 2) {
    const avgLotSize = recentLosses.reduce((sum, t) => sum + t.lotSize, 0) / recentLosses.length;
    if (context.proposedTrade.lotSize > avgLotSize * 1.2) {
      flags.push({ flagType: 'loss_chasing', severity: 'critical', details: 'Increasing position size after consecutive losses. This is loss-chasing behavior.' });
    }
  }
  return flags;
}

function detectEarlyExit(context: BehaviorContext): DetectedFlag[] {
  const flags: DetectedFlag[] = [];
  const lastTrade = context.recentTrades[context.recentTrades.length - 1];
  if (!lastTrade || !lastTrade.actualRR || !lastTrade.plannedRR) return flags;
  if (lastTrade.exitReason === 'manual_exit' && lastTrade.pnlAmount !== undefined && lastTrade.pnlAmount > 0 && lastTrade.actualRR < lastTrade.plannedRR * 0.5) {
    flags.push({ flagType: 'early_exit', severity: 'warning', details: `Exited at ${lastTrade.actualRR.toFixed(1)}R when plan targeted ${lastTrade.plannedRR.toFixed(1)}R. Less than 50% of planned move captured.` });
  }
  return flags;
}

export function calculateBehaviorScore(flags: Array<{ severity: 'info' | 'warning' | 'critical'; detectedAt: Date }>): number {
  const weights = { critical: 15, warning: 8, info: 3 };
  const now = Date.now();
  let penalty = 0;
  for (const flag of flags) {
    const ageDays = (now - new Date(flag.detectedAt).getTime()) / (24 * 60 * 60 * 1000);
    let recencyFactor: number;
    if (ageDays <= 1) recencyFactor = 1.0;
    else if (ageDays <= 7) recencyFactor = 0.7;
    else if (ageDays <= 30) recencyFactor = 0.4;
    else recencyFactor = 0.1;
    penalty += weights[flag.severity] * recencyFactor;
  }
  return Math.max(0, Math.min(100, Math.round(100 - penalty)));
}
