import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'student' | 'mentor' | 'admin';
      currentStage: string;
      behaviorScore: number;
      riskComplianceScore: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'student' | 'mentor' | 'admin';
    currentStage: string;
    behaviorScore: number;
    riskComplianceScore: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'student' | 'mentor' | 'admin';
    currentStage: string;
    behaviorScore: number;
    riskComplianceScore: number;
  }
}
