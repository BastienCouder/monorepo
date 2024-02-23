'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

interface ChapterUpdate {
  id: string;
  position: number;
}

export async function reorderChapters(
  courseId: string,
  list: { id: string; position: number }[]
) {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId: session?.id,
      },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updates = list.map((item: ChapterUpdate) => {
      return db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    });

    await Promise.all(updates);
  } catch (error) {
    console.error('[REORDER_CHAPTERS]', error);
    throw error;
  }
}
