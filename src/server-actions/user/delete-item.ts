'use server';
import { currentUser } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteItem(itemId: string) {
  const user = await currentUser();
  const userId = user?.id;
  try {
    const folder = await db.folder.findUnique({
      where: { id: itemId },
      include: { files: true },
    });
    if (folder && folder.userId === userId) {
      if (folder.files && folder.files.length > 0) {
        return { error: 'Folder is not empty.' };
      }
      await db.folder.delete({
        where: { id: itemId },
      });

      return { success: 'Folder deleted successfully.' };
    }

    if (!folder) {
      const file = await db.file.findUnique({
        where: { id: itemId },
      });

      if (file && file.userId === userId) {
        await db.file.delete({
          where: { id: itemId },
        });

        return { success: 'File deleted successfully.' };
      }
    }
    revalidatePath('/dashboard');

    return { error: 'Item not found or unauthorized.' };
  } catch (error) {
    console.error('Error deleting item:', error);
    return { error: 'Unable to delete item.' };
  }
}
