'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function deleteChapter(chapterId: string) {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    await db.chapter.delete({
      where: { id: chapterId },
    });
  } catch (error) {
    console.error('[DELETE_CHAPTER]', error);
    return { error: 'Internal Error' };
  }
}
