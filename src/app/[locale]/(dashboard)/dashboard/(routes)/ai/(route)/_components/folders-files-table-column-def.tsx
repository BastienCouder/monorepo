'use client';

import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
// import FolderTableRowActions from './folder-table-row-actions';
// import FileTableRowActions from './file-table-row-actions';
import { formatStorage } from '@/lib/utils';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from '@/types';
import FolderFileTableRowActions from './folders-files-table-row-actions';
import { MdFolder } from 'react-icons/md';
import { FaFile } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { CheckCheck } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  sizeFolder: number;
  operate: boolean;
  createdAt: Date;
}

interface File {
  id: string;
  name: string;
  size: number;
  operate: boolean;
  firebaseUrl: string;
  createdAt: Date;
}

type Item = Folder | File;

export function fetchItemsTableColumnDefs(
  setCurrentPath: (path: string) => void,
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<Item, unknown>[] {
  const baseColumns: ColumnDef<Item, unknown>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
          <div
            className={`mt-[1.8px] p-1 rounded-sm   ${row.original.operate === true ? 'bg-green-300' : 'bg-red-300'}`}
          >
            {row.original.operate === true ? (
              <CheckCheck size={10} color="#147D30" />
            ) : (
              <IoClose size={10} color="#A52330" />
            )}
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => {
            const item = row.original;
            if ('size' in item) {
              if (item.firebaseUrl) {
                window.open(item.firebaseUrl, '_blank');
              }
            } else {
              setCurrentPath(item.id);
            }
          }}
        >
          {!row.original.hasOwnProperty('size') ? (
            <MdFolder size={15} color="hsl(var(--primary))" />
          ) : (
            <FaFile size={15} color="hsl(var(--primary))" />
          )}
          <span>{row.getValue('name')}</span>
        </div>
      ),
    },
  ];

  baseColumns.push({
    accessorKey: 'size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: (info) =>
      'size' in info.row.original ? (
        <div>{formatStorage(info.row.original.size)}</div>
      ) : (
        <div>{formatStorage(info.row.original.sizeFolder)}</div>
      ),
  });

  baseColumns.push({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: (info) => (
      <div className="flex space-x-2">
        <FolderFileTableRowActions
          row={info.row}
          startTransition={startTransition}
          setCurrentPath={setCurrentPath}
        />
      </div>
    ),
  });

  return baseColumns;
}

export const filterableColumns: DataTableFilterableColumn<Folder | File>[] = [];

export const searchableColumns: DataTableSearchableColumn<Folder | File>[] = [
  {
    id: 'name',
    title: 'Name',
  },
];
