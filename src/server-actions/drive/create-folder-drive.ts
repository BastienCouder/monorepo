'use server';

import { db } from '@/lib/prisma';

export async function createTeamFolder(
  userId: string,
  folderName: string,
  parentId?: string | null,
  teamId?: string
) {
  try {
    const existingFolder = await db.folder.findFirst({
      where: {
        name: folderName,
        parentId,
        teamId,
      },
    });

    if (!userId) {
      return { error: 'unauthorized.' };
    }

    if (existingFolder) {
      return {
        error:
          'A folder with this name already exists in the current directory.',
      };
    }

    const newFolder = await db.folder.create({
      data: {
        name: folderName,
        teamId,
        parentId,
      },
    });

    await db.team.update({
      where: { id: teamId },
      data: {
        updatedAt: new Date(),
      },
    });

    console.log('Nouveau dossier créé avec succès:', newFolder);
    return newFolder;
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error);
    throw error;
  }
}
