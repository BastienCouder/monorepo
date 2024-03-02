import { redirect } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';

import { currentUser } from '@/lib/authCheck';
import { getDashboardCourses } from '@/lib/db/get-dasboard-courses';
import { CoursesList } from '@/components/courses-list';
import { InfoCard } from './_components/info-card';

export default async function Dashboard() {
  const session = await currentUser();
  const userId = session?.id;

  if (!userId) {
    return redirect('/');
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
