'use server';

import { db } from '@/lib/prisma';
import { createFolderSchema } from '@/models/validations/folder';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

interface CreateTeamFolderResponse {
  success?: string;
  error?: string;
}

export async function createTeamFolder(
  teamId: string,
  values: z.infer<typeof createFolderSchema>,
  userId?: string,
  parentId?: string
): Promise<CreateTeamFolderResponse> {
  const t = await getTranslations('auth.server');
  const validatedFields = createFolderSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { name } = validatedFields.data;

  const team = await db.team.findUnique({ where: { id: teamId } });

  if (!team) {
    return {
      error: 'Team not found.',
    };
  }

  try {
    let existingFolder = await db.folder.findFirst({
      where: {
        name,
        parentId,
        teamId,
      },
    });

    let index = 0;
    let finalFolderName = name;

    while (existingFolder) {
      index++;
      finalFolderName = `${name} (${index})`;
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
        userId,
        name: finalFolderName,
        teamId,
        parentId: parentId === '' ? null : parentId,
      },
    });
    // Update team's last modified date
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
        entityType: 'folder',
        teamId,
        userId: userId ?? 'anonymous',
      },
    });

    revalidatePath('/dashboard');

    return {
      success: t('folder_created_successfully', newFolder),
    };
  } catch (error) {
    return {
      error: t('folder_creation_failed'),
    };
  }
}
