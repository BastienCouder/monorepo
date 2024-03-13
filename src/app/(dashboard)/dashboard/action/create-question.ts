'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Questions } from '@/schemas/db-schema';

export async function createQuestion<T extends Partial<Questions>>(
  quizId: string,
  values: T,
  label: string
): Promise<Questions | { error: string }> {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const quizOwner = await db.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quizOwner) {
      throw new Error('Unauthorized');
    }

    const lastQuestion = await db.question.findFirst({
      where: { quizId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    let data: any = {
      ...values,
      label,
      quizId: quizId,
      position: newPosition,
      options: {
        create: values.options?.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      },
    };

    const question = await db.question.create({
      data,
      include: { options: true },
    });

    return question;
  } catch (error) {
    console.error('[CREATE_QUESTION]', error);
    throw error;
  }
}
