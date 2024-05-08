'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function disassociateTagFromFiles(
  tagId: string,
  fileIds: string[]
) {
  try {
    for (const fileId of fileIds) {
      await db.fileTag.delete({
        where: {
          fileId_tagId: {
            fileId,
            tagId,
          },
        },
      });
    }

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error disassociating tag from files:', error);
    throw error;
  }
}
