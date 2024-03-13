import { Category, Chapter, Course } from '@prisma/client';
import { db } from '@/lib/prisma';
import { getProgress } from './get-progress';

type CourseWithCategoriesAndProgress = Course & {
  categories: Category[];
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithCategoriesAndProgress[];
  coursesInProgress: CourseWithCategoriesAndProgress[];
};
export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const courses = await db.course.findMany({
      where: {
        userId: userId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    const coursesWithProgress: CourseWithCategoriesAndProgress[] =
      await Promise.all(
        courses.map(async (course) => {
          const progress = await getProgress(userId, course.id);
          return {
            ...course,
            categories: course.categories.map((cat) => cat.category),
            progress,
          };
        })
      );

    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
