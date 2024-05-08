'use server';
import { currentUser } from '@/lib/authCheck';
import { storage } from '@/lib/firebase';
import { db } from '@/lib/prisma';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

// export async function copyItems(ids: string[]): Promise<void> {
//   const copiedItems: CopiedItems = getLocalStorage('copiedItems', {
//     folderIds: [],
//     fileIds: [],
//   });
//   const folderIds: string[] = [];
//   const fileIds: string[] = [];

//   for (const id of ids) {
//     const isFolder = await db.folder.findUnique({ where: { id } });
//     if (isFolder && !copiedItems.folderIds.includes(id)) {
//       folderIds.push(id);
//     } else {
//       const isFile = await db.file.findUnique({ where: { id } });
//       if (isFile && !copiedItems.fileIds.includes(id)) {
//         fileIds.push(id);
//       }
//     }
//   }
//   revalidatePath('/dashboard');

//   copiedItems.folderIds = [...copiedItems.folderIds, ...folderIds];
//   copiedItems.fileIds = [...copiedItems.fileIds, ...fileIds];

//   const set = setLocalStorage('copiedItems', copiedItems);
//   console.log('Copied:', set);
// }

export async function pasteItems(
  targetFolderId: string | null,
  ids: string[]
): Promise<void> {
  console.log('IDs to paste:', ids);
  console.log(targetFolderId === '');

  if (targetFolderId === '') {
    targetFolderId = null;
  }

  const user = await currentUser();
  if (!user) {
    console.log('User not found, aborting paste operation.');
    return;
  }

  // Set basePath based on whether targetFolderId is the same as userId
  let basePath =
    user.id === targetFolderId ? `${user.id}` : `${user.id}/${targetFolderId}`;

  for (const id of ids) {
    const isFolder = await db.folder.findUnique({ where: { id } });
    if (isFolder) {
      console.log(`Copying folder with ID: ${id}`);
      const res = await copyFolder(id, targetFolderId, user.id, basePath);
      console.log('Folder copied:', res);
    } else {
      const isFile = await db.file.findUnique({ where: { id } });
      if (isFile) {
        console.log(`Copying file with ID: ${id}`);
        const res = await copyFile(id, targetFolderId, user.id, basePath);
        console.log('File copied:', res);
      } else {
        console.log(`No valid entry found for ID: ${id}`);
      }
    }
  }

  revalidatePath('/dashboard');
  console.log('Paste operation completed.');
}

async function copyFolder(
  originalFolderId: string,
  targetFolderId: string | null,
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
  console.log(targetFolderId);

  let parentId = targetFolderId === userId ? null : targetFolderId;

  if (!originalFolder) throw new Error(`Folder not found: ${originalFolderId}`);

  let copyName = originalFolder.name;
  let duplicateCount = 0;
  let newFolderName = `${copyName}`;
  let folderExists = await checkFolderExists(newFolderName, parentId);

  while (folderExists) {
    duplicateCount++;
    newFolderName = `${copyName} (${duplicateCount})`;
    folderExists = await checkFolderExists(newFolderName, parentId);
  }

  const copiedFolder = await db.folder.create({
    data: {
      userId: userId,
      name: newFolderName,
      parentId: parentId,
    },
  });

  for (const file of originalFolder.files) {
    await copyFile(
      file.id,
      copiedFolder.id,
      userId,
      `${basePath}/${copiedFolder.name}`
    );
  }

  for (const subfolder of originalFolder.subfolders) {
    await copyFolder(
      subfolder.id,
      copiedFolder.id,
      userId,
      `${basePath}/${copiedFolder.name}`
    );
  }
}

// Helper function to check if a folder exists with a given name within a specific parent folder
async function checkFolderExists(
  folderName: string,
  parentId: string | null
): Promise<boolean> {
  try {
    const folder = await db.folder.findFirst({
      where: {
        name: folderName,
        parentId: parentId,
      },
    });
    return !!folder;
  } catch (error) {
    console.error('Failed to check folder existence:', error);
    return false;
  }
}

async function copyFile(
  fileId: string,
  targetFolderId: string | null,
  userId: string,
  basePath: string
): Promise<void> {
  const originalFile = await db.file.findUnique({ where: { id: fileId } });

  // Check if the file was retrieved and if it has a valid 'path'
  if (!originalFile) {
    console.error(`File with ID ${fileId} not found.`);
    throw new Error(`File not found: ${fileId}`);
  }

  if (!originalFile.path) {
    console.error(`File path is undefined for file with ID ${fileId}.`);
    throw new Error(`Path is undefined for file: ${fileId}`);
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error('User not found.');
    throw new Error('User not found');
  }

  let copyName = originalFile.name;
  let newFilePath = `${basePath}/${copyName}`;
  let fileExists = await checkFileExists(copyName, targetFolderId);

  let duplicateCount = 0;
  while (fileExists) {
    duplicateCount++;
    copyName = `${originalFile.name} (${duplicateCount})`;
    newFilePath = `${basePath}/${copyName}`;
    fileExists = await checkFileExists(copyName, targetFolderId);
  }

  const originalFileRef = ref(storage, originalFile.path); // Ensure path is now guaranteed to be non-null
  const blob = await fetch(await getDownloadURL(originalFileRef)).then((res) =>
    res.blob()
  );
  const newFileRef = ref(storage, newFilePath);

  if (user.storageUsed + blob.size > user.storageLimit) {
    throw new Error('Storage limit exceeded');
  }

  await uploadBytes(newFileRef, blob);
  const newFileDownloadURL = await getDownloadURL(newFileRef);

  await db.file.create({
    data: {
      name: copyName,
      size: originalFile.size,
      path: newFilePath,
      firebaseUrl: newFileDownloadURL,
      folderId: targetFolderId,
      userId: userId,
    },
  });
}

async function checkFileExists(
  fileName: string,
  folderId: string | null
): Promise<boolean> {
  try {
    const file = await db.file.findFirst({
      where: {
        name: fileName,
        folderId: folderId,
      },
    });
    return !!file;
  } catch (error) {
    console.error('Failed to check file existence:', error);
    return false;
  }
}

export async function moveItems(
  folderIds: string[],
  fileIds: string[],
  targetFolderId: string
) {
  for (const folderId of folderIds) {
    await db.folder.update({
      where: { id: folderId },
      data: { parentId: targetFolderId },
    });
  }

  for (const fileId of fileIds) {
    await db.file.update({
      where: { id: fileId },
      data: { folderId: targetFolderId },
    });
  }
}
