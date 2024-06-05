'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeTagColor(tagId: string, color: string) {
  try {
    const tag = await db.tag.update({
      where: {
        id: tagId,
      },
      data: {
        color,
      },
    });

    revalidatePath('/dashboard');

    return tag;
  } catch (error) {
    console.error('Error changing tag color:', error);
    throw error;
  }
}
