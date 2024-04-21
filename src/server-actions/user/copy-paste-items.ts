'use server';
import { db } from '@/lib/prisma';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

export async function processItems(
  itemIds: string[],
  operationType: string,
  targetFolderId: string,
  userId: string
) {
  const results = [];

  const folders = await db.folder.findMany({
    where: { id: { in: itemIds }, userId: userId },
    include: { files: true, subfolders: true },
  });

  const files = await db.file.findMany({
    where: { id: { in: itemIds }, userId: userId },
  });

  if (operationType === 'copy') {
    for (const folder of folders) {
      results.push(await copyFolder(folder.id, userId));
    }
    for (const file of files) {
      results.push(await copyFile(file.id, userId));
    }
  } else if (operationType === 'paste' && targetFolderId) {
    const basePath = `${userId}/${targetFolderId}`;
    for (const folder of folders) {
      results.push(await pasteFolder(folder.id, targetFolderId, userId));
    }
    for (const file of files) {
      results.push(await pasteFile(file.id, targetFolderId, userId));
    }
  } else {
    throw new Error(
      'Invalid operation type or missing target folder ID for paste operation.'
    );
  }
  revalidatePath('/dashboard');
  return results;
}
async function copyFolder(folderId: string, userId: string) {
  const folder = await db.folder.findUnique({
    where: { id: folderId, userId: userId },
    include: { files: true, subfolders: true },
  });
  if (!folder) return 'Folder not found';

  // Generate a unique new name only if it's the initial copy
  const newName = await generateNewName(folder.name, userId, folder.parentId!);

  const newFolder = await db.folder.create({
    data: {
      name: newName,
      parentId: folder.parentId, // Maintain the original parent during copy
      userId: userId,
    },
  });

  // Recursively copy contents
  for (const subfolder of folder.subfolders) {
    await copyFolder(subfolder.id, userId); // Recursive copy for subfolders
  }
  for (const file of folder.files) {
    await copyFile(file.id, userId); // Recursive copy for files
  }

  return `Copied folder ${folderId} as ${newName}`;
}

async function generateNewName(
  baseName: string,
  userId: string,
  parentId: string
) {
  let newName = `${baseName} (copy)`;
  let count = 1;
  while (
    (await db.folder.count({
      where: {
        name: newName,
        userId: userId,
        parentId: parentId,
      },
    })) > 0
  ) {
    newName = `${baseName} (copy ${count++})`;
  }
  return newName;
}
async function copyFile(fileId: string, userId: string) {
  const file = await db.file.findUnique({
    where: { id: fileId, userId: userId },
  });
  if (!file) return 'File not found';

  const newName = await generateNewFileName(file.name, userId, file.folderId!);

  await db.file.create({
    data: {
      name: newName,
      size: file.size,
      path: file.path, // Preserving the original path, consider changing if needed
      folderId: file.folderId,
      userId: userId,
    },
  });

  return `Copied file ${fileId} as ${newName}`;
}

async function generateNewFileName(
  baseName: string,
  userId: string,
  folderId: string
) {
  let newName = `${baseName} (copy)`;
  let count = 1;
  while (
    (await db.file.count({
      where: {
        name: newName,
        userId: userId,
        folderId: folderId,
      },
    })) > 0
  ) {
    newName = `${baseName} (copy ${count++})`;
  }
  return newName;
}
async function pasteFolder(
  folderId: string,
  targetFolderId: string,
  userId: string
) {
  const folder = await db.folder.findUnique({
    where: { id: folderId, userId: userId },
    include: { files: true, subfolders: true },
  });
  if (!folder) return 'Folder not found';

  // Paste with the original name; only modify if explicitly required
  const newName = folder.name;

  const newFolder = await db.folder.create({
    data: {
      name: newName,
      parentId: targetFolderId, // Set the new parent ID
      userId: userId,
    },
  });

  // Recursively paste contents
  for (const subfolder of folder.subfolders) {
    await pasteFolder(subfolder.id, newFolder.id, userId);
  }
  for (const file of folder.files) {
    await pasteFile(file.id, newFolder.id, userId);
  }

  return `Pasted folder ${folderId} to ${targetFolderId} as ${newName}`;
}

async function pasteFile(
  fileId: string,
  targetFolderId: string,
  userId: string
) {
  const file = await db.file.findUnique({
    where: { id: fileId, userId: userId },
  });
  if (!file) return 'File not found';

  const newName = file.name;

  await db.file.create({
    data: {
      name: newName,
      size: file.size,
      path: file.path,
      folderId: targetFolderId, // Set the new folder ID
      userId: userId,
    },
  });

  return `Pasted file ${fileId} to ${targetFolderId} as ${newName}`;
}
