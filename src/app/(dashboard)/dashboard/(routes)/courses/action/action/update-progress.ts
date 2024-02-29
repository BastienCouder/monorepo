import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await currentUser();
    const isAuthorized = roleCheckMiddleware(session);
    const userId = session?.id;
    if (!isAuthorized) {
      return { chapter: null, error: 'Unauthorized' };
    }

    const { isCompleted } = await req.json();

    // Additional input validation can be added here
    if (userId) {
      const userProgress = await db.userProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId: params.chapterId,
          },
        },
        update: { isCompleted },
        create: {
          userId,
          chapterId: params.chapterId,
          isCompleted,
        },
      });

      return NextResponse.json(userProgress);
    }
  } catch (error) {
    console.error('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
