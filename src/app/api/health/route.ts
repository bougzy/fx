import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const envStatus = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL || null,
  };

  const allSet = envStatus.MONGODB_URI && envStatus.AUTH_SECRET;

  return NextResponse.json({
    status: allSet ? 'ok' : 'missing_env_vars',
    env: envStatus,
    message: allSet
      ? 'All required environment variables are set'
      : 'Missing required environment variables. Set MONGODB_URI and AUTH_SECRET in Vercel dashboard.',
  });
}
