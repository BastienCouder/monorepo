'use server';

import { currentUser } from '@/lib/authCheck';
import { db } from '@/lib/prisma';

export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  responses: { answers: { questionId: string; optionIds: string[] }[] }
) {
  const session = await currentUser();

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Préparer les réponses en résolvant les promesses isCorrect
  const preparedAnswers = await Promise.all(
    Array.isArray(responses.answers)
      ? responses.answers.map(async (response) => ({
          questionId: response.questionId,
          optionId: response.optionIds[0],
          isCorrect: await checkIfAnswersAreCorrect(
            response.questionId,
            response.optionIds
          ),
        }))
      : []
  );

  // Créer la tentative de quiz avec les réponses préparées
  const attempt = await db.quizAttempt.create({
    data: {
      userId,
      quizId,
      answers: {
        create: preparedAnswers,
      },
    },
    include: {
      answers: true,
    },
  });

  return attempt;
}

async function checkIfAnswersAreCorrect(
  questionId: string,
  optionIds: string[]
): Promise<boolean> {
  // Récupérez toutes les options correctes pour la question
  const correctOptions = await db.option.findMany({
    where: {
      questionId: questionId,
      isCorrect: true,
    },
  });

  // Vérifiez que chaque optionId soumis est correct et que toutes les réponses correctes sont sélectionnées
  const correctOptionIds = correctOptions.map((option) => option.id);

  return (
    optionIds.every((optionId) => correctOptionIds.includes(optionId)) &&
    optionIds.length === correctOptionIds.length
  );
}
