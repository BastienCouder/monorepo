'use server';

import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function deleteCourse(courseId: string) {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    return { error: 'Unauthorized' };
  }

  try {
    await db.course.delete({
      where: { id: courseId },
    });
  } catch (error) {
    console.error('[DELETE_COURSES]', error);
    return { error: 'Internal Error' };
  }
}
