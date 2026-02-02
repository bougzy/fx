'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/user.model';
import { RiskProfile } from '@/lib/db/models/risk-profile.model';
import { MAJOR_PAIRS } from '@/lib/constants/pairs';
import { AuthError } from 'next-auth';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase letter').regex(/[0-9]/, 'Must contain a number'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function registerUser(prevState: any, formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await connectDB();
    const existingUser = await User.findOne({ email: parsed.data.email });
    if (existingUser) return { error: 'An account with this email already exists.' };

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      email: parsed.data.email, passwordHash, name: parsed.data.name,
      role: 'student', currentStage: 'onboarding',
      stageHistory: [{ stage: 'onboarding', enteredAt: new Date() }],
      onboarding: { completed: false, experienceLevel: 'none', motivations: [], riskTolerance: 'conservative', commitmentAcknowledged: false },
      behaviorScore: 100, riskComplianceScore: 100,
    });

    await RiskProfile.create({
      userId: user._id, accountBalance: 10000,
      maxRiskPerTrade: 1, maxDailyDrawdown: 3, maxWeeklyDrawdown: 5, maxOpenPositions: 1, maxDailyTrades: 3,
      allowedPairs: [...MAJOR_PAIRS], allowedSessions: ['london', 'newyork'],
      currentState: { dailyPnl: 0, weeklyPnl: 0, dailyTradeCount: 0, openPositionCount: 0, consecutiveLosses: 0, isInCooldown: false },
    });

    await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, redirectTo: '/welcome' });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Registration succeeded but auto-login failed. Please sign in.' };
    throw error;
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const parsed = LoginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') return { error: 'Invalid email or password.' };
      return { error: 'Something went wrong. Please try again.' };
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/' });
}
