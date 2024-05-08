'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTag(
  name: string,
  color: string,
  teamId: string,
  userId: string
) {
  try {
    const tag = await db.tag.create({
      data: {
        name,
        color,
      },
    });

    await db.action.create({
      data: {
        type: 'create',
        entityId: tag.id,
        entityType: 'tag',
        teamId,
        userId,
      },
    });

    revalidatePath('/dashboard');

    return tag;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
}
