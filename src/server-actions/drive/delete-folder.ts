'use server';
import { db } from '@/lib/prisma';

// Cette fonction récursive calcule la taille totale d'un dossier, y compris tous ses sous-dossiers et fichiers
async function calculateFolderSize(folderId: string): Promise<number> {
  const folder = await db.folder.findUnique({
    where: { id: folderId },
    include: {
      files: true, // Inclure les fichiers directs du dossier
    },
  });

  if (!folder) {
    return 0;
  }

  // Commencez par calculer la taille des fichiers directement dans le dossier
  let totalSize = folder.files.reduce((acc, file) => acc + file.size, 0);

  // Trouver tous les sous-dossiers
  const subfolders = await db.folder.findMany({
    where: { parentId: folderId },
  });

  // Pour chaque sous-dossier, appelez récursivement `calculateFolderSize` et ajoutez le résultat à `totalSize`
  for (const subfolder of subfolders) {
    totalSize += await calculateFolderSize(subfolder.id);
  }

  return totalSize;
}

export async function deleteFolder(
  folderId: string,
  teamId: string
): Promise<void> {
  try {
    // Vérifier si le dossier appartient bien à l'équipe spécifiée
    const folder = await db.folder.findFirst({
      where: { id: folderId, teamId: teamId },
    });

    if (!folder) {
      throw new Error(
        "Dossier non trouvé ou n'appartenant pas à l'équipe spécifiée"
      );
    }

    // Calculer la taille totale du dossier avant suppression
    const totalSize = await calculateFolderSize(folderId);

    // Supprimer le dossier et, en cascade, ses fichiers et sous-dossiers
    await db.folder.delete({
      where: { id: folderId },
    });

    // Mettre à jour l'utilisation du stockage de l'équipe
    const team = await db.team.findUnique({ where: { id: teamId } });
    if (team) {
      await db.team.update({
        where: { id: teamId },
        data: { storageUsed: Math.max(0, team.storageUsed - totalSize) }, // S'assurer que storageUsed ne devient pas négatif
      });
    }

    console.log(
      `Dossier ${folderId} et son contenu supprimés avec succès, et l'utilisation du stockage de l'équipe mise à jour.`
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du dossier:', error);
    throw error;
  }
}
