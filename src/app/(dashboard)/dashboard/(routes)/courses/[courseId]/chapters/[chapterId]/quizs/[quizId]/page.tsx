import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { db } from '@/lib/prisma';

import { currentUser } from '@/lib/authCheck';
import { QuizActions } from './_components/quiz-action';
import Link from 'next/link';
import { QuestionOptionsForm } from './_components/quiz-question-option-form';

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string; chapterId: string; quizId: string };
}) {
  const session = await currentUser();
  const userId = session?.id;

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      quiz: { include: { questions: { include: { options: true } } } },
    },
  });

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      chapterId: params.chapterId,
    },
    include: {
      questions: { include: { options: true } },
    },
  });

  if (!course || !chapter || !quiz) {
    return redirect('/dashboard');
  }

  const requiredFields = [quiz.title, quiz.questions.length > 0];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="px-6 py-2">
        <Link
          href={`/dashboard/courses/${params.courseId}/chapters/${params.chapterId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au chapitre
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Création du quiz</h1>
            <span className="text-sm text-slate-700">
              Complete tout les champs {completionText}
            </span>
          </div>
          <QuizActions
            disabled={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>
        <QuestionOptionsForm initialData={quiz} chapterId={params.chapterId} />
      </div>
    </>
  );
}
