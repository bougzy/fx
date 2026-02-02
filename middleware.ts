import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Use the Edge-compatible authConfig (no mongoose/Node.js deps) for middleware.
// The full auth (with Credentials + DB) is only used in API routes / server components.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images|sw.js|workbox-|manifest).*)'],
};
