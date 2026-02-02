import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ICourse extends Document {
  courseId: string;
  title: string;
  description: string;
  category: 'foundation' | 'technical' | 'risk_management' | 'psychology' | 'advanced';
  requiredStage: string;
  order: number;
  lessons: Array<{
    lessonId: string;
    title: string;
    content: string;
    type: 'text' | 'video' | 'quiz' | 'interactive';
    durationMinutes: number;
    order: number;
  }>;
  isPublished: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    courseId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['foundation', 'technical', 'risk_management', 'psychology', 'advanced'], required: true },
    requiredStage: { type: String, default: 'stage_1_observer' },
    order: { type: Number, default: 0 },
    lessons: [{
      lessonId: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, default: '' },
      type: { type: String, enum: ['text', 'video', 'quiz', 'interactive'], default: 'text' },
      durationMinutes: { type: Number, default: 10 },
      order: { type: Number, default: 0 },
    }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseSchema.index({ courseId: 1 });
courseSchema.index({ requiredStage: 1, order: 1 });

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
