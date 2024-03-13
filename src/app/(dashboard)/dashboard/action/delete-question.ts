'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function deleteQuestion(questionId: string) {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    await db.option.deleteMany({
      where: {
        questionId,
      },
    });

    await db.question.delete({
      where: {
        id: questionId,
      },
    });
  } catch (error) {
    console.error('[DELETE_QUESTION]', error);
    return { error: 'Internal Error' };
  }
}
