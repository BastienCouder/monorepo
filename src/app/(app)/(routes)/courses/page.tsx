import { redirect } from 'next/navigation';

import { db } from '@/lib/prisma';
import { CoursesList } from '@/components/courses-list';

import { currentUser } from '@/lib/authCheck';
import { getCourses } from '@/lib/db/get-courses';
import { Categories } from './_components/categories';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await currentUser();
  const userId = session?.id;

  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <div className="space-y-4">
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
  );
};

export default SearchPage;
