'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function associateTagWithFiles(
  tagId: string,
  fileIds: string[],
  color?: string
) {
  try {
    if (color) {
      await db.tag.update({
        where: {
          id: tagId,
        },
        data: {
          color,
        },
      });
    }

    for (const fileId of fileIds) {
      await db.fileTag.upsert({
        where: {
          fileId_tagId: {
            fileId,
            tagId,
          },
        },
        update: {},
        create: {
          fileId,
          tagId,
        },
      });
    }
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error associating tag with files:', error);
    throw error;
  }
}
