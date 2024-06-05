'use server';
import { currentUser } from '@/lib/authCheck';
import { storage } from '@/libs/firebase';
import { db } from '@/lib/prisma';
import { File } from '@/models/db';
import { deleteObject, ref } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

async function deleteFolderRecursively(
  folderId: string,
  userId: string
): Promise<number> {
  let sizeDeleted = 0;

  const subfolders = await db.folder.findMany({
    where: { parentId: folderId, userId: userId },
  });

  for (const subfolder of subfolders) {
    sizeDeleted += await deleteFolderRecursively(subfolder.id, userId);
  }

  const files = await db.file.findMany({
    where: { folderId: folderId, userId: userId },
    select: { size: true },
  });

  const fileSizeSum = files.reduce((sum, file) => sum + file.size, 0);
  sizeDeleted += fileSizeSum;

  await db.file.deleteMany({
    where: { folderId: folderId, userId: userId },
  });

  await db.folder.delete({
    where: { id: folderId, userId: userId },
  });

  return sizeDeleted;
}

async function deleteFileFromFirebase(firebaseUrl: string) {
  try {
    const fileRef = ref(storage, firebaseUrl);
    await deleteObject(fileRef);
    console.log(`File deleted from Firebase Storage: ${firebaseUrl}`);
  } catch (error) {
    console.error('Failed to delete file from Firebase:', error);
    throw new Error('Failed to delete file from Firebase');
  }
}
export async function deleteItems(itemIds: string[]) {
  const user = await currentUser();
  const userId = user?.id;
  console.log('items: ', itemIds);

  if (!userId) {
    return;
  }

  const results = [];
  let totalSizeDeleted = 0;

  for (const itemId of itemIds) {
    try {
      const folder = await db.folder.findUnique({
        where: { id: itemId, userId: userId },
      });

      if (folder) {
        totalSizeDeleted += await deleteFolderRecursively(itemId, userId);
        results.push({
          id: itemId,
          success: 'Folder and its contents deleted successfully.',
        });
      } else {
        const file: File = await db.file.findUnique({
          where: { id: itemId, userId: userId },
          select: { size: true, path: true },
        });

        if (file) {
          totalSizeDeleted += file.size;

          console.log(file.path);

          // await deleteFileFromFirebase(file.path);
          await db.file.delete({
            where: { id: itemId, userId: userId },
          });
          results.push({ id: itemId, success: 'File deleted successfully.' });
        } else {
          results.push({ id: itemId, error: 'Item not found.' });
        }
      }
    } catch (error) {
      console.error(`Error deleting item with ID ${itemId}:`, error);
      results.push({
        id: itemId,
        error: 'Failed to delete item due to server error.',
      });
    }
  }

  if (totalSizeDeleted > 0) {
    await updateUserStorage(userId, -totalSizeDeleted);
  }
  console.log(results);

  revalidatePath('/dashboard');
  return results;
}

async function updateUserStorage(userId: string, sizeChange: number) {
  return db.user.update({
    where: { id: userId },
    data: {
      storageUsed: {
        decrement: sizeChange,
      },
    },
  });
}
