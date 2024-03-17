'use server';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { ref, uploadBytes, getMetadata } from 'firebase/storage';

export async function addFile(
  userId: string,
  file: File,
  filePath: string,
  folderId: string | null
): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Utilisateur non trouvé');
  console.log(userId + ' ' + file + ' ' + filePath + ' ' + folderId);

  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);

  const metadata = await getMetadata(fileRef);
  const fileSize = metadata.size;

  if (user.storageUsed + fileSize > user.storageLimit) {
    throw new Error('Limite de stockage dépassée');
  }

  await db.user.update({
    where: { id: userId },
    data: { storageUsed: user.storageUsed + fileSize },
  });

  const create = await db.file.create({
    data: {
      name: file.name,
      mimeType: metadata.contentType || '',
      size: fileSize,
      path: filePath,
      userId: userId,
      folderId: folderId,
      type: file.type,
    },
  });

  console.log(create);
}
