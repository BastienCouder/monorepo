import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { db } from '@/lib/prisma';

import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { ChapterActions } from './_components/chapter-actions';
import { QuizForm } from './_components/chapter-quiz-form';
import { ChaptersForm } from './_components/chapter-content-form';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: { courseId: string; chapterId: string };
}): Promise<Metadata> {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
  });

  return {
    title: `Gérer "${chapter?.title}" - ${course?.title} | ${siteConfig.name}`,
    description: `Modifiez et enrichissez le chapitre "${chapter?.title}" du cours "${course?.title}" sur ${siteConfig.name}. Assurez-vous que votre contenu est engageant, à jour et pédagogiquement riche pour vos apprenants.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },

    include: {
      muxData: true,
      content: {
        orderBy: {
          position: 'asc',
        },
      },
      quiz: { include: { questions: { include: { options: true } } } },
    },
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.content.length > 0];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au cours
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Création du chapitre</h1>
                <span className="text-sm text-slate-700">
                  Completez tous les champs {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="lg:space-x-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <ChapterTitleForm
              initialData={chapter}
              chapterId={params.chapterId}
            />
            <ChaptersForm initialData={chapter} chapterId={params.chapterId} />
          </div>
          <div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={params.chapterId}
            />
            <QuizForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
