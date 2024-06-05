'use server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function renameItem(
  itemId: string,
  userId: string,
  newName: string
) {
  try {
    const folder = await db.folder.findUnique({
      where: { id: itemId },
    });

    if (folder && folder.userId === userId) {
      const existingFolder = await db.folder.findFirst({
        where: {
          id: { not: itemId },
          name: newName,
          parentId: folder.parentId,
          userId: userId,
        },
      });

      if (existingFolder) {
        return {
          error:
            'A folder with this name already exists in the current directory.',
        };
      }

      const updatedFolder = await db.folder.update({
        where: { id: itemId },
        data: { name: newName },
      });

      return { folder: updatedFolder };
    }

    if (!folder) {
      const file = await db.file.findUnique({
        where: { id: itemId },
      });

      if (file && file.userId === userId) {
        const existingFile = await db.file.findFirst({
          where: {
            id: { not: itemId },
            name: newName,
            folderId: file.folderId,
            userId: userId,
          },
        });

        if (existingFile) {
          return {
            error:
              'A file with this name already exists in the current directory.',
          };
        }

        const updatedFile = await db.file.update({
          where: { id: itemId },
          data: { name: newName },
        });

        return { file: updatedFile };
      }
    }
    revalidatePath('/dashboard');

    return { error: 'Item not found or unauthorized.' };
  } catch (error) {
    console.error('Error renaming item:', error);
    return { error: 'Unable to rename item.' };
  }
}
