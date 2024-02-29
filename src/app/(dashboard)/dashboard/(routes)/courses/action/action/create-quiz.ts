'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Quiz } from '@prisma/client';

export async function createQuiz(
  chapterId: string,
  title: string
): Promise<Quiz> {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      throw new Error('Unauthorized');
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        chapterId,
      },
    });

    return quiz;
  } catch (error) {
    console.error('[CREATE_QUIZ]', error);
    throw error;
  }
}
