'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Content } from '@/schemas/db-schema';

export async function updateContent<T extends Partial<Content>>(
  contentId: string,
  values: T
): Promise<Content | { error: string }> {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedContent = await db.content.update({
      where: { id: contentId },
      data: values,
    });

    return updatedContent;
  } catch (error) {
    console.error('[UPDATE_CONTENT]', error);
    return { error: 'Internal Error' };
  }
}
