'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/prisma';
import type { SearchParams } from '@/types';

import { filterColumn } from '@/lib/filter-column';
import { searchParamsSchema } from '@/schemas/page-params';
import { Prisma } from '@prisma/client';

export async function getFoldersFiles(
  userId: string,
  folderPath: string,
  searchParams: SearchParams
) {
  noStore();
  try {
    const { page, per_page, sort, name } =
      searchParamsSchema.parse(searchParams);
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

    const whereClauseFolder = {
      userId,
      parentId: folderPath || null,
      ...(name && { name: filterColumn({ value: name }) }),
    };

    const whereClauseFile = {
      userId,
      ...(name && { name: filterColumn({ value: name }) }),
    };

    const folders = await db.folder.findMany({
      where: whereClauseFolder,
      // take: limit,
      // skip: offset,
      orderBy: orderByClause,
    });

    const folderIds = folders.map((folder) => folder.id);

    const files = await db.file.findMany({
      where: { ...whereClauseFile, folderId: folderPath },
      // take: limit,
      // skip: offset,
      orderBy: orderByClause,
    });

    const folderCount = await db.folder.count({ where: whereClauseFolder });
    const fileCount = await db.file.count({
      where: { ...whereClauseFile, folderId: folderPath },
    });

    // const folderPageCount = Math.ceil(folderCount / limit);
    // const filePageCount = Math.ceil(fileCount / limit);

    const filesAggregate = await db.file.groupBy({
      by: ['folderId'],
      _sum: {
        size: true,
      },
      _count: {
        id: true,
      },
      where: {
        folderId: {
          in: folderIds,
        },
      },
    });

    const foldersWithData = folders.map((folder) => ({
      ...folder,
      filesAggregate: filesAggregate.find(
        (agg) => agg.folderId === folder.id
      ) || { _sum: { size: 0 }, _count: { id: 0 } },
    }));

    return {
      folders: {
        data: foldersWithData,
        totalCount: folderCount,
        // pageCount: folderPageCount,
      },
      files: {
        data: files,
        totalCount: fileCount,
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
