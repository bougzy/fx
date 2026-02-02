'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import { LessonProgress } from '@/lib/db/models/lesson-progress.model';
import { revalidatePath } from 'next/cache';

export async function startLesson(courseId: string, lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  await connectDB();
  await LessonProgress.findOneAndUpdate(
    { userId: session.user.id, lessonId },
    { $setOnInsert: { userId: session.user.id, courseId, lessonId, status: 'in_progress', percentComplete: 0, startedAt: new Date() } },
    { upsert: true }
  );
  revalidatePath('/learn');
  return { success: true };
}

export async function completeLesson(courseId: string, lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  await connectDB();

  const progress = await LessonProgress.findOne({ userId: session.user.id, lessonId });
  const reviewCount = progress?.reviewCount || 0;
  const daysUntilReview = Math.pow(2, reviewCount);
  const nextReviewAt = new Date(Date.now() + daysUntilReview * 24 * 60 * 60 * 1000);

  await LessonProgress.findOneAndUpdate(
    { userId: session.user.id, lessonId },
    {
      $set: { status: 'completed', completedAt: new Date(), percentComplete: 100, lastReviewedAt: new Date(), nextReviewAt },
      $inc: { reviewCount: 1 },
      $setOnInsert: { userId: session.user.id, courseId, lessonId, startedAt: new Date() },
    },
    { upsert: true }
  );
  revalidatePath('/learn');
  revalidatePath('/dashboard');
  return { success: true, nextReviewAt };
}

export async function submitQuizAnswer(lessonId: string, questionId: string, correct: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };
  await connectDB();
  await LessonProgress.updateOne(
    { userId: session.user.id, lessonId },
    { $push: { inlineQuizResults: { questionId, correct, answeredAt: new Date() } } }
  );
  return { success: true };
}
