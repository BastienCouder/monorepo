import { db } from '@/lib/prisma';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { currentUser } from '@/lib/authCheck';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import React from 'react';

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
