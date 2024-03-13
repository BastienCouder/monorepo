import { db } from '@/lib/prisma';
import { CoursesList } from '@/components/courses-list';
import { currentUser } from '@/lib/authCheck';
import { getCourses } from '@/lib/db/get-courses';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Explorez Nos Cours - ${siteConfig.name} : Élargissez Vos Horizons d'Apprentissage`,
    description:
      "Plongez dans notre vaste bibliothèque de cours sur notre plateforme et découvrez des opportunités d'apprentissage sans limites. Que vous cherchiez à approfondir vos connaissances ou à acquérir de nouvelles compétences, nos cours adaptés à chaque niveau vous guideront vers le succès. Rejoignez notre communauté d'apprenants dès aujourd'hui et commencez à transformer votre passion en expertise.",
    robots: { index: true, follow: true, nocache: true },
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await currentUser();
  const userId = session?.id;

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const favorites = await db.favorite.findMany({
    where: {
      userId,
    },
  });

  const courses = await getCourses({
    userId: userId!,
    ...searchParams,
  });

  return (
    <div className="space-y-4 p-4">
      <CoursesList
        items={courses}
        favorites={favorites}
        categories={categories}
      />
    </div>
  );
};

export default SearchPage;
