'use server';
import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';
import { calculateTotalSizeAndFiles } from './get-folder-files-user';

interface ExtendedFolderSummary {
  name: string;
  totalSizeGB: number; // Taille totale en Go
  totalFiles: number; // Nombre total de fichiers
}

interface FolderSummaryResponse {
  folders: ExtendedFolderSummary[];
  totalSizeGB: number; // Taille totale utilisée en Go
  totalFiles: number; // Nombre total de fichiers
}

const defaultFolders = [
  'Documents',
  'Downloads',
  'Pictures',
  'Videos',
  'Musics',
];

export async function calculateFolderSummary(): Promise<FolderSummaryResponse> {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const folders = await db.folder.findMany({
    where: { userId: user.id, parentId: null },
    include: { files: true, subfolders: true },
  });

  let totalSizeBytes = 0;
  let totalFilesCount = 0;
  const folderSummaries: ExtendedFolderSummary[] = [];

  for (const folder of folders) {
    const { totalSize, totalFiles } = await calculateTotalSizeAndFiles(
      folder.id
    );
    totalSizeBytes += totalSize;
    totalFilesCount += totalFiles;

    const folderName = defaultFolders.includes(folder.name)
      ? folder.name
      : 'Others';
    const existingFolderSummary = folderSummaries.find(
      (f) => f.name === folderName
    );
    if (existingFolderSummary) {
      existingFolderSummary.totalSizeGB += totalSize / 1024 ** 3; // Convertir en Go
      existingFolderSummary.totalFiles += totalFiles;
    } else {
      folderSummaries.push({
        name: folderName,
        totalSizeGB: totalSize / 1024 ** 3, // Convertir en Go
        totalFiles: totalFiles,
      });
    }
  }

  // Calculer le résumé pour le dossier "Autre" si nécessaire
  const otherFoldersSizeAndFiles = folders
    .filter((folder) => !defaultFolders.includes(folder.name))
    .reduce(
      (acc, folder) => {
        acc.totalSize += folder.files.reduce((acc, file) => acc + file.size, 0);
        acc.totalFiles += folder.files.length;
        return acc;
      },
      { totalSize: 0, totalFiles: 0 }
    );

  if (
    otherFoldersSizeAndFiles.totalSize > 0 ||
    otherFoldersSizeAndFiles.totalFiles > 0
  ) {
    folderSummaries.push({
      name: 'Autre',
      totalSizeGB: otherFoldersSizeAndFiles.totalSize / 1024 ** 3, // Convertir en Go
      totalFiles: otherFoldersSizeAndFiles.totalFiles,
    });
  }

  return {
    folders: folderSummaries,
    totalSizeGB: totalSizeBytes / 1024 ** 3, // Convertir en Go
    totalFiles: totalFilesCount,
  };
}
