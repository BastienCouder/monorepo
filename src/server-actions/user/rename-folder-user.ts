'use server';
import { db } from '@/lib/prisma';

export async function renameFolder(
  folderId: string,
  userId: string,
  newName: string
) {
  try {
    // Récupérer les informations du dossier actuel
    const folder = await db.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (!folder || folder.userId !== userId) {
      return { error: 'Folder not found or unauthorized.' };
    }

    const existingFolder = await db.folder.findFirst({
      where: {
        id: {
          not: folderId,
        },
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

    // Renommer le dossier
    const updatedFolder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: newName,
      },
    });

    return { folder: updatedFolder };
  } catch (error) {
    console.error('Error renaming folder:', error);
    return { error: 'Unable to rename folder.' };
  }
}
