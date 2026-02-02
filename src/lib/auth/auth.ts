import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/user.model';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+passwordHash');
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          currentStage: user.currentStage,
          behaviorScore: user.behaviorScore,
          riskComplianceScore: user.riskComplianceScore,
        };
      },
    }),
  ],
});
