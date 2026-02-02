import { auth } from './auth';
import { isStageAtLeast, type Stage, STAGE_ALLOWED_ROUTES } from '@/lib/constants/stages';
import { NextResponse } from 'next/server';

export async function getAuthSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session;
}

export function withApiAuth(
  handler: (req: Request, context: { params: any; session: any }) => Promise<Response>,
  options?: { requiredStage?: Stage }
) {
  return async (req: Request, context: { params: any }) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (options?.requiredStage) {
      const userStage = (session.user as any).currentStage as Stage;
      if (!isStageAtLeast(userStage, options.requiredStage)) {
        return NextResponse.json({ error: 'Stage access denied' }, { status: 403 });
      }
    }

    return handler(req, { ...context, session });
  };
}
