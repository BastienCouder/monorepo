'use server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createFolder(
  userId: string,
  folderName: string,
  parentId: string | null
) {
  try {
    const existingFolder = await db.folder.findFirst({
      where: {
        name: folderName,
        parentId,
        userId: userId,
      },
    });

    if (existingFolder) {
      return {
        error:
          'A folder with this name already exists in the current directory.',
      };
    }

    const newFolder = await db.folder.create({
      data: {
        name: folderName,
        parentId: parentId,
        userId: userId,
      },
    });
    revalidatePath('/dashboard/files');
    return { folder: newFolder };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { error: 'Unable to create folder.' };
  }
}
