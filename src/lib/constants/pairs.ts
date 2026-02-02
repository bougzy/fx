export const MAJOR_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
  'AUD/USD', 'USD/CAD', 'NZD/USD',
] as const;

export const MINOR_PAIRS = [
  'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF',
  'EUR/AUD', 'GBP/AUD', 'AUD/JPY', 'NZD/JPY',
  'GBP/CHF', 'EUR/CAD', 'AUD/CAD', 'CAD/JPY',
] as const;

export type MajorPair = (typeof MAJOR_PAIRS)[number];
export type MinorPair = (typeof MINOR_PAIRS)[number];
export type ForexPair = MajorPair | MinorPair;

export const ALL_PAIRS = [...MAJOR_PAIRS, ...MINOR_PAIRS] as const;

export interface PairInfo {
  pair: string;
  pipDecimalPlace: number;
  category: 'major' | 'minor' | 'exotic';
  baseCurrency: string;
  quoteCurrency: string;
  averageSpreadPips: number;
}

export const PAIR_INFO: Record<string, PairInfo> = {
  'EUR/USD': { pair: 'EUR/USD', pipDecimalPlace: 4, category: 'major', baseCurrency: 'EUR', quoteCurrency: 'USD', averageSpreadPips: 1.0 },
  'GBP/USD': { pair: 'GBP/USD', pipDecimalPlace: 4, category: 'major', baseCurrency: 'GBP', quoteCurrency: 'USD', averageSpreadPips: 1.2 },
  'USD/JPY': { pair: 'USD/JPY', pipDecimalPlace: 2, category: 'major', baseCurrency: 'USD', quoteCurrency: 'JPY', averageSpreadPips: 1.0 },
  'USD/CHF': { pair: 'USD/CHF', pipDecimalPlace: 4, category: 'major', baseCurrency: 'USD', quoteCurrency: 'CHF', averageSpreadPips: 1.5 },
  'AUD/USD': { pair: 'AUD/USD', pipDecimalPlace: 4, category: 'major', baseCurrency: 'AUD', quoteCurrency: 'USD', averageSpreadPips: 1.2 },
  'USD/CAD': { pair: 'USD/CAD', pipDecimalPlace: 4, category: 'major', baseCurrency: 'USD', quoteCurrency: 'CAD', averageSpreadPips: 1.5 },
  'NZD/USD': { pair: 'NZD/USD', pipDecimalPlace: 4, category: 'major', baseCurrency: 'NZD', quoteCurrency: 'USD', averageSpreadPips: 1.8 },
  'EUR/GBP': { pair: 'EUR/GBP', pipDecimalPlace: 4, category: 'minor', baseCurrency: 'EUR', quoteCurrency: 'GBP', averageSpreadPips: 1.5 },
  'EUR/JPY': { pair: 'EUR/JPY', pipDecimalPlace: 2, category: 'minor', baseCurrency: 'EUR', quoteCurrency: 'JPY', averageSpreadPips: 1.5 },
  'GBP/JPY': { pair: 'GBP/JPY', pipDecimalPlace: 2, category: 'minor', baseCurrency: 'GBP', quoteCurrency: 'JPY', averageSpreadPips: 2.0 },
};

export const MARKET_SESSIONS = {
  ASIAN: { name: 'Asian', open: '00:00', close: '09:00', timezone: 'UTC' },
  LONDON: { name: 'London', open: '08:00', close: '17:00', timezone: 'UTC' },
  NEW_YORK: { name: 'New York', open: '13:00', close: '22:00', timezone: 'UTC' },
} as const;

export type SessionName = 'asian' | 'london' | 'newyork';

export function getPipValue(pair: string): number {
  const info = PAIR_INFO[pair];
  if (!info) return 0.0001;
  return info.pipDecimalPlace === 2 ? 0.01 : 0.0001;
}

export function calculatePips(pair: string, entryPrice: number, exitPrice: number): number {
  const pipSize = getPipValue(pair);
  return (exitPrice - entryPrice) / pipSize;
}
