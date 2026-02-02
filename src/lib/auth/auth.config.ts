import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/welcome',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPlatform = nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/learn') ||
        nextUrl.pathname.startsWith('/patterns') ||
        nextUrl.pathname.startsWith('/simulate') ||
        nextUrl.pathname.startsWith('/trade') ||
        nextUrl.pathname.startsWith('/journal') ||
        nextUrl.pathname.startsWith('/analytics') ||
        nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/settings');
      const isOnOnboarding = nextUrl.pathname.startsWith('/welcome') ||
        nextUrl.pathname.startsWith('/assessment') ||
        nextUrl.pathname.startsWith('/commitment');
      const isOnAuth = nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/register');

      if (isOnPlatform || isOnOnboarding) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role || 'student';
        token.currentStage = (user as any).currentStage || 'onboarding';
        token.behaviorScore = (user as any).behaviorScore ?? 100;
        token.riskComplianceScore = (user as any).riskComplianceScore ?? 100;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.currentStage = token.currentStage as string;
        session.user.behaviorScore = token.behaviorScore as number;
        session.user.riskComplianceScore = token.riskComplianceScore as number;
      }
      return session;
    },
  },
  providers: [],
};
