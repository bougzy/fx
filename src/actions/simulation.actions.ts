'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { SimulationSession } from '@/lib/db/models/simulation-session.model';
import { revalidatePath } from 'next/cache';

export async function startSimulationSession(sessionType: 'demo_basic' | 'demo_realistic' | 'market_replay' | 'stress_test') {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  await connectDB();
  const simSession = await SimulationSession.create({
    userId: session.user.id, sessionType, startedAt: new Date(),
    performance: { totalTrades: 0, winRate: 0, avgRR: 0, maxDrawdown: 0, behaviorScore: 100 },
    passed: false, failureReasons: [],
  });
  return { success: true, sessionId: simSession._id.toString() };
}

export async function endSimulationSession(
  sessionId: string,
  performance: { totalTrades: number; winRate: number; avgRR: number; maxDrawdown: number; behaviorScore: number }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  await connectDB();

  const failureReasons: string[] = [];
  const passed = performance.winRate >= 40 && performance.avgRR >= 1.5 && performance.behaviorScore >= 70 && performance.maxDrawdown <= 5;
  if (performance.winRate < 40) failureReasons.push('Win rate below 40%');
  if (performance.avgRR < 1.5) failureReasons.push('Average R:R below 1.5');
  if (performance.behaviorScore < 70) failureReasons.push('Behavior score below 70');
  if (performance.maxDrawdown > 5) failureReasons.push('Max drawdown exceeded 5%');

  await SimulationSession.updateOne({ _id: sessionId, userId: session.user.id }, { endedAt: new Date(), performance, passed, failureReasons });
  revalidatePath('/simulate');
  revalidatePath('/dashboard');
  return { success: true, passed, failureReasons };
}
