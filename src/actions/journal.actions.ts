'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { JournalEntry } from '@/lib/db/models/journal-entry.model';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const JournalSchema = z.object({
  entryType: z.enum(['trade_review', 'daily_reflection', 'weekly_review', 'lesson_learned', 'emotional_log']),
  title: z.string().min(3),
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
  emotionalState: z.enum(['calm', 'anxious', 'confident', 'frustrated', 'neutral', 'excited']).optional(),
  processRating: z.number().min(1).max(5).optional(),
  tradeId: z.string().optional(),
});

export async function createJournalEntry(data: z.infer<typeof JournalSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  const parsed = JournalSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();
  const entry = await JournalEntry.create({
    userId: session.user.id,
    tradeId: parsed.data.tradeId || undefined,
    entryType: parsed.data.entryType,
    title: parsed.data.title,
    content: parsed.data.content,
    tags: parsed.data.tags || [],
    emotionalState: parsed.data.emotionalState,
    processRating: parsed.data.processRating,
  });
  revalidatePath('/journal');
  return { success: true, entryId: entry._id.toString() };
}
