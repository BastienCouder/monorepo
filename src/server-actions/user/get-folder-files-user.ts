'use server';

import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';
import { Folder as PrismaFolder, File as PrismaFile } from '@prisma/client';

// Définitions des interfaces pour étendre les types Prisma existants
interface ExtendedFile extends PrismaFile {
  folder?: ExtendedFolder; // Optionnel pour gérer les cas où le fichier n'est pas associé à un dossier
}

interface ExtendedFolder extends PrismaFolder {
  files: ExtendedFile[];
  subfolders: ExtendedFolder[];
  totalSize?: number;
  totalFiles?: number;
}

// Type pour la réponse de la requête du dossier
interface FolderDataResponse {
  folder?: ExtendedFolder;
  subfolders: ExtendedFolder[];
  files: ExtendedFile[];
  totalSize?: number;
  totalFiles?: number;
  message?: string;
}

const defaultFolders = [
  'Documents',
  'Downloads',
  'Pictures',
  'Videos',
  'Musics',
];

async function ensureDefaultFolders(userId: string): Promise<ExtendedFolder[]> {
  await Promise.all(
    defaultFolders.map(async (folderName) => {
      const exists = await db.folder.findFirst({
        where: { userId, name: folderName, parentId: null },
      });
      if (!exists) {
        await db.folder.create({ data: { userId, name: folderName } });
      }
    })
  );

  const folders = await db.folder.findMany({
    where: { userId, parentId: null },
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

export async function userFolderFiles(
  folderPath: string
): Promise<FolderDataResponse> {
  const user = await currentUser();
  if (!user?.id) throw new Error('Unauthorized');

  if (!folderPath || folderPath === '') {
    const folders = await ensureDefaultFolders(user.id);
    return { subfolders: folders, files: [] };
  }

  const rootFolder = await findFolderByPath(user.id, folderPath);
  if (!rootFolder)
    return { subfolders: [], files: [], message: 'Folder not found' };

  const { totalSize, totalFiles } = await calculateTotalSizeAndFiles(
    rootFolder.id
  );

  const subfolders = await Promise.all(
    rootFolder.subfolders.map(async (sf) => ({
      ...sf,
      ...(await calculateTotalSizeAndFiles(sf.id)),
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

export async function calculateTotalSizeAndFiles(
  folderId: string
): Promise<{ totalSize: number; totalFiles: number }> {
  const folder = await db.folder.findUnique({
    where: { id: folderId },
    include: { files: true, subfolders: true },
  });

  let totalSize = folder?.files.reduce((acc, file) => acc + file.size, 0) || 0;
  let totalFiles = folder?.files.length || 0;

  for (const subfolder of folder?.subfolders || []) {
    const counts = await calculateTotalSizeAndFiles(subfolder.id);
    totalSize += counts.totalSize;
    totalFiles += counts.totalFiles;
  }

  return { totalSize, totalFiles };
}

async function findFolderByPath(
  userId: string,
  folderId: string
): Promise<ExtendedFolder | null> {
  const folder = await db.folder.findFirst({
    where: { userId, id: folderId },
    include: { files: true, subfolders: true },
  });

  if (!folder) return null;
  const enrichedSubfolders = await Promise.all(
    folder.subfolders.map(async (subfolder) => {
      const { totalSize, totalFiles } = await calculateTotalSizeAndFiles(
        subfolder.id
      );
      return { ...subfolder, totalSize, totalFiles, files: [], subfolders: [] };
    })
  );

  return { ...folder, subfolders: enrichedSubfolders };
}
