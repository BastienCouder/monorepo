'use server';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { deleteObject, ref } from 'firebase/storage';

async function deleteFile(fileId: string, teamId: string): Promise<void> {
  try {
    // Trouver le fichier dans la base de données pour obtenir son chemin d'accès dans Firebase Storage
    const file = await db.file.findUnique({
      where: { id: fileId },
      include: { team: true }, // Inclure les détails de l'équipe pour vérifier l'appartenance
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

    console.log(`Fichier supprimé de Firebase Storage : ${file.path}`);

    // Supprimer la référence du fichier de la base de données
    await db.file.delete({
      where: { id: fileId },
    });

    console.log(
      `Référence du fichier supprimée de la base de données : ${fileId}`
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    throw error;
  }
}
