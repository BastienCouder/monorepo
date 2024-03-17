'use server';

import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { deleteObject, ref } from 'firebase/storage';

export async function deleteFile(
  fileId: string,
  teamId: string
): Promise<void> {
  try {
    // Trouver le fichier dans la base de données pour obtenir son chemin d'accès et sa taille
    const file = await db.file.findUnique({
      where: { id: fileId },
      include: { team: true }, // Inclure les détails de l'équipe pour accéder à l'utilisation du stockage
    });

    if (!file) {
      throw new Error('Fichier non trouvé');
    }

    if (file.teamId !== teamId) {
      throw new Error("Le fichier n'appartient pas à l'équipe spécifiée");
    }

    // Créer une référence au fichier dans Firebase Storage
    const fileRef = ref(storage, file.path!);

    // Supprimer le fichier de Firebase Storage
    await deleteObject(fileRef);

    // Mettre à jour l'utilisation du stockage de l'équipe dans la base de données
    if (file.team) {
      const newStorageUsed = file.team.storageUsed - file.size;
      await db.team.update({
        where: { id: teamId },
        data: { storageUsed: newStorageUsed >= 0 ? newStorageUsed : 0 },
      });
    }

    // Supprimer la référence du fichier de la base de données
    await db.file.delete({
      where: { id: fileId },
    });

    console.log(
      `Fichier supprimé de Firebase Storage et de la base de données: ${file.path}`
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    throw error;
  }
}
