'use server';
import { db } from '@/lib/prisma';
import { Folder } from '@/models/db';
import { revalidatePath } from 'next/cache';

export async function createFolder(
  userId: string,
  folderName: string,
  parentId: string | null
) {
  try {
    const existingFolder: Folder = await db.folder.findFirst({
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

    const newFolder: Folder = await db.folder.create({
      data: {
        name: folderName,
        parentId: parentId,
        userId: userId,
      },
    });
    revalidatePath('/dashboard');
    return { folder: newFolder };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { error: 'Unable to create folder.' };
  }
}
