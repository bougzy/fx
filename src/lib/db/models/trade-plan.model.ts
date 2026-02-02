import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITradePlan extends Document {
  userId: mongoose.Types.ObjectId;
  tradeId?: mongoose.Types.ObjectId;
  pair: string;
  direction: 'long' | 'short';
  marketBias: string;
  biasReasoning: string;
  setupType: string;
  entryTrigger: string;
  invalidationPoint: string;
  invalidationReasoning: string;
  riskAmount: number;
  riskPercent: number;
  riskRewardRatio: number;
  mentoringResponse?: {
    approved: boolean;
    confidence: 'low' | 'medium' | 'high';
    warnings: string[];
    logicGaps: string[];
    suggestions: string[];
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'executed' | 'expired';
}

const tradePlanSchema = new Schema<ITradePlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tradeId: { type: Schema.Types.ObjectId, ref: 'Trade' },
    pair: { type: String, required: true },
    direction: { type: String, enum: ['long', 'short'], required: true },
    marketBias: { type: String, required: true },
    biasReasoning: { type: String, required: true },
    setupType: { type: String, required: true },
    entryTrigger: { type: String, required: true },
    invalidationPoint: { type: String, required: true },
    invalidationReasoning: { type: String, required: true },
    riskAmount: { type: Number, required: true },
    riskPercent: { type: Number, required: true },
    riskRewardRatio: { type: Number, required: true },
    mentoringResponse: {
      approved: Boolean,
      confidence: { type: String, enum: ['low', 'medium', 'high'] },
      warnings: [String],
      logicGaps: [String],
      suggestions: [String],
    },
    status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected', 'executed', 'expired'], default: 'draft' },
  },
  { timestamps: true }
);

tradePlanSchema.index({ userId: 1, createdAt: -1 });

export const TradePlan: Model<ITradePlan> = mongoose.models.TradePlan || mongoose.model<ITradePlan>('TradePlan', tradePlanSchema);
