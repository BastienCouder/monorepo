'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function deleteQuiz(quizId: string) {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    await db.quiz.delete({
      where: { id: quizId },
    });
  } catch (error) {
    console.error('[DELETE_QUIZ]', error);
    return { error: 'Internal Error' };
  }
}
