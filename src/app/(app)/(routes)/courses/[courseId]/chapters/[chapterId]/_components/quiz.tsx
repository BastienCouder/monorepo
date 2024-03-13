'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import QuestionAttempt from './questions';
import { Questions } from '@/schemas/db-schema';
import { submitQuizAttempt } from '@/app/(dashboard)/dashboard/action/submit-quiz-attempt';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface UserResponse {
  questionId: string;
  optionIds: string[];
}

interface ResponseDetail extends UserResponse {
  isCorrect: boolean;
  errorMessage?: string;
}

interface QuizAttemptProps {
  questions: Questions[];
  quizId: string;
  evaluateQuiz: { score: number; responsesDetails: ResponseDetail[] } | null;
}

const formSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionIds: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
          message: 'Vous devez sélectionner au moins un élément.',
        }),
    })
  ),
});

const QuizAttempt: React.FC<QuizAttemptProps> = ({
  questions,
  quizId,
  evaluateQuiz,
}) => {
  const user = useCurrentUser();

  const defaultValues = evaluateQuiz
    ? {
        answers: questions.map((question) => {
          const responseDetail = evaluateQuiz.responsesDetails.find(
            (detail) => detail.questionId === question.id
          );
          return {
            questionId: question.id,
            optionIds: responseDetail ? responseDetail.optionIds : [],
          };
        }),
      }
    : {
        answers: questions.map((question) => ({
          questionId: question.id,
          optionIds: [],
        })),
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (user) {
        submitQuizAttempt(user.id, quizId, values);
      }
      toast({ title: 'Réponses soumises' });
    } catch {
      toast({ title: "Une erreur s'est produite", variant: 'destructive' });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {questions.map((question, questionIndex) => {
            const responseDetail = evaluateQuiz?.responsesDetails.find(
              (detail) => detail.questionId === question.id
            );
            console.log(responseDetail);

            return (
              <QuestionAttempt
                key={question.id}
                question={question}
                questionIndex={questionIndex}
                form={form}
                responseDetail={responseDetail}
                defaultValues={defaultValues}
              />
            );
          })}
          <Button
            disabled={!isValid || isSubmitting || !!evaluateQuiz}
            type="submit"
          >
            Valider
          </Button>
        </form>
      </Form>
    </>
  );
};

export default QuizAttempt;
