import { redirect } from 'next/navigation';

import { db } from '@/lib/prisma';
import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { ChaptersForm } from './_components/chapters-form';
import { Actions } from './_components/actions';
import { currentUser } from '@/lib/authCheck';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { DashboardSkeleton } from '@/components/skeleton/dashboard-course';
import React from 'react';

export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  return {
    title: `Gestion du Cours : ${course?.title} - ${siteConfig.name}`,
    description: `Gérez et optimisez votre cours "${course?.title}" sur ${siteConfig.name}. Accédez à la modification de contenu, à la surveillance des inscriptions, et bien plus, pour garantir une expérience d'apprentissage de qualité.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string };
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
      categories: {
        include: {
          category: true,
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return redirect('/');
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categories.length > 0,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <React.Suspense fallback={<DashboardSkeleton />}>
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Création du cours</h1>
              <span className="text-sm text-slate-700">
                Completez tous les champs {completionText}
              </span>
            </div>
            <Actions
              disabled={!isComplete}
              courseId={params.courseId}
              isPublished={course.isPublished}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <div className="space-y-6">
              <ChaptersForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </div>
          </div>
        </div>
      </React.Suspense>
    </>
  );
}
