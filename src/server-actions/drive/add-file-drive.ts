'use server';

import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import {
  ref,
  uploadBytes,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';

export async function addTeamFile(
  teamId: string,
  file: File,
  filePath: string,
  folderId: string | null
): Promise<void> {
  // Assurez-vous que l'équipe existe
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Équipe non trouvée');

  // Vérification et mise à jour de l'utilisation du stockage de l'équipe
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);

  const metadata = await getMetadata(fileRef);
  const fileSize = metadata.size;

  // Vérifiez si l'ajout du fichier dépasse la limite de stockage de l'équipe
  if (team.storageUsed + fileSize > team.storageLimit) {
    throw new Error('Limite de stockage de l’équipe dépassée');
  }

  // Obtenez l'URL de téléchargement du fichier
  const firebaseUrl = await getDownloadURL(fileRef);

  // Mise à jour de l'utilisation du stockage de l'équipe
  await db.team.update({
    where: { id: teamId },
    data: { storageUsed: team.storageUsed + fileSize },
  });

  // Création de l'entrée de fichier dans la base de données avec firebaseUrl
  const fileEntry = await db.file.create({
    data: {
      name: file.name,
      mimeType: metadata.contentType || '',
      size: fileSize,
      path: filePath, // Chemin dans Firebase Storage
      firebaseUrl: firebaseUrl, // URL de téléchargement Firebase
      teamId: teamId,
      folderId: folderId,
      type: file.type,
    },
  });

  console.log('Fichier ajouté à l’équipe avec Firebase URL:', fileEntry);
}
