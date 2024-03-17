'use server';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { deleteObject, ref } from 'firebase/storage';

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, filePath);
    // Supprimer le fichier de Firebase Storage
    await deleteObject(fileRef);
    console.log(
      `Fichier ${filePath} supprimé de Firebase Storage avec succès.`
    );

    // Supprimer la référence du fichier dans la base de données
    const file = await db.file.findFirst({
      where: { path: filePath },
    });

    if (!file) {
      throw new Error(`Fichier non trouvé avec le chemin : ${filePath}`);
    }

    // Utiliser l'ID du fichier pour le supprimer
    await db.file.delete({
      where: { id: file.id },
    });

    console.log(
      `Référence du fichier ${filePath} supprimée de la base de données avec succès.`
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    // Gérer les erreurs, par exemple, fichier déjà supprimé ou permissions insuffisantes
  }
}

export async function deleteFolderRecursively(
  folderId: string,
  userId: string
): Promise<void> {
  // Récupérer le dossier avec ses fichiers et sous-dossiers pour la suppression récursive
  const folder = await db.folder.findUnique({
    where: { id: folderId, userId },
    include: {
      files: true,
      subfolders: true,
    },
  });

  if (!folder) {
    throw new Error(`Dossier ${folderId} non trouvé`);
  }

  // Supprimer les fichiers dans le dossier courant
  for (const file of folder.files) {
    await deleteFile(file.path!);
  }

  // Suppression récursive des sous-dossiers
  for (const subfolder of folder.subfolders) {
    await deleteFolderRecursively(subfolder.id, userId);
  }

  // Une fois tous les fichiers et sous-dossiers supprimés, supprimer le dossier lui-même de la base de données
  await db.folder.delete({
    where: { id: folderId },
  });

  console.log(`Dossier ${folderId} et tout son contenu supprimés avec succès.`);
}
