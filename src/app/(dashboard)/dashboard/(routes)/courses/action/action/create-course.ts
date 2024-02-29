'use server';

import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';

interface Course {
  id: string;
  userId: string;
  title: string;
}

export async function createCourse(
  userId: string,
  title: string
): Promise<Course> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);
  try {
    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return course;
  } catch (error) {
    console.error('[COURSES]', error);
    throw error;
  }
}
