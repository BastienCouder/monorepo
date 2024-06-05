'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteTag(tagId: string, teamId: string, userId: string) {
  try {
    const tag = await db.tag.delete({
      where: {
        id: tagId,
      },
    });

    await db.action.create({
      data: {
        type: 'delete',
        entityId: tag.id,
        entityType: 'tag',
        teamId,
        userId,
      },
    });

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}
