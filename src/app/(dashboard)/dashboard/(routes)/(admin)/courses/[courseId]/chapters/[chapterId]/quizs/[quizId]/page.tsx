import { redirect } from 'next/navigation';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

import { db } from '@/lib/prisma';
import { IconBadge } from '@/components/icon-badge';

import { currentUser } from '@/lib/authCheck';
import { QuizActions } from './_components/quiz-action';
import Link from 'next/link';

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
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

  if (!course || !chapter) {
    return redirect('/');
  }

  const requiredFields = [course.title, course.description];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <Link
          href={`/dashboard/courses/${params.courseId}/chapters/${params.chapterId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to chapter setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <QuizActions
            disabled={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your quiz</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
