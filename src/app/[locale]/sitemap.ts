import { db } from '@/lib/prisma';
import { MetadataRoute } from 'next';

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await db.course.findMany();
  const chapters = await db.chapter.findMany();

  const courseEntries = courses.map((course) => {
    return {
      url: `${URL}/courses/${course.id}`,
      lastModified: course.updatedAt.toISOString(),
    };
  });

  const chapterEntries = chapters.map((chapter) => {
    const course = courses.find((course) => course.id === chapter.courseId);

    return {
      url: `${URL}/courses/${chapter.courseId}/chapters/${chapter.id}`,
      lastModified: chapter.updatedAt
        ? chapter.updatedAt.toISOString()
        : course?.updatedAt.toISOString(),
    };
  });

  const staticRoutes = [``, `courses`, `profile`];

  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${URL}/${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...statics, ...courseEntries, ...chapterEntries];
}
