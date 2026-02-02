import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ILessonProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  quizScore?: number;
  quizAttempts: number;
  reviewCount: number;
  nextReviewAt?: Date;
  timeSpentMinutes: number;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: String, required: true },
    lessonId: { type: String, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    completedAt: Date,
    quizScore: Number,
    quizAttempts: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    nextReviewAt: Date,
    timeSpentMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress: Model<ILessonProgress> = mongoose.models.LessonProgress || mongoose.model<ILessonProgress>('LessonProgress', lessonProgressSchema);
