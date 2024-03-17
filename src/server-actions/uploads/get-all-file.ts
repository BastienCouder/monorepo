'use server';
import { db } from '@/lib/prisma';

export async function getAllFilesForUser(userId: string) {
  const files = await db.file.findMany({
    where: { userId: userId },
  });

  return files.map((file) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    path: file.path,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  }));
}
