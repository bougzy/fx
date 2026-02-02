'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/user.model';

export async function completeAssessment(data: {
  experienceLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  motivations: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  await User.updateOne(
    { _id: session.user.id },
    {
      $set: {
        'onboarding.experienceLevel': data.experienceLevel,
        'onboarding.motivations': data.motivations,
        'onboarding.riskTolerance': data.riskTolerance,
      },
    }
  );

  return { success: true };
}

export async function completeOnboarding() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  await User.updateOne(
    { _id: session.user.id },
    {
      $set: {
        'onboarding.completed': true,
        'onboarding.completedAt': new Date(),
        'onboarding.commitmentAcknowledged': true,
        currentStage: 'stage_1_observer',
      },
      $push: {
        stageHistory: { stage: 'stage_1_observer', enteredAt: new Date() },
      },
    }
  );

  return { success: true };
}

export async function updateProfile(data: { name?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const updateFields: Record<string, string> = {};
  if (data.name) updateFields.name = data.name;

  if (Object.keys(updateFields).length > 0) {
    await User.updateOne({ _id: session.user.id }, { $set: updateFields });
  }

  return { success: true };
}
