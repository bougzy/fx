'use client';

import { useCallback, useRef } from 'react';
import { useSimulationStore } from '@/stores/simulation.store';

export function useSimulation() {
  const store = useSimulationStore();
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const generateCandle = useCallback((basePrice: number) => {
    const volatility = 0.001;
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const open = basePrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
    return { time: Date.now(), open, high, low, close };
  }, []);

  const startSimulation = useCallback((sessionId: string, balance: number, startPrice: number) => {
    store.startSession(sessionId, balance);
    store.setCurrentPrice(startPrice);

    let lastPrice = startPrice;
    intervalRef.current = setInterval(() => {
      const candle = generateCandle(lastPrice);
      store.addCandle(candle);
      lastPrice = candle.close;
    }, 1000);
  }, [store, generateCandle]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    store.endSession();
  }, [store]);

  return { ...store, startSimulation, stopSimulation };
}
