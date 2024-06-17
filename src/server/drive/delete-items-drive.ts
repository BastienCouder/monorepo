'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface DeleteItemsResponse {
  id?: string;
  success?: string;
  error?: string;
}

async function deleteFolderRecursively(
  folderId: string,
  teamId: string
): Promise<number> {
  const subfolders = await db.folder.findMany({
    where: { parentId: folderId, teamId: teamId },
  });

  let sizeDeleted = 0;

  for (const subfolder of subfolders) {
    sizeDeleted += await deleteFolderRecursively(subfolder.id, teamId);
  }

  const files = await db.file.findMany({
    where: { folderId: folderId, teamId: teamId },
    select: { size: true },
  });

  const fileSizeSum = files.reduce((sum, file) => sum + file.size, 0);
  sizeDeleted += fileSizeSum;

  await db.file.deleteMany({
    where: { folderId: folderId, teamId: teamId },
  });

  await db.folder.delete({
    where: { id: folderId, teamId: teamId },
  });

  return sizeDeleted;
}

export async function deleteItems(
  itemIds: string[],
  teamId: string | undefined,
  userId: string | undefined
): Promise<DeleteItemsResponse[]> {
  const user = await currentUser();

  if (!user) {
    return [
      {
        error: 'You are not authorized to perform this action.',
      },
    ];
  }

  if (user.id !== userId) {
    return [
      {
        error:
          'You do not have the necessary permissions to perform this action.',
      },
    ];
  }

  if (!teamId) {
    return [
      {
        error: 'Team ID is required.',
      },
    ];
  }

  const team = await db.team.findUnique({ where: { id: teamId } });

  if (!team) {
    return [
      {
        error: 'Team not found.',
      },
    ];
  }

  const member = await db.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (
    !member ||
    (member.role !== 'ADMINISTRATOR' &&
      member.role !== 'EDITOR' &&
      member.role !== 'OWNER')
  ) {
    return [
      {
        error:
          'You do not have the necessary permissions to perform this operation.',
      },
    ];
  }

  const results: DeleteItemsResponse[] = [];
  let totalSizeDeleted = 0;

  for (const itemId of itemIds) {
    try {
      const folder = await db.folder.findUnique({
        where: { id: itemId, teamId: teamId },
      });

      if (folder) {
        totalSizeDeleted += await deleteFolderRecursively(itemId, teamId);
        results.push({
          id: itemId,
          success: 'Folder and its contents deleted successfully.',
        });
        continue;
      }

      const file = await db.file.findUnique({
        where: { id: itemId, teamId: teamId },
        select: { size: true },
      });

      if (file) {
        totalSizeDeleted += file.size;
        await db.file.delete({
          where: { id: itemId, teamId: teamId },
        });
        results.push({ id: itemId, success: 'File deleted successfully.' });
        continue;
      }

      results.push({ id: itemId, error: 'Item not found.' });
    } catch (error) {
      console.error(`Error deleting item with ID ${itemId}:`, error);
      results.push({
        id: itemId,
        error: 'Failed to delete item due to server error.',
      });
    }
  }

  if (totalSizeDeleted > 0) {
    await updateTeamStorage(teamId, -totalSizeDeleted);
  }

  revalidatePath('/dashboard');
  return results;
}

async function updateTeamStorage(teamId: string, sizeChange: number) {
  return db.team.update({
    where: { id: teamId },
    data: {
      storageUsed: {
        decrement: -sizeChange,
      },
    },
  });
}
