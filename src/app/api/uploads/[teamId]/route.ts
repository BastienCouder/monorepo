import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Fonction API pour traiter la requête POST d'upload de fichier
export async function POST(request: Request) {
  // Extraire les données nécessaires de la requête
  const { userId, downloadURL, size, type, filePath, folderId, teamId } =
    await request.json();

  try {
    // Récupérer les informations de l'utilisateur
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) throw new Error('Team non trouvé');

    // Valider le chemin du fichier
    if (!filePath || filePath.startsWith('/') || !filePath.includes('/')) {
      throw new Error(
        'Le chemin du fichier est invalide ou représente une référence racine.'
      );
    }

    // Vérifier la limite de stockage
    if (team.storageUsed + size > team.storageLimit) {
      throw new Error('Limite de stockage dépassée');
    }

    // Normaliser le chemin du fichier en retirant un slash initial si présent
    const normalizedFilePath = filePath.startsWith('/')
      ? filePath.slice(1)
      : filePath;

    // Extraire les segments de chemin et le nom de fichier
    const pathSegments = normalizedFilePath.split('/');
    const fileNameWithExtension = pathSegments.pop(); // Extraire le nom de fichier avec extension
    const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // Séparer l'extension du nom

    // Retirer le premier segment de chemin si présent (souvent un identifiant ou un conteneur)
    if (pathSegments.length > 0) {
      pathSegments.shift();
    }

    // Gérer la création ou la recherche de la structure de dossiers
    let finalFolderId = await manageFolderStructure(
      pathSegments,
      folderId,
      userId,
      teamId
    );

    let filePathFinal = '';
    if (finalFolderId !== '') {
      filePathFinal = `${teamId}/${finalFolderId}/${fileNameWithExtension}`;
    } else {
      filePathFinal = `${teamId}/${fileNameWithExtension}`;
    }

    // Créer le fichier dans la base de données
    const file = await db.file.create({
      data: {
        name: fileName,
        mimeType: type,
        size: size,
        path: filePathFinal,
        folderId: finalFolderId,
        userId: userId,
        firebaseUrl: downloadURL,
        teamId,
      },
    });

    // Mettre à jour l'espace de stockage utilisé par l'utilisateur
    await db.team.update({
      where: { id: teamId },
      data: { storageUsed: team.storageUsed + size },
    });

    // Réinitialiser le cache ou l'interface utilisateur si nécessaire
    revalidatePath('/dashboard');
    return new NextResponse(
      JSON.stringify({ message: 'Success', fileId: file.id }),
      { status: 200 }
    );
  } catch (err: any) {
    // Gestion des erreurs et logging
    console.error(`Error adding file: ${err}`);
    return new NextResponse(
      JSON.stringify({ message: 'Error adding file', error: err.toString() }),
      { status: 500 }
    );
  }
}

// Fonction pour gérer la création et la mise à jour de la structure de dossiers
async function manageFolderStructure(
  pathSegments: string[],
  currentFolderId: string,
  userId: string,
  teamId: string
) {
  for (const folderName of pathSegments) {
    if (!folderName) continue; // Ignorer les segments vides

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
          teamId,
        },
      });
    }

    // Mettre à jour l'ID du dossier pour les itérations suivantes
    currentFolderId = folder.id;
  }

  return currentFolderId; // Retourner l'ID du dernier dossier utilisé ou créé
}
