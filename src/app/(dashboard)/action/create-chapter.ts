'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Chapter } from '@prisma/client';

export async function createChapter(
  courseId: string,
  title: string
): Promise<Chapter> {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: session?.id,
      },
    });

    if (!courseOwner) {
      throw new Error('Unauthorized');
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      },
    });

    return chapter;
  } catch (error) {
    console.error('[CREATE_CHAPTER]', error);
    throw error;
  }
}
