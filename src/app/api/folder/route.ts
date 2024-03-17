import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);
const WINDOWS_BASE_PATH = '/mnt/c/Users/basti';

interface DirectoryEntry {
  name: string;
  type: 'folder' | 'file';
  size?: number;
  children?: DirectoryEntry[];
}

async function calculateFolderSize(folderPath: string): Promise<number> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  let totalSize = 0;

  for (const entry of entries) {
    const entryPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += await calculateFolderSize(entryPath);
    } else {
      const stats = await fs.stat(entryPath);
      totalSize += stats.size;
    }
  }

  return totalSize;
}

async function getDiskSpace(driveLetter: string) {
  try {
    const { stdout } = await execPromise(
      `wmic logicaldisk where caption='${driveLetter}:' get size,freespace`
    );
    const lines = stdout.trim().split('\n');
    const data = lines[1].trim().split(/\s+/);
    const total = parseInt(data[1], 10);
    const free = parseInt(data[0], 10);
    return { total, free };
  } catch (error) {
    console.error('Error getting disk space:', error);
    return { total: 0, free: 0 };
  }
}

async function getDiskSpaceUnix(path: string) {
  try {
    const { stdout } = await execPromise(`df -k "${path}"`);
    const lines = stdout.trim().split('\n');
    const data = lines[1].split(/\s+/);
    const total = parseInt(data[1], 10) * 1024;
    const free = parseInt(data[3], 10) * 1024;
    return { total, free };
  } catch (error) {
    console.error('Error getting disk space:', error);
    return { total: 0, free: 0 };
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const folderPath = url.searchParams.get('path') || '';
  const allowedFolders = ['Documents', 'Videos', 'Pictures', 'Downloads'];
  const basePath = path.resolve(WINDOWS_BASE_PATH);
  const fullPath = path.resolve(basePath, folderPath);

  if (!fullPath.startsWith(basePath)) {
    return new NextResponse(JSON.stringify({ message: 'Invalid path!' }), {
      status: 400,
    });
  }

  try {
    let diskSpace;
    if (os.platform() === 'win32') {
      diskSpace = await getDiskSpace('C');
    } else {
      diskSpace = await getDiskSpaceUnix(fullPath);
    }
    const filesOrFolders = await fs.readdir(fullPath, { withFileTypes: true });
    let contentsDetails: DirectoryEntry[] = [];
    let others: DirectoryEntry[] = [];

    for (const dirent of filesOrFolders) {
      let size = 0;
      if (dirent.isDirectory()) {
        const dirPath = path.join(fullPath, dirent.name);
        // size = await calculateFolderSize(dirPath); // Calcul de la taille
        if (allowedFolders.includes(dirent.name)) {
          contentsDetails.push({
            name: dirent.name,
            type: 'folder',
            size: size || 0,
          });
        } else {
          others.push({ name: dirent.name, type: 'folder', size: size });
        }
      } else {
        const filePath = path.join(fullPath, dirent.name);
        const stats = await fs.stat(filePath);
        others.push({ name: dirent.name, type: 'file', size: stats.size });
      }
    }

    if (others.length > 0) {
      // Calculer la taille totale du dossier "Other"
      const otherSize = others.reduce((acc, curr) => acc + (curr.size || 0), 0);
      contentsDetails.push({
        name: 'Other',
        type: 'folder',
        children: others,
        size: otherSize,
      });
    }

    return new NextResponse(
      JSON.stringify({
        path: folderPath,
        files: contentsDetails,
        diskSpace: diskSpace,
      }),
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
