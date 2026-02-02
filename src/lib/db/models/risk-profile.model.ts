import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRiskProfile extends Document {
  userId: mongoose.Types.ObjectId;
  accountBalance: number;
  maxRiskPerTrade: number;
  maxDailyDrawdown: number;
  maxWeeklyDrawdown: number;
  maxOpenPositions: number;
  maxDailyTrades: number;
  allowedPairs: string[];
  allowedSessions: string[];
  currentState: {
    dailyPnl: number;
    weeklyPnl: number;
    dailyTradeCount: number;
    openPositionCount: number;
    consecutiveLosses: number;
    lastTradeAt?: Date;
    isInCooldown: boolean;
    cooldownEndsAt?: Date;
    blockReason?: string;
  };
}

const riskProfileSchema = new Schema<IRiskProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    accountBalance: { type: Number, default: 10000 },
    maxRiskPerTrade: { type: Number, default: 1 },
    maxDailyDrawdown: { type: Number, default: 3 },
    maxWeeklyDrawdown: { type: Number, default: 5 },
    maxOpenPositions: { type: Number, default: 1 },
    maxDailyTrades: { type: Number, default: 3 },
    allowedPairs: [String],
    allowedSessions: [{ type: String, enum: ['asian', 'london', 'newyork'] }],
    currentState: {
      dailyPnl: { type: Number, default: 0 },
      weeklyPnl: { type: Number, default: 0 },
      dailyTradeCount: { type: Number, default: 0 },
      openPositionCount: { type: Number, default: 0 },
      consecutiveLosses: { type: Number, default: 0 },
      lastTradeAt: Date,
      isInCooldown: { type: Boolean, default: false },
      cooldownEndsAt: Date,
      blockReason: String,
    },
  },
  { timestamps: true }
);

riskProfileSchema.index({ userId: 1 });

export const RiskProfile: Model<IRiskProfile> = mongoose.models.RiskProfile || mongoose.model<IRiskProfile>('RiskProfile', riskProfileSchema);
