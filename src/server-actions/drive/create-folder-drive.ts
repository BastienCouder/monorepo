'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTeamFolder(
  folderName: string,
  parentId?: string | null,
  teamId?: string,
  userId?: string
) {
  if (!teamId || !userId) {
    return;
  }

  try {
    let existingFolder = await db.folder.findFirst({
      where: {
        name: folderName,
        parentId,
        teamId,
      },
    });

    let index = 0;
    let finalFolderName = folderName;

    while (existingFolder) {
      index++;
      finalFolderName = `${folderName} (${index})`;
      existingFolder = await db.folder.findFirst({
        where: {
          name: finalFolderName,
          parentId,
          teamId,
        },
      });
    }

    const newFolder = await db.folder.create({
      data: {
        name: finalFolderName,
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

    await db.action.create({
      data: {
        type: 'create',
        entityId: newFolder.id,
        entityType: 'tag',
        teamId,
        userId,
      },
    });
    revalidatePath('/dashboard');

    console.log('Nouveau dossier créé avec succès:', newFolder);
    return newFolder;
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error);
    throw error;
  }
}
