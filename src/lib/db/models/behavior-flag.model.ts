import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IBehaviorFlag extends Document {
  userId: mongoose.Types.ObjectId;
  tradeId?: mongoose.Types.ObjectId;
  flagType: 'overtrading' | 'revenge_trading' | 'fomo_entry' | 'early_exit' | 'sl_manipulation' | 'position_sizing_violation' | 'session_violation' | 'emotional_trading' | 'plan_deviation' | 'loss_chasing';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

const behaviorFlagSchema = new Schema<IBehaviorFlag>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tradeId: { type: Schema.Types.ObjectId, ref: 'Trade' },
    flagType: {
      type: String,
      enum: ['overtrading', 'revenge_trading', 'fomo_entry', 'early_exit', 'sl_manipulation', 'position_sizing_violation', 'session_violation', 'emotional_trading', 'plan_deviation', 'loss_chasing'],
      required: true,
    },
    severity: { type: String, enum: ['info', 'warning', 'critical'], required: true },
    details: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
  },
  { timestamps: true }
);

behaviorFlagSchema.index({ userId: 1, detectedAt: -1 });
behaviorFlagSchema.index({ userId: 1, severity: 1, resolved: 1 });

export const BehaviorFlag: Model<IBehaviorFlag> = mongoose.models.BehaviorFlag || mongoose.model<IBehaviorFlag>('BehaviorFlag', behaviorFlagSchema);
