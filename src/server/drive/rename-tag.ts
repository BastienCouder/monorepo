'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function renameTag(
  tagId: string,
  newName: string,
  teamId: string,
  userId: string
) {
  try {
    const tag = await db.tag.update({
      where: {
        id: tagId,
      },
      data: {
        name: newName,
      },
    });

    await db.action.create({
      data: {
        type: 'update',
        entityId: tag.id,
        entityType: 'tag',
        teamId,
        userId,
      },
    });

    revalidatePath('/dashboard');

    return tag;
  } catch (error) {
    console.error('Error renaming tag:', error);
    throw error;
  }
}
