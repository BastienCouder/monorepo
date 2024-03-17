import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// const WINDOWS_BASE_PATH = 'C:/Users/basti';
const WINDOWS_BASE_PATH = '/mnt/c/Users/basti';

async function calculateFolderSize(directoryPath: string): Promise<number> {
  let totalSize = 0;
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      totalSize += await calculateFolderSize(fullPath);
    } else {
      const { size } = await fs.stat(fullPath);
      totalSize += size;
    }
  }
  return totalSize;
}

async function countFilesInFolder(directoryPath: string): Promise<number> {
  let fileCount = 0;
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      fileCount += await countFilesInFolder(fullPath);
    } else {
      fileCount++;
    }
  }
  return fileCount;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folderPath = url.searchParams.get('path') || '';

  const allowedFolders = [
    'Documents',
    'Videos',
    'Pictures',
    'Downloads',
    'Desktop',
    'OneDrive',
  ];

  // Ensure the base path is correctly mapped for Linux
  const basePath = path.resolve(WINDOWS_BASE_PATH);
  const fullPath = path.resolve(basePath, folderPath);

  if (!fullPath.startsWith(basePath)) {
    return new NextResponse(JSON.stringify({ message: 'Invalid path!' }), {
      status: 400,
    });
  }

  try {
    const filesOrFolders = await fs.readdir(fullPath, { withFileTypes: true });
    // console.log('Files or Folders:', filesOrFolders);

    const filteredContents = filesOrFolders.filter((dirent: any) => {
      const isAllowedFolder =
        dirent.isDirectory() && allowedFolders.includes(dirent.name);
      const isNotDesktopIni = dirent.name.toLowerCase() !== 'desktop.ini';
      return folderPath === '' ? isAllowedFolder : isNotDesktopIni;
    });

    const contentsDetails = await Promise.all(
      filteredContents.map(async (dirent) => {
        try {
          const itemPath = path.resolve(fullPath, dirent.name);
          if (dirent.isDirectory()) {
            // Remarquez que nous utilisons maintenant countFilesInFolder pour obtenir le nombre de fichiers.
            // const fileCount = await countFilesInFolder(itemPath);

            return {
              name: dirent.name,
              // fileCount,
            };
          } else {
            // Pour un fichier, le compte est de 1.
            return {
              name: dirent.name,
              // fileCount: 1,
            };
          }
        } catch (error) {
          console.error(`Erreur lors du traitement de ${dirent.name}:`, error);
          return null;
        }
      })
    );

    return new NextResponse(
      JSON.stringify({ path: folderPath, files: contentsDetails }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`Error reading directory at ${fullPath}: ${err.message}`);
    return new NextResponse(
      JSON.stringify({ message: 'Unable to scan directory!' }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const folderPath = url.searchParams.get('path') || '';
  const basePath = path.resolve(WINDOWS_BASE_PATH);
  const fullPath = path.resolve(basePath, folderPath);

  if (!fullPath.startsWith(basePath)) {
    return new NextResponse(JSON.stringify({ message: 'Invalid path!' }), {
      status: 400,
    });
  }

  try {
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
    return new NextResponse(
      JSON.stringify({ message: 'Successfully deleted' }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`Error deleting ${fullPath}: ${err.message}`);
    return new NextResponse(
      JSON.stringify({ message: 'Unable to delete the file or folder' }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { oldName, newName, path: currentPath } = await request.json();

  const basePath = path.resolve(WINDOWS_BASE_PATH);
  const fullOldPath = path.resolve(basePath, currentPath, oldName);
  const fullNewPath = path.resolve(basePath, currentPath, newName);

  if (!fullOldPath.startsWith(basePath) || !fullNewPath.startsWith(basePath)) {
    return new NextResponse(JSON.stringify({ message: 'Invalid path!' }), {
      status: 400,
    });
  }

  if (fullOldPath === fullNewPath) {
    return new NextResponse(
      JSON.stringify({ message: 'New path is identical to the current path.' }),
      { status: 400 }
    );
  }

  try {
    await fs.rename(fullOldPath, fullNewPath);
    return new NextResponse(
      JSON.stringify({ message: 'Successfully renamed' }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      `Error renaming ${fullOldPath} to ${fullNewPath}: ${err.message}`
    );
    return new NextResponse(
      JSON.stringify({ message: 'Unable to rename the file or folder' }),
      { status: 500 }
    );
  }
}
