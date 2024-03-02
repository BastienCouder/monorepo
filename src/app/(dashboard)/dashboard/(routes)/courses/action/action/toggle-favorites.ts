'use server';
import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';

export const toggleFavorite = async (courseId: string) => {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    throw new Error('Unauthorized');
  }

  const userId = session?.id;

  const existingFavorite = await db.favorite.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingFavorite) {
    // If the course is already favorited, remove it from favorites
    await db.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return { success: 'Cours supprimé des favoris avec succès !' };
  } else {
    // If the course is not in favorites, add it
    await db.favorite.create({
      data: {
        userId: userId!,
        courseId,
      },
    });
    return { success: 'Cours ajouté aux favoris avec succès !' };
  }
};
