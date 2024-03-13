import { db } from '@/lib/prisma';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { currentUser } from '@/lib/authCheck';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Gestion des Cours - ${siteConfig.name}`,
    description: `Prenez le contrôle de vos cours sur ${siteConfig.name}. Créez, modifiez et organisez vos contenus pédagogiques pour offrir une expérience d’apprentissage enrichissante et structurée à vos apprenants.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const CoursesPage = async () => {
  const session = await currentUser();
  const userId = session?.id;

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="px-6 space-y-4 py-2">
      <h2 className="text-2xl font-bold tracking-tight">Cours</h2>

      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={4} filterableColumnCount={2} />
        }
      >
        <DataTable columns={columns} data={courses} />
      </React.Suspense>
    </div>
  );
};

export default CoursesPage;
