import { redirect } from 'next/navigation';

import { db } from '@/lib/prisma';

import { CourseSidebar } from './_components/course-sidebar';
import React from 'react';
import { currentUser } from '@/lib/authCheck';
import { getProgress } from '@/lib/db/get-progress';

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = await currentUser();
  const userId = session?.id;

  const course = await db.course.findUnique({
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
          quiz: { include: { questions: { include: { options: true } } } },
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

  if (!course) {
    return redirect('/');
  }

  const progressCount = await getProgress(userId!, course.id);

  return (
    <div className="h-full">
      <div className="flex">
        <div className="hidden xl:flex h-full w-80 flex-col inset-y-0">
          <CourseSidebar course={course} progressCount={progressCount} />
        </div>
        <main className="w-full h-full">{children}</main>
      </div>
    </div>
  );
};

export default CourseLayout;
