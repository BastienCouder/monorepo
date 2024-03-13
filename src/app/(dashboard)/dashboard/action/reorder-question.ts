'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

interface QuestionUpdate {
  id: string;
  position: number;
}

export async function reorderQuestions(
  questionId: string,
  list: { id: string; position: number }[]
) {
  try {
    const session = await currentUser();
    const isAuthorized = await roleCheckMiddleware(session);

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const ownQuestion = await db.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!ownQuestion) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updates = list.map((item: QuestionUpdate) => {
      return db.question.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    });

    await db.$transaction(updates);
  } catch (error) {
    console.error('[REORDER_QUESTIONS]', error);
    throw error;
  }
}
