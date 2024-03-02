'use server';

import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { Course } from '@/schemas/db-schema';

interface PublishCourseResult {
  course: Course | null;
  error?: string;
}

export async function toggleCoursePublication(
  courseId: string,
  publish: boolean
): Promise<PublishCourseResult> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { course: null, error: 'Unauthorized' };
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return { course: null, error: 'Course not found' };
    }

    if (publish) {
      const hasPublishedChapter = course.chapters.some(
        (chapter) => chapter.isPublished
      );
      if (
        !course.title ||
        !course.description ||
        !course.imageUrl ||
        !course.categories ||
        !hasPublishedChapter
      ) {
        return {
          course: null,
          error: 'Missing required fields for publication',
        };
      }
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: publish,
      },
    });

    return { course: updatedCourse };
  } catch (error) {
    console.error('[COURSES]', error);
    return { course: null, error: 'Internal Error' };
  }
}
