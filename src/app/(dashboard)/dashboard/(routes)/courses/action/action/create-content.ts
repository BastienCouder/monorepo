'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Content } from '@/schemas/db-schema';

export async function createContent<T extends Partial<Content>>(
  chapterId: string,
  values: T,
  title: string
): Promise<Content | { error: string }> {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const chapterOwner = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapterOwner) {
      throw new Error('Unauthorized');
    }

    const lastContent = await db.content.findFirst({
      where: { chapterId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastContent ? lastContent.position + 1 : 1;

    // Construit l'objet de données étape par étape
    let data: any = { ...values, title };
    data.chapterId = chapterId;
    data.position = newPosition;

    const content = await db.content.create({
      data: data as { title: string } & T & {
          chapterId: string;
          position: number;
        },
    });

    return content;
  } catch (error) {
    console.error('[CREATE_CONTENT]', error);
    throw error;
  }
}
