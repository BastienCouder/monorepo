import { siteConfig } from '@/config/site';
import { db } from '@/lib/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });
  return {
    title: `Explorez ${course?.title} - ${siteConfig.name} : Élargissez Votre Savoir`,
    description: `Plongez dans le cours ${course?.title} sur NomDeVotrePlateforme. Ce cours conçu par des experts vous guide à chaque étape de votre apprentissage. Commencez votre voyage d'apprentissage avec ${course?.title} aujourd'hui.`,
    robots: { index: true, follow: true, nocache: true },
  };
}

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
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

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
