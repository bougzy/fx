import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPatternProgress extends Document {
  userId: mongoose.Types.ObjectId;
  patternId: string;
  status: 'locked' | 'learning' | 'practicing' | 'mastered';
  practiceTradeCount: number;
  successRate: number;
  avgRR: number;
  lastPracticedAt?: Date;
  masteredAt?: Date;
  notes: string[];
}

const patternProgressSchema = new Schema<IPatternProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patternId: { type: String, required: true },
    status: { type: String, enum: ['locked', 'learning', 'practicing', 'mastered'], default: 'locked' },
    practiceTradeCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    avgRR: { type: Number, default: 0 },
    lastPracticedAt: Date,
    masteredAt: Date,
    notes: [String],
  },
  { timestamps: true }
);

patternProgressSchema.index({ userId: 1, patternId: 1 }, { unique: true });

export const PatternProgress: Model<IPatternProgress> = mongoose.models.PatternProgress || mongoose.model<IPatternProgress>('PatternProgress', patternProgressSchema);
