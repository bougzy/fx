import { PAIR_INFO, getPipValue } from '@/lib/constants/pairs';

export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  stopDistancePips: number,
  pair: string,
  accountCurrency: string = 'USD'
): number {
  if (stopDistancePips <= 0 || riskPercent <= 0 || accountBalance <= 0) return 0;

  const riskAmount = accountBalance * (riskPercent / 100);
  const pipValue = getPipValue(pair);
  const info = PAIR_INFO[pair];

  if (!info) return 0;

  const pipValuePerLot = pipValue * 100000;
  const lots = riskAmount / (stopDistancePips * pipValuePerLot);
  return Math.floor(lots * 100) / 100;
}

export function calculateRiskAmount(
  accountBalance: number,
  riskPercent: number
): number {
  return accountBalance * (riskPercent / 100);
}

export function calculateStopDistancePips(
  entryPrice: number,
  stopLossPrice: number,
  pair: string
): number {
  const pipSize = getPipValue(pair);
  return Math.abs(entryPrice - stopLossPrice) / pipSize;
}

export function calculateRiskRewardRatio(
  entryPrice: number,
  stopLossPrice: number,
  takeProfitPrice: number
): number {
  const risk = Math.abs(entryPrice - stopLossPrice);
  const reward = Math.abs(takeProfitPrice - entryPrice);
  if (risk === 0) return 0;
  return Math.round((reward / risk) * 100) / 100;
}

export function calculatePnlPips(
  direction: 'long' | 'short',
  entryPrice: number,
  exitPrice: number,
  pair: string
): number {
  const pipSize = getPipValue(pair);
  const diff = direction === 'long'
    ? exitPrice - entryPrice
    : entryPrice - exitPrice;
  return Math.round((diff / pipSize) * 10) / 10;
}

export function calculatePnlAmount(
  pnlPips: number,
  lotSize: number,
  pair: string
): number {
  const pipSize = getPipValue(pair);
  const pipValuePerLot = pipSize * 100000;
  return Math.round(pnlPips * lotSize * pipValuePerLot * 100) / 100;
}

export function formatPrice(price: number, pair: string): string {
  const info = PAIR_INFO[pair];
  const decimals = info ? (info.pipDecimalPlace === 2 ? 3 : 5) : 5;
  return price.toFixed(decimals);
}

export function formatPips(pips: number): string {
  return `${pips >= 0 ? '+' : ''}${pips.toFixed(1)} pips`;
}
