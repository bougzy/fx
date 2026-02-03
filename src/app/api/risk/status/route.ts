import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { RiskProfile } from '@/lib/db/models/risk-profile.model';

// Force Node.js runtime (uses mongoose)
export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const profile = await RiskProfile.findOne({ userId: session.user.id });

  if (!profile) {
    return NextResponse.json({
      dailyPnl: 0, weeklyPnl: 0, dailyTradeCount: 0,
      openPositionCount: 0, consecutiveLosses: 0, isInCooldown: false,
      accountBalance: 10000,
    });
  }

  return NextResponse.json({
    dailyPnl: profile.currentState.dailyPnl,
    weeklyPnl: profile.currentState.weeklyPnl,
    dailyTradeCount: profile.currentState.dailyTradeCount,
    openPositionCount: profile.currentState.openPositionCount,
    consecutiveLosses: profile.currentState.consecutiveLosses,
    isInCooldown: profile.currentState.isInCooldown,
    cooldownEndsAt: profile.currentState.cooldownEndsAt,
    accountBalance: profile.accountBalance,
  });
}
