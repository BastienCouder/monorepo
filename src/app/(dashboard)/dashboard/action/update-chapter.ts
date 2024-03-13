'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Chapter } from '@prisma/client';

export async function updateChapter<T extends Partial<Chapter>>(
  chapterId: string,
  values: T
): Promise<Chapter | { error: string }> {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: values,
    });

    return updatedChapter;
  } catch (error) {
    console.error('[UPDATE_CHAPTER]', error);
    return { error: 'Internal Error' };
  }
}
