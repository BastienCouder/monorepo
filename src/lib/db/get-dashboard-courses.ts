import { Category, Chapter, Course } from '@prisma/client';
import { db } from '@/lib/prisma';
import { getProgress } from './get-progress';

// Updated type to reflect the actual structure of your data
type CourseWithCategoriesAndProgress = Course & {
  categories: Category[]; // Reflects that this is an array
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
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
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
        },
      },
    });

    const coursesWithProgress: CourseWithCategoriesAndProgress[] =
      await Promise.all(
        purchasedCourses.map(async (purchase) => {
          const progress = await getProgress(userId, purchase.course.id);
          return {
            ...purchase.course,
            categories: purchase.course.categories.map((cat) => cat.category),
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
