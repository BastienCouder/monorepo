'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function deleteContent(contentId: string) {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    await db.content.delete({
      where: { id: contentId },
    });
  } catch (error) {
    console.error('[DELETE_CONTENT]', error);
    return { error: 'Internal Error' };
  }
}
