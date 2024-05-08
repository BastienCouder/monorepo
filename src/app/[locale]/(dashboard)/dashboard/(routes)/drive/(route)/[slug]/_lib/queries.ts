'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/prisma';
import type { SearchParams } from '@/types';

import { filterColumn } from '@/lib/filter-column';
import { searchParamsSchema } from '@/schemas/page-params';
import { Prisma } from '@prisma/client';
import { Folder, File } from '@/schemas/db';

export async function getDrive(
  folderPath: string,
  searchParams: SearchParams,
  teamId: string
) {
  noStore();
  try {
    const { currentpath, ...filteredSearchParams } = searchParams;

    const { page, per_page, sort, name } =
      searchParamsSchema.parse(filteredSearchParams);
    // const pageAsNumber = Number(page);
    // const fallbackPage =
    //   isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // const perPageAsNumber = Number(per_page);
    // const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

    const [column, rawOrder] = sort
      ? (sort.split('.') as [
          keyof typeof db.user | undefined,
          'asc' | 'desc' | undefined,
        ])
      : ['name', 'desc'];
    const order =
      rawOrder === 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;

    // Adapt orderByClause to handle dynamic column names safely
    const orderByClause = column
      ? { [column]: order }
      : { id: Prisma.SortOrder.desc };

    let whereClauseFolder;
    let whereClauseFile;

    let folders: Folder[] = [];
    let files: File[] = [];

    if (!filteredSearchParams.name) {
      whereClauseFolder = {
        teamId,
        parentId: folderPath || null,
        ...(name && { name: filterColumn({ value: name }) }),
      };

      whereClauseFile = {
        teamId,
        ...(name && { name: filterColumn({ value: name }) }),
      };

      folders = await db.folder.findMany({
        where: whereClauseFolder,
        // take: limit,
        // skip: offset,
        orderBy: orderByClause,
      });

      files = await db.file.findMany({
        where: { ...whereClauseFile, folderId: folderPath },
        // take: limit,
        // skip: offset,
        orderBy: orderByClause,
      });
    }

    if (filteredSearchParams.name) {
      whereClauseFolder = {
        teamId,
        ...(name && { name: filterColumn({ value: name }) }),
      };

      whereClauseFile = {
        teamId,
        ...(name && { name: filterColumn({ value: name }) }),
      };

      folders = await db.folder.findMany({
        where: whereClauseFolder,
        // take: limit,
        // skip: offset,
        // orderBy: orderByClause,
      });

      files = await db.file.findMany({
        where: { ...whereClauseFile },
        // take: limit,
        // skip: offset,
        // orderBy: orderByClause,
      });
    }

    const folderIds = folders?.map((folder) => folder.id);

    const folderCount = await db.folder.count({ where: whereClauseFolder });
    const fileCount = await db.file.count({
      where: { ...whereClauseFile, folderId: folderPath },
    });

    // const folderPageCount = Math.ceil(folderCount / limit);
    // const filePageCount = Math.ceil(fileCount / limit);

    const foldersWithData = await Promise.all(
      folders.map(async (folder) => ({
        ...folder,
        sizeFolder: await calculateFolderSize(folder.id),
      }))
    );

    return {
      folders: {
        data: foldersWithData,
        // totalCount: folderCount,
        // pageCount: folderPageCount,
      },
      files: {
        data: files,
        // totalCount: fileCount,
        // pageCount: filePageCount,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      folders: { data: [], totalCount: 0, pageCount: 0 },
      files: { data: [], totalCount: 0, pageCount: 0 },
    };
  }
}

async function calculateFolderSize(folderId: string): Promise<number> {
  const files = await db.file.findMany({
    where: { folderId },
    select: { size: true },
  });

  const subfolders = await db.folder.findMany({
    where: { parentId: folderId },
    select: { id: true },
  });

  const subfolderSizes = await Promise.all(
    subfolders.map((subfolder) => calculateFolderSize(subfolder.id))
  );

  return (
    files.reduce((acc, file) => acc + file.size, 0) +
    subfolderSizes.reduce((acc, size) => acc + size, 0)
  );
}
