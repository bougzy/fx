export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SimulationConfig {
  pair: string;
  sessionType: 'demo_basic' | 'demo_realistic' | 'stress_test';
  spreadPips: number;
  slippagePips: number;
  volatilityMultiplier: number;
  initialBalance: number;
}

export function generateSyntheticCandles(basePrice: number, count: number, volatility: number = 0.0005, trend: number = 0): CandleData[] {
  const candles: CandleData[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < count; i++) {
    const trendComponent = trend * 0.0001;
    const randomComponent = (Math.random() - 0.5) * 2 * volatility;
    const change = trendComponent + randomComponent;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    candles.push({
      time: now - (count - i) * 60,
      open: Math.round(open * 100000) / 100000,
      high: Math.round(high * 100000) / 100000,
      low: Math.round(low * 100000) / 100000,
      close: Math.round(close * 100000) / 100000,
    });
    currentPrice = close;
  }
  return candles;
}

export function applyRealisticConditions(price: number, config: SimulationConfig, direction: 'long' | 'short'): { executionPrice: number; spread: number; slippage: number } {
  const pipSize = config.pair.includes('JPY') ? 0.01 : 0.0001;
  const spread = config.spreadPips * pipSize;
  const slippage = (Math.random() * config.slippagePips) * pipSize;
  let executionPrice: number;
  if (direction === 'long') {
    executionPrice = price + spread / 2 + slippage;
  } else {
    executionPrice = price - spread / 2 - slippage;
  }
  return { executionPrice: Math.round(executionPrice * 100000) / 100000, spread: Math.round(spread * 100000) / 100000, slippage: Math.round(slippage * 100000) / 100000 };
}

export function getDefaultSimConfig(sessionType: 'demo_basic' | 'demo_realistic' | 'stress_test', pair: string): SimulationConfig {
  const configs: Record<string, Partial<SimulationConfig>> = {
    demo_basic: { spreadPips: 0, slippagePips: 0, volatilityMultiplier: 1.0 },
    demo_realistic: { spreadPips: 1.5, slippagePips: 0.5, volatilityMultiplier: 1.0 },
    stress_test: { spreadPips: 3.0, slippagePips: 2.0, volatilityMultiplier: 2.0 },
  };
  return { pair, sessionType, initialBalance: 10000, spreadPips: configs[sessionType]?.spreadPips ?? 0, slippagePips: configs[sessionType]?.slippagePips ?? 0, volatilityMultiplier: configs[sessionType]?.volatilityMultiplier ?? 1 };
}
