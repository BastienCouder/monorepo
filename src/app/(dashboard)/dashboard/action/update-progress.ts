'use server';
import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';
import { UserProgress } from '@prisma/client';

export async function updateProgress(
  chapterId: string
): Promise<UserProgress | { error: string }> {
  try {
    const session = await currentUser();
    if (!session) {
      return { error: 'Session not found' };
    }

    const userId = session.id;

    const existingProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    const isCompleted = existingProgress ? !existingProgress.isCompleted : true;

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: { isCompleted },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return userProgress;
  } catch (error) {
    console.error('[CHAPTER_ID_PROGRESS]', error);
    return { error: 'Failed to update progress' };
  }
}
