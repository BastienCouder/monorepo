'use server';

import { db } from '@/lib/prisma';
import { Folder, File } from '@/models/db';

export async function getTreeTeam(teamId: string) {
  try {
    const fetchFoldersRecursive = async (
      parentId: string | null
    ): Promise<Folder[]> => {
      const whereClauseFolder = {
        teamId,
        parentId,
      };

      const folders = await db.folder.findMany({
        where: whereClauseFolder,
      });

      // Recursively fetch child folders
      const foldersWithChildren = await Promise.all(
        folders.map(async (folder) => ({
          ...folder,
          children: await fetchFoldersRecursive(folder.id),
        }))
      );

      return foldersWithChildren;
    };

    // Start fetching from the root level (parentId = null)
    const foldersWithRecursive = await fetchFoldersRecursive(null);

    const whereClauseFile = {
      teamId,
    };

    const files: File[] = await db.file.findMany({
      where: whereClauseFile,
    });

    return {
      folders: {
        data: foldersWithRecursive,
      },
      files: {
        data: files,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      folders: { data: [] },
      files: { data: [] },
    };
  }
}
