'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

interface ContentUpdate {
  id: string;
  position: number;
}

export async function reorderContents(
  chapterId: string,
  list: { id: string; position: number }[]
) {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const ownChapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!ownChapter) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updates = list.map((item: ContentUpdate) => {
      return db.content.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    });
    await db.$transaction(updates);
  } catch (error) {
    console.error('[REORDER_CHAPTERS]', error);
    throw error;
  }
}
