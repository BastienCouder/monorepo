'use server';

import { currentUser } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function toggleOperateFolderRecursively(
  folderId: string,
  userId: string
): Promise<void> {
  const folder = await db.folder.findUnique({
    where: { id: folderId, userId: userId },
  });

  if (folder) {
    await db.folder.update({
      where: { id: folderId, userId: userId },
      data: { operate: !folder.operate },
    });

    const subfolders = await db.folder.findMany({
      where: { parentId: folderId, userId: userId },
    });

    for (const subfolder of subfolders) {
      await toggleOperateFolderRecursively(subfolder.id, userId);
    }

    const files = await db.file.findMany({
      where: { folderId: folderId, userId: userId },
    });

    for (const file of files) {
      await db.file.update({
        where: { id: file.id, userId: userId },
        data: { operate: !file.operate },
      });
    }
  }
}

export async function operateItems(itemIds: string[]) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error('User not authenticated');
    return;
  }

  const results = [];

  for (const itemId of itemIds) {
    const folder = await db.folder.findUnique({
      where: { id: itemId, userId: userId },
    });

    if (folder) {
      await toggleOperateFolderRecursively(itemId, userId);
      results.push({
        id: itemId,
        success: 'Folder operation state toggled successfully.',
      });
    } else {
      const file = await db.file.findUnique({
        where: { id: itemId, userId: userId },
      });

      if (file) {
        await db.file.update({
          where: { id: itemId, userId: userId },
          data: { operate: !file.operate },
        });
        results.push({
          id: itemId,
          success: 'File operation state toggled successfully.',
        });
      } else {
        results.push({ id: itemId, error: 'Item not found.' });
      }
    }
  }

  revalidatePath('/dashboard');
  return results;
}
