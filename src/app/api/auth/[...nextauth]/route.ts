import { handlers } from '@/lib/auth/auth';

// Force Node.js runtime for auth routes (not Edge)
export const runtime = 'nodejs';

export const { GET, POST } = handlers;
