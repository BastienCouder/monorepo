import { File } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';

import { VideoPlayer } from './_components/video-player';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import { getChapter } from '@/lib/db/get-chapter';
import { currentUser } from '@/lib/authCheck';
import { Banner } from '@/components/banner';
import Image from 'next/image';
import Quiz from './_components/quiz';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { CourseSidebar } from '../../_components/course-sidebar';
import { getProgress } from '@/lib/db/get-progress';
import { db } from '@/lib/prisma';
import React from 'react';
import { ChapterSkeleton } from '@/components/skeleton/chapter-skeleton';
import {
  evaluateQuizAttempt,
  findQuizAttemptId,
  getUserResponses,
} from '@/app/(dashboard)/dashboard/action/get-responses-quiz';

export async function generateMetadata({
  params,
}: {
  params: { courseId: string; chapterId: string };
}): Promise<Metadata> {
  const { chapter, course } = await getChapter({
    userId: '',
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  return {
    title: `${chapter?.title} - ${course?.title} | ${siteConfig.name}`,
    description: `Découvrez le chapitre "${chapter?.title}" du cours "${course?.title}". Rejoignez NomDeVotrePlateforme pour une expérience d'apprentissage enrichissante avec des vidéos, des quiz, et bien plus encore. Commencez dès maintenant !`,
    robots: { index: true, follow: true, nocache: true },
  };
}

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const session = await currentUser();
  const userId = session?.id;

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    // eslint-disable-next-line no-unused-vars
    purchase,
  } = await getChapter({
    userId: userId!,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }

  const currentCourse = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          content: true,
          quiz: {
            where: { isPublished: true },
            include: { questions: { include: { options: true } } },
          },
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!currentCourse) {
    return redirect('/');
  }

  const progressCount = await getProgress(userId!, currentCourse.id);

  const isLocked = !chapter.isFree && !userId;
  const completeOnEnd = !!userId && !userProgress?.isCompleted;

  const quizAttemptId = await findQuizAttemptId(userId!, chapter.quiz[0]?.id);

  let evaluateQuiz = null;
  let responsesQuiz = null;
  if (quizAttemptId !== null) {
    responsesQuiz = await getUserResponses(quizAttemptId);
    evaluateQuiz = await evaluateQuizAttempt(
      chapter.quiz[0]?.id,
      responsesQuiz
    );
  }

  return (
    <>
      <React.Suspense fallback={<ChapterSkeleton />}>
        <div className="w-full block xl:hidden">
          <CourseSidebar course={currentCourse} progressCount={progressCount} />
        </div>
        {userProgress?.isCompleted && (
          <Banner variant="success" label="Chapitre terminé" />
        )}
        {isLocked && <Banner variant="warning" label="Connecte toi" />}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          {chapter.videoUrl && (
            <div className="p-4">
              <VideoPlayer
                chapterId={params.chapterId}
                title={chapter.title}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                playbackId={muxData?.playbackId!}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 pb-0 flex flex-col md:flex-row gap-2 justify-between">
              <h2 className="text-2xl font-semibold mb-2 text-primary first-letter:uppercase">
                {chapter.title}
              </h2>
              {userId ? (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={params.courseId}
                  price={course.price!}
                />
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              {userId && chapter.quiz[0] && (
                <div className="p-4 pt-0 space-y-4">
                  <h2 className="font-medium text-lg first-letter:uppercase">
                    {chapter.quiz[0].title}
                  </h2>
                  <Quiz
                    questions={chapter.quiz[0].questions}
                    quizId={chapter.quiz[0].id}
                    evaluateQuiz={evaluateQuiz}
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Résultats du Quiz</h3>
                    <p>
                      Score: {evaluateQuiz?.score} /{' '}
                      {chapter.quiz[0].questions.length}
                    </p>
                    <ul>
                      {evaluateQuiz?.responsesDetails.map((detail, index) => (
                        <li
                          key={index}
                          className={`mt-2 ${detail.isCorrect ? 'text-green-500' : 'text-red-500'}`}
                        >
                          Question {index + 1}:{' '}
                          {detail.isCorrect ? 'Correct' : 'Incorrect'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {chapter.content.map((cont, index) => (
                <div key={index} className="flex">
                  {cont.code && (
                    <div className="text-sm lg:text-base max-w-full overflow-x-auto bg-card p-4">
                      <pre className="pr-4">{cont.code}</pre>
                    </div>
                  )}
                  {cont.description && (
                    <div className="text-green-800">
                      <Preview
                        value={cont.description}
                        className="!text-green-800"
                      />
                    </div>
                  )}
                  {cont.imageUrl && (
                    <div className="xl:pl-8">
                      <Image
                        src={cont.imageUrl}
                        alt="image-contenu"
                        width={1000}
                        height={1000}
                        className="flex w-full lg:h-[20rem] object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!!attachments.length && (
              <>
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </React.Suspense>
    </>
  );
};

export default ChapterIdPage;
