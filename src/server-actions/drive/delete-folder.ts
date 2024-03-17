'use server';
import { db } from '@/lib/prisma';

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

    // Supprimer le dossier et, en cascade, ses fichiers et sous-dossiers
    await db.folder.delete({
      where: { id: folderId },
    });

    console.log(`Dossier ${folderId} et son contenu supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du dossier:', error);
    throw error;
  }
}
