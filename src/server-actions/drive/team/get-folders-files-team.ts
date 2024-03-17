'use server';

import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';
import { Folder as PrismaFolder, File as PrismaFile } from '@prisma/client';

// Définitions des interfaces pour étendre les types Prisma existants

export interface ExtendedFile extends PrismaFile {
  folder?: ExtendedFolder; // Optionnel pour gérer les cas où le fichier n'est pas associé à un dossier
}

export interface ExtendedFolder extends PrismaFolder {
  files: ExtendedFile[];
  subfolders: ExtendedFolder[];
  totalSize?: number;
  totalFiles?: number;
}

export interface FolderDataResponse {
  folder?: ExtendedFolder;
  subfolders: ExtendedFolder[];
  files: ExtendedFile[];
  totalSize?: number;
  totalFiles?: number;
  message?: string;
}

async function ensureDefaultFolders(teamId: string): Promise<ExtendedFolder[]> {
  const folders = await db.folder.findMany({
    where: { teamId, parentId: null },
    include: { files: true, subfolders: true },
  });

  const enrichedFolders: ExtendedFolder[] = await Promise.all(
    folders.map(async (folder) => {
      const totalSize = folder.files.reduce((acc, file) => acc + file.size, 0);
      const totalFiles = folder.files.length;
      return { ...folder, totalSize, totalFiles, subfolders: [] };
    })
  );

  return enrichedFolders;
}

export async function getUserFolderFilesTeam(
  folderPath: string,
  teamId: string
): Promise<FolderDataResponse> {
  const user = await currentUser();
  if (!user?.id) throw new Error('Unauthorized');

  if (!folderPath || folderPath === '') {
    const folders = await ensureDefaultFolders(teamId);
    return { subfolders: folders, files: [] };
  }

  const rootFolder = await findFolderByPathTeam(folderPath, teamId);

  if (!rootFolder)
    return { subfolders: [], files: [], message: 'Folder not found' };

  const { totalSize, totalFiles } = await calculateTotalSizeAndFilesTeam(
    rootFolder.id
  );

  const subfolders = await Promise.all(
    rootFolder.subfolders.map(async (sf) => ({
      ...sf,
      ...(await calculateTotalSizeAndFilesTeam(sf.id)),
    }))
  );

  return {
    folder: { ...rootFolder, totalSize, totalFiles },
    subfolders,
    files: rootFolder.files || [],
    totalSize,
    totalFiles,
  };
}

export async function calculateTotalSizeAndFilesTeam(
  folderId: string
): Promise<{ totalSize: number; totalFiles: number }> {
  const folder = await db.folder.findUnique({
    where: { id: folderId },
    include: { files: true, subfolders: true },
  });

  let totalSize = folder?.files.reduce((acc, file) => acc + file.size, 0) || 0;
  let totalFiles = folder?.files.length || 0;

  for (const subfolder of folder?.subfolders || []) {
    const counts = await calculateTotalSizeAndFilesTeam(subfolder.id);
    totalSize += counts.totalSize;
    totalFiles += counts.totalFiles;
  }

  return { totalSize, totalFiles };
}

async function findFolderByPathTeam(
  folderId: string,
  teamId: string
): Promise<ExtendedFolder | null> {
  const folder = await db.folder.findFirst({
    where: { id: folderId, teamId },
    include: { files: true, subfolders: true },
  });

  if (!folder) return null;
  const enrichedSubfolders = await Promise.all(
    folder.subfolders.map(async (subfolder) => {
      const { totalSize, totalFiles } = await calculateTotalSizeAndFilesTeam(
        subfolder.id
      );
      return { ...subfolder, totalSize, totalFiles, files: [], subfolders: [] };
    })
  );

  return { ...folder, subfolders: enrichedSubfolders };
}
