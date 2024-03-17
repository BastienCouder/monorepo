'use server';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { getDownloadURL, ref } from 'firebase/storage';

export async function getTeamFoldersAndFiles(teamId: string) {
  try {
    const teamWithFoldersAndFiles = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        Folder: {
          include: {
            files: true, // Inclure les fichiers dans chaque dossier
          },
        },
        File: true, // Inclure les fichiers qui sont directement associés à l'équipe (pas dans un dossier)
      },
    });

    if (!teamWithFoldersAndFiles) {
      throw new Error('Équipe non trouvée');
    }

    // Pour les fichiers directement associés à l'équipe
    const filesPromises = teamWithFoldersAndFiles.File.map(async (file) => {
      const fileRef = ref(storage, file.path!);
      const downloadURL = await getDownloadURL(fileRef);
      return {
        ...file,
        downloadURL,
      };
    });
    const filesWithDownloadURL = await Promise.all(filesPromises);

    // Pour les fichiers dans chaque dossier
    const foldersWithFilesPromises = teamWithFoldersAndFiles.Folder.map(
      async (folder) => {
        const filesPromises = folder.files.map(async (file) => {
          const fileRef = ref(storage, file.path!);
          const downloadURL = await getDownloadURL(fileRef);
          return {
            ...file,
            downloadURL,
          };
        });
        const filesWithDownloadURL = await Promise.all(filesPromises);

        return {
          ...folder,
          files: filesWithDownloadURL,
        };
      }
    );
    const foldersWithFiles = await Promise.all(foldersWithFilesPromises);

    return {
      ...teamWithFoldersAndFiles,
      File: filesWithDownloadURL,
      Folder: foldersWithFiles,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des dossiers et fichiers de l’équipe:',
      error
    );
    throw error;
  }
}
