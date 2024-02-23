import { redirect } from 'next/navigation';

import { db } from '@/lib/prisma';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { currentUser } from '@/lib/authCheck';

const CoursesPage = async () => {
  const session = await currentUser();
  const userId = session?.id;

  if (!session) {
    return redirect('/');
  }
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="px-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
