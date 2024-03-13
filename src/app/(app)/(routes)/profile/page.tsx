import { redirect } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';

import { currentUser } from '@/lib/authCheck';

import { CoursesList } from '@/components/courses-list';
import { InfoCard } from './_components/info-card';
import { db } from '@/lib/prisma';
import { getDashboardCourses } from '@/lib/db/get-profile-courses';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Suivi de Progression - ${siteConfig.name} : Atteignez Vos Objectifs d'Apprentissage`,
    description: `Découvrez comment vous progressez dans vos cours avec notre plateform. Suivez vos réalisations, fixez des objectifs d'apprentissage et obtenez des insights personnalisés pour maximiser votre potentiel. Commencez dès maintenant à transformer vos efforts en succès`,
    robots: { index: true, follow: true, nocache: true },
  };
}

export default async function Profile() {
  const session = await currentUser();
  const userId = session?.id;

  if (!userId) {
    return redirect('/courses');
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  const favorites = await db.favorite.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="En progression"
          numberOfItems={coursesInProgress.length}
          variant="primary"
        />
        <InfoCard
          icon={CheckCircle}
          label="Complété"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
        favorites={favorites}
      />
    </div>
  );
}
