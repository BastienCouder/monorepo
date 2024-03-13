'use server';

import { db } from '@/lib/prisma';
import { Questions } from '@/schemas/db-schema';

interface UserResponse {
  questionId: string;
  optionIds: string[];
}

interface ResponseDetail extends UserResponse {
  isCorrect: boolean;
  errorMessage?: string;
}

export async function evaluateQuizAttempt(
  quizId: string,
  userResponses: UserResponse[]
): Promise<{ score: number; responsesDetails: ResponseDetail[] }> {
  const quizQuestions: Questions[] = await db.question.findMany({
    where: { quizId },
    include: {
      options: true,
    },
  });

  let score = 0;
  const responsesDetails: ResponseDetail[] = userResponses.map(
    (userResponse) => {
      const question = quizQuestions.find(
        (q) => q.id === userResponse.questionId
      );
      if (!question) {
        return {
          ...userResponse,
          isCorrect: false,
          errorMessage: 'Question not found',
        };
      }

      const correctOptionsIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);
      const isCorrect =
        userResponse.optionIds.every((optionId) =>
          correctOptionsIds.includes(optionId)
        ) &&
        correctOptionsIds.every((correctOptionId) =>
          userResponse.optionIds.includes(correctOptionId!)
        );

      if (isCorrect) score += 1;

      return { ...userResponse, isCorrect };
    }
  );

  return { score, responsesDetails };
}

export async function getUserResponses(
  quizAttemptId: string
): Promise<UserResponse[]> {
  const userResponses = await db.quizAttempt.findUnique({
    where: {
      id: quizAttemptId,
    },
    include: {
      answers: true,
    },
  });

  const responses: UserResponse[] =
    userResponses?.answers.map((answer) => {
      if (answer.optionId === null) {
        throw new Error('Invalid response: optionId cannot be null');
      }
      return {
        questionId: answer.questionId,
        optionIds: [answer.optionId],
      };
    }) || [];

  return responses;
}
export async function findQuizAttemptId(
  userId: string,
  quizId: string
): Promise<string | null> {
  const quizAttempt = await db.quizAttempt.findFirst({
    where: {
      userId: userId,
      quizId: quizId,
    },
  });

  return quizAttempt?.id || null;
}
