import { create } from 'zustand';

interface TradeFormState {
  pair: string;
  direction: 'long' | 'short';
  entryPrice: string;
  stopLossPrice: string;
  takeProfitPrice: string;
  lotSize: string;
  marketBias: string;
  biasReasoning: string;
  setupType: string;
  entryTrigger: string;
  invalidationPoint: string;
  invalidationReasoning: string;
  setPair: (pair: string) => void;
  setDirection: (direction: 'long' | 'short') => void;
  setEntryPrice: (price: string) => void;
  setStopLossPrice: (price: string) => void;
  setTakeProfitPrice: (price: string) => void;
  setLotSize: (size: string) => void;
  setMarketBias: (bias: string) => void;
  setBiasReasoning: (reasoning: string) => void;
  setSetupType: (type: string) => void;
  setEntryTrigger: (trigger: string) => void;
  setInvalidationPoint: (point: string) => void;
  setInvalidationReasoning: (reasoning: string) => void;
  reset: () => void;
}

const initialState = {
  pair: 'EUR/USD',
  direction: 'long' as const,
  entryPrice: '',
  stopLossPrice: '',
  takeProfitPrice: '',
  lotSize: '',
  marketBias: '',
  biasReasoning: '',
  setupType: '',
  entryTrigger: '',
  invalidationPoint: '',
  invalidationReasoning: '',
};

export const useTradeFormStore = create<TradeFormState>((set) => ({
  ...initialState,
  setPair: (pair) => set({ pair }),
  setDirection: (direction) => set({ direction }),
  setEntryPrice: (entryPrice) => set({ entryPrice }),
  setStopLossPrice: (stopLossPrice) => set({ stopLossPrice }),
  setTakeProfitPrice: (takeProfitPrice) => set({ takeProfitPrice }),
  setLotSize: (lotSize) => set({ lotSize }),
  setMarketBias: (marketBias) => set({ marketBias }),
  setBiasReasoning: (biasReasoning) => set({ biasReasoning }),
  setSetupType: (setupType) => set({ setupType }),
  setEntryTrigger: (entryTrigger) => set({ entryTrigger }),
  setInvalidationPoint: (invalidationPoint) => set({ invalidationPoint }),
  setInvalidationReasoning: (invalidationReasoning) => set({ invalidationReasoning }),
  reset: () => set(initialState),
}));
