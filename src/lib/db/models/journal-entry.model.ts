import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  tradeId?: mongoose.Types.ObjectId;
  entryType: 'trade_review' | 'daily_reflection' | 'weekly_review' | 'lesson_learned' | 'emotional_log';
  title: string;
  content: string;
  emotionalState?: 'calm' | 'anxious' | 'confident' | 'frustrated' | 'neutral' | 'excited';
  processRating?: number;
  tags: string[];
  isPrivate: boolean;
}

const journalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tradeId: { type: Schema.Types.ObjectId, ref: 'Trade' },
    entryType: { type: String, enum: ['trade_review', 'daily_reflection', 'weekly_review', 'lesson_learned', 'emotional_log'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    emotionalState: { type: String, enum: ['calm', 'anxious', 'confident', 'frustrated', 'neutral', 'excited'] },
    processRating: { type: Number, min: 1, max: 5 },
    tags: [String],
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

journalEntrySchema.index({ userId: 1, createdAt: -1 });
journalEntrySchema.index({ userId: 1, entryType: 1 });

export const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);
