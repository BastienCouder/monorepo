'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { Course } from '@/schemas/db-schema';

export async function updateCourse<T extends Partial<Course>>(
  courseId: string,
  values: T
): Promise<Course | { error: string }> {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: values,
    });

    return updatedCourse;
  } catch (error) {
    console.error('[UPDATE_COURSE]', error);
    return { error: 'Internal Error' };
  }
}
