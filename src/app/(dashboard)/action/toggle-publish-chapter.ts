'use server';

import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { Chapter } from '@prisma/client';

interface PublishChapterResult {
  chapter: Chapter | null;
  error?: string;
}

export async function toggleChapterPublication(
  chapterId: string,
  publish: boolean
): Promise<PublishChapterResult> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { chapter: null, error: 'Unauthorized' };
  }

  try {
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        quizs: {
          include: {
            questions: { include: { options: true } },
          },
        },
      },
    });

    if (!chapter) {
      return { chapter: null, error: 'Course not found' };
    }

    if (publish) {
      if (!chapter.title || !chapter.description) {
        return {
          chapter: null,
          error: 'Missing required fields for publication',
        };
      }
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: publish,
      },
    });
    return { chapter: updatedChapter };
  } catch (error) {
    console.error('[CHAPTERS]', error);
    return { chapter: null, error: 'Internal Error' };
  }
}
