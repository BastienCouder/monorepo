'use server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Fonction API pour traiter la requête POST d'upload de fichier
export async function uploads(
  userId: string,
  size: number,
  type: string,
  filePath: string,
  folderId: string | undefined
) {
  try {
    // Récupérer les informations de l'utilisateur
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Utilisateur non trouvé');

    // Valider le chemin du fichier
    if (!filePath || filePath.startsWith('/') || !filePath.includes('/')) {
      throw new Error(
        'Le chemin du fichier est invalide ou représente une référence racine.'
      );
    }

    // Vérifier la limite de stockage
    if (user.storageUsed + size > user.storageLimit) {
      throw new Error('Limite de stockage dépassée');
    }

    // Normaliser le chemin du fichier en retirant un slash initial si présent
    const normalizedFilePath = filePath.startsWith('/')
      ? filePath.slice(1)
      : filePath;

    // Extraire les segments de chemin et le nom de fichier
    const pathSegments = normalizedFilePath.split('/');
    const fileNameWithExtension = pathSegments.pop(); // Extraire le nom de fichier avec extension
    const fileName = fileNameWithExtension?.split('.').slice(0, -1).join('.'); // Séparer l'extension du nom

    // Retirer le premier segment de chemin si présent (souvent un identifiant ou un conteneur)
    if (pathSegments.length > 0) {
      pathSegments.shift();
    }

    // Gérer la création ou la recherche de la structure de dossiers
    let finalFolderId = await manageFolderStructure(
      pathSegments,
      folderId,
      userId
    );

    let filePathFinal = '';
    if (finalFolderId !== '') {
      filePathFinal = `${userId}/${finalFolderId}/${fileNameWithExtension}`;
    } else {
      filePathFinal = `${userId}/${fileNameWithExtension}`;
    }

    if (!fileNameWithExtension) {
      throw new Error('Aucun de fichier');
    }

    // Créer le fichier dans la base de données
    const file = await db.file.create({
      data: {
        name: fileNameWithExtension,
        mimeType: type,
        size: size,
        path: filePathFinal,
        folderId: finalFolderId,
        userId: userId,
      },
    });

    // Mettre à jour l'espace de stockage utilisé par l'utilisateur
    await db.user.update({
      where: { id: userId },
      data: { storageUsed: user.storageUsed + size },
    });

    // Réinitialiser le cache ou l'interface utilisateur si nécessaire
    revalidatePath('/dashboard');

    return file;
  } catch (err: any) {
    // Gestion des erreurs et logging
    console.error(`Error adding file: ${err}`);
  }
}

// Fonction pour gérer la création et la mise à jour de la structure de dossiers
async function manageFolderStructure(
  pathSegments: string[],
  currentFolderId: string | undefined,
  userId: string
) {
  for (const folderName of pathSegments) {
    if (!folderName) continue; // Ignorer les segments vides
    console.log('foldername' + folderName);
    console.log('currentFolderId' + currentFolderId);

    // Recherche d'un dossier existant par ID ou par nom
    let folder = await db.folder.findFirst({
      where: {
        OR: [
          { id: folderName },
          { id: folderName, parentId: currentFolderId || null, userId: userId },
          // { id: folderName, parentId: null, userId: userId },
          {
            name: folderName,
            parentId: currentFolderId || null,
            userId: userId,
          },
          // { name: folderName, parentId: null, userId: userId },
        ],
      },
    });

    // Créer un nouveau dossier si nécessaire
    if (!folder) {
      folder = await db.folder.create({
        data: {
          name: folderName,
          parentId: currentFolderId ? currentFolderId : null, // Utiliser null si aucun parent n'est spécifié
          userId: userId,
        },
      });
    }

    // Mettre à jour l'ID du dossier pour les itérations suivantes
    currentFolderId = folder.id;
  }

  return currentFolderId; // Retourner l'ID du dernier dossier utilisé ou créé
}

export async function updateDoc(docRefId: string, downloadURL: string) {
  await db.file.update({
    where: {
      id: docRefId,
    },
    data: {
      firebaseUrl: downloadURL,
    },
  });
}
