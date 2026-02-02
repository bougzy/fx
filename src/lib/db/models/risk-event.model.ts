import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRiskEvent extends Document {
  userId: mongoose.Types.ObjectId;
  tradeId?: mongoose.Types.ObjectId;
  eventType: 'trade_blocked' | 'cooldown_triggered' | 'drawdown_breach' | 'regression_triggered' | 'limit_warning';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  riskStateSnapshot: {
    dailyPnl: number;
    weeklyPnl: number;
    consecutiveLosses: number;
    behaviorScore: number;
  };
  resolvedAt?: Date;
}

const riskEventSchema = new Schema<IRiskEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tradeId: { type: Schema.Types.ObjectId, ref: 'Trade' },
    eventType: { type: String, enum: ['trade_blocked', 'cooldown_triggered', 'drawdown_breach', 'regression_triggered', 'limit_warning'], required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], required: true },
    details: { type: String, required: true },
    riskStateSnapshot: {
      dailyPnl: Number,
      weeklyPnl: Number,
      consecutiveLosses: Number,
      behaviorScore: Number,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

riskEventSchema.index({ userId: 1, createdAt: -1 });

export const RiskEvent: Model<IRiskEvent> = mongoose.models.RiskEvent || mongoose.model<IRiskEvent>('RiskEvent', riskEventSchema);
