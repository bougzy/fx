import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
  currentStage: string;
  stageHistory: Array<{ stage: string; enteredAt: Date; exitedAt?: Date; exitReason?: string }>;
  onboarding: {
    completed: boolean;
    completedAt?: Date;
    experienceLevel?: 'none' | 'beginner' | 'intermediate' | 'advanced';
    motivations?: string[];
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
    commitmentAcknowledged: boolean;
  };
  behaviorScore: number;
  riskComplianceScore: number;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    currentStage: { type: String, default: 'onboarding' },
    stageHistory: [{ stage: String, enteredAt: { type: Date, default: Date.now }, exitedAt: Date, exitReason: String }],
    onboarding: {
      completed: { type: Boolean, default: false },
      completedAt: Date,
      experienceLevel: { type: String, enum: ['none', 'beginner', 'intermediate', 'advanced'] },
      motivations: [String],
      riskTolerance: { type: String, enum: ['conservative', 'moderate', 'aggressive'] },
      commitmentAcknowledged: { type: Boolean, default: false },
    },
    behaviorScore: { type: Number, default: 100, min: 0, max: 100 },
    riskComplianceScore: { type: Number, default: 100, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
