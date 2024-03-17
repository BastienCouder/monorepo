'use server';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { Folder } from '@prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface ExtendedFile extends File {
  folder?: ExtendedFolder;
}

interface ExtendedFolder extends Folder {
  files: ExtendedFile[];
  subfolders: ExtendedFolder[];
  totalSize?: number;
  totalFiles?: number;
}

interface CopiedItems {
  folderIds: string[];
  fileIds: string[];
}

let copiedItems: CopiedItems = {
  folderIds: [],
  fileIds: [],
};

export async function copyItems(ids: string[]): Promise<void> {
  const folderIds: string[] = [];
  const fileIds: string[] = [];

  for (const id of ids) {
    const isFolder = await db.folder.findUnique({ where: { id } });
    if (isFolder) {
      if (!copiedItems.folderIds.includes(id)) {
        folderIds.push(id);
      }
    } else {
      const isFile = await db.file.findUnique({ where: { id } });
      if (isFile) {
        if (!copiedItems.fileIds.includes(id)) {
          fileIds.push(id);
        }
      }
    }
  }

  copiedItems = {
    folderIds: [...copiedItems.folderIds, ...folderIds],
    fileIds: [...copiedItems.fileIds, ...fileIds],
  };
}

export async function pasteItems(
  userId: string,
  targetFolderId: string
): Promise<void> {
  const targetFolder = await db.folder.findUnique({
    where: { id: targetFolderId },
  });
  if (!targetFolder) throw new Error('Target folder not found');

  // Préparez le chemin de base pour les fichiers dans Firebase Storage
  const basePath = `${userId}/${targetFolderId}`;

  // Copiez les dossiers et les fichiers sélectionnés
  for (const folderId of copiedItems.folderIds) {
    await copyFolder(folderId, targetFolderId, userId, basePath);
  }

  for (const fileId of copiedItems.fileIds) {
    await copyFile(fileId, targetFolderId, userId, basePath);
  }

  // Réinitialiser les éléments copiés après l'opération
  copiedItems = { folderIds: [], fileIds: [] };
}

async function copyFolder(
  originalFolderId: string,
  targetFolderId: string,
  userId: string,
  basePath: string
): Promise<void> {
  const originalFolder = await db.folder.findUnique({
    where: { id: originalFolderId },
    include: {
      files: true,
      subfolders: true,
    },
  });

  if (!originalFolder) throw new Error(`Folder not found: ${originalFolderId}`);

  // Créez une copie du dossier dans Prisma
  const copiedFolder = await db.folder.create({
    data: {
      userId: userId,
      name: `${originalFolder.name} (copy)`,
      parentId: targetFolderId,
    },
  });

  // Pour chaque fichier du dossier original, copiez-le dans Firebase et créez une entrée dans Prisma
  for (const file of originalFolder.files) {
    await copyFile(
      file.id,
      copiedFolder.id,
      userId,
      `${basePath}/${copiedFolder.name}`
    );
  }

  // Répétez récursivement pour les sous-dossiers
  for (const subfolder of originalFolder.subfolders) {
    await copyFolder(
      subfolder.id,
      copiedFolder.id,
      userId,
      `${basePath}/${copiedFolder.name}`
    );
  }
}

async function copyFile(
  fileId: string,
  targetFolderId: string,
  userId: string,
  basePath: string
): Promise<void> {
  const originalFile = await db.file.findUnique({ where: { id: fileId } });
  if (!originalFile) throw new Error(`File not found: ${fileId}`);

  // Récupérer les informations de l'utilisateur
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // Déterminer le nouveau chemin dans Firebase Storage pour le fichier copié
  const newFilePath = `${basePath}/${originalFile.name}`;

  // Copier le fichier dans Firebase Storage
  const originalFileRef = ref(storage, originalFile.path!);
  const blob = await fetch(await getDownloadURL(originalFileRef)).then((res) =>
    res.blob()
  );
  const newFileRef = ref(storage, newFilePath);

  // Avant d'uploader, vérifier si l'utilisateur dépasse sa limite de stockage
  if (user.storageUsed + blob.size > user.storageLimit) {
    throw new Error('Limite de stockage dépassée');
  }
  // Uploadez le blob vers le nouvel emplacement dans Firebase Storage
  await uploadBytes(newFileRef, blob);
  const newFileDownloadURL = await getDownloadURL(newFileRef);

  // Créez une nouvelle entrée dans la base de données Prisma pour le fichier copié
  await db.file.create({
    data: {
      name: originalFile.name,
      size: originalFile.size,
      path: newFilePath, // Nouveau chemin dans Firebase Storage
      firebaseUrl: newFileDownloadURL, // URL de téléchargement du fichier dans Firebase
      folderId: targetFolderId, // ID du dossier cible où le fichier est "collé"
      userId: userId,
    },
  });
}
