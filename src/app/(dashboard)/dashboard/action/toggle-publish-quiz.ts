'use server';

import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { Quiz } from '@/schemas/db-schema';

interface PublishChapterResult {
  quiz: Quiz | null;
  error?: string;
}

export async function toggleQuizPublication(
  quizId: string,
  publish: boolean
): Promise<PublishChapterResult> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { quiz: null, error: 'Unauthorized' };
  }

  try {
    const quiz = await db.quiz.findUnique({
      where: {
        id: quizId,
      },

      include: {
        questions: { include: { options: true } },
      },
    });

    if (!quiz) {
      return { quiz: null, error: 'Chapter not found' };
    }

    if (publish) {
      if (!quiz.title || !quiz.questions) {
        return {
          quiz: null,
          error: 'Missing required fields for publication',
        };
      }
    }

    const updatedQuiz = await db.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        isPublished: publish,
      },
    });
    return { quiz: updatedQuiz };
  } catch (error) {
    console.error('[QUIZS]', error);
    return { quiz: null, error: 'Internal Error' };
  }
}
