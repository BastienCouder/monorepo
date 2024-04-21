'use server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Recursive function to delete a folder and its contents, including all subfolders and files
async function deleteFolderRecursively(
  folderId: string,
  teamId: string
): Promise<number> {
  // Find subfolders within the current folder that belong to the team
  const subfolders = await db.folder.findMany({
    where: { parentId: folderId, teamId: teamId },
  });

  let sizeDeleted = 0; // Initialize the total size deleted to zero

  // Recursively delete each subfolder found and accumulate the size deleted
  for (const subfolder of subfolders) {
    sizeDeleted += await deleteFolderRecursively(subfolder.id, teamId);
  }

  // Find all files in the current folder and calculate the total size
  const files = await db.file.findMany({
    where: { folderId: folderId, teamId: teamId },
    select: { size: true },
  });

  const fileSizeSum = files.reduce((sum, file) => sum + file.size, 0);
  sizeDeleted += fileSizeSum; // Add the size of files in the current folder to the total size deleted

  // Delete all files in the current folder
  await db.file.deleteMany({
    where: { folderId: folderId, teamId: teamId },
  });

  // Delete the current folder itself
  await db.folder.delete({
    where: { id: folderId, teamId: teamId },
  });

  return sizeDeleted; // Return the total size deleted in this folder and its subfolders
}

export async function deleteItems(
  itemIds: string[],
  teamId: string,
  userId: string
) {
  const results = [];
  let totalSizeDeleted = 0; // Initialize total deleted size to zero

  // First, verify the user's role
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
    (member.role !== 'ADMINISTRATOR' && member.role !== 'EDITOR')
  ) {
    return {
      error:
        'You do not have the necessary permissions to perform this operation.',
    };
  }

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

  revalidatePath('/dashboard'); // Optionally revalidate the path to update the UI if using Next.js
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
