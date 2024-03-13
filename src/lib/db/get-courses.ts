import { db } from '@/lib/prisma';
import { getProgress } from './get-progress';
import { Category, Course } from '@/schemas/db-schema';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categories?: string[];
};
export const getCourses = async ({
  userId,
  title,
  categories,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    let categoriesFilter = {};
    if (categories) {
      categoriesFilter = {
        categories: {
          some: {
            category: {
              id: {
                in: Array.isArray(categories) ? categories : [categories],
              },
            },
          },
        },
      };
    }

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(title ? { title: { contains: title } } : {}),
        ...categoriesFilter,
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
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            categories: course.categories.map((cat) => cat.category),
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log('[GET_COURSES]', error);
    return [];
  }
};
