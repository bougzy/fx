import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITrade extends Document {
  userId: mongoose.Types.ObjectId;
  tradePlanId?: mongoose.Types.ObjectId;
  tradeType: 'demo_basic' | 'demo_realistic' | 'sim_stress' | 'live_micro' | 'live_mini' | 'live_standard';
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  entryTime: Date;
  exitTime?: Date;
  lotSize: number;
  stopLossPrice: number;
  takeProfitPrice?: number;
  riskAmount: number;
  riskPercent: number;
  plannedRR?: number;
  actualRR?: number;
  stopDistancePips: number;
  pnlAmount?: number;
  pnlPips?: number;
  pnlPercent?: number;
  tradeDurationMinutes?: number;
  exitReason?: 'tp_hit' | 'sl_hit' | 'manual_exit' | 'time_exit' | 'forced_close';
  status: 'planned' | 'open' | 'closed' | 'cancelled';
  contextAtEntry?: {
    marketSession?: string;
    volatilityRegime?: string;
    trendBias?: string;
    keyLevels?: string[];
  };
  preTradeCheck?: {
    completed: boolean;
    approved: boolean;
    warnings?: string[];
    overrideUsed?: boolean;
  };
  behaviorFlags: string[];
  debrief?: {
    completed: boolean;
    followedPlan?: boolean;
    emotionalState?: string;
    lessonsLearned?: string;
    rating?: number;
  };
}

const tradeSchema = new Schema<ITrade>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tradePlanId: { type: Schema.Types.ObjectId, ref: 'TradePlan' },
    tradeType: { type: String, enum: ['demo_basic', 'demo_realistic', 'sim_stress', 'live_micro', 'live_mini', 'live_standard'], required: true },
    pair: { type: String, required: true },
    direction: { type: String, enum: ['long', 'short'], required: true },
    entryPrice: { type: Number, required: true },
    exitPrice: Number,
    entryTime: { type: Date, default: Date.now },
    exitTime: Date,
    lotSize: { type: Number, required: true },
    stopLossPrice: { type: Number, required: true },
    takeProfitPrice: Number,
    riskAmount: { type: Number, required: true },
    riskPercent: { type: Number, required: true },
    plannedRR: Number,
    actualRR: Number,
    stopDistancePips: { type: Number, required: true },
    pnlAmount: Number,
    pnlPips: Number,
    pnlPercent: Number,
    tradeDurationMinutes: Number,
    exitReason: { type: String, enum: ['tp_hit', 'sl_hit', 'manual_exit', 'time_exit', 'forced_close'] },
    status: { type: String, enum: ['planned', 'open', 'closed', 'cancelled'], default: 'planned' },
    contextAtEntry: {
      marketSession: String,
      volatilityRegime: String,
      trendBias: String,
      keyLevels: [String],
    },
    preTradeCheck: {
      completed: { type: Boolean, default: false },
      approved: { type: Boolean, default: false },
      warnings: [String],
      overrideUsed: { type: Boolean, default: false },
    },
    behaviorFlags: [String],
    debrief: {
      completed: { type: Boolean, default: false },
      followedPlan: Boolean,
      emotionalState: String,
      lessonsLearned: String,
      rating: { type: Number, min: 1, max: 5 },
    },
  },
  { timestamps: true }
);

tradeSchema.index({ userId: 1, createdAt: -1 });
tradeSchema.index({ userId: 1, status: 1 });

export const Trade: Model<ITrade> = mongoose.models.Trade || mongoose.model<ITrade>('Trade', tradeSchema);
