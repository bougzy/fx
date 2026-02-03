import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

// Force Node.js runtime for auth
export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userStage = session.user.currentStage || 'onboarding';

  return NextResponse.json({
    currentStage: userStage,
    canAdvance: false,
    criteria: {},
    regressionRisk: false,
  });
}
