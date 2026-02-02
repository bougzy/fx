import { create } from 'zustand';

interface SimCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface SimTrade {
  id: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  lotSize: number;
  entryTime: number;
  exitPrice?: number;
  exitTime?: number;
  pnl?: number;
}

interface SimulationState {
  sessionId: string | null;
  isRunning: boolean;
  currentPrice: number;
  candles: SimCandle[];
  openTrades: SimTrade[];
  closedTrades: SimTrade[];
  balance: number;
  startSession: (sessionId: string, balance: number) => void;
  endSession: () => void;
  addCandle: (candle: SimCandle) => void;
  setCurrentPrice: (price: number) => void;
  openTrade: (trade: SimTrade) => void;
  closeTrade: (tradeId: string, exitPrice: number, exitTime: number, pnl: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  sessionId: null,
  isRunning: false,
  currentPrice: 0,
  candles: [],
  openTrades: [],
  closedTrades: [],
  balance: 10000,
  startSession: (sessionId, balance) => set({ sessionId, isRunning: true, balance, candles: [], openTrades: [], closedTrades: [] }),
  endSession: () => set({ isRunning: false }),
  addCandle: (candle) => set((state) => ({ candles: [...state.candles, candle], currentPrice: candle.close })),
  setCurrentPrice: (currentPrice) => set({ currentPrice }),
  openTrade: (trade) => set((state) => ({ openTrades: [...state.openTrades, trade] })),
  closeTrade: (tradeId, exitPrice, exitTime, pnl) =>
    set((state) => {
      const trade = state.openTrades.find((t) => t.id === tradeId);
      if (!trade) return state;
      const closedTrade = { ...trade, exitPrice, exitTime, pnl };
      return {
        openTrades: state.openTrades.filter((t) => t.id !== tradeId),
        closedTrades: [...state.closedTrades, closedTrade],
        balance: state.balance + pnl,
      };
    }),
}));
