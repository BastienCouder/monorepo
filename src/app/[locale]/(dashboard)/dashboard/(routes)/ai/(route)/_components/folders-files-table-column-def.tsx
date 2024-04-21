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

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface File {
  id: string;
  name: string;
  size: number;
  firebaseUrl: string
  createdAt: Date;
}


export function fetchItemsTableColumnDefs(
  setCurrentPath: (path: string) => void,
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<(Folder | File), unknown>[] {
  const baseColumns: ColumnDef<Folder | File, unknown>[] = [
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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
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
        <div className="flex items-center space-x-2 cursor-pointer" onDoubleClick={() => {
          const item = row.original;
          if ('size' in item) {
            if (item.firebaseUrl) {
              window.open(item.firebaseUrl, '_blank');
            }
          } else {
            setCurrentPath(item.id);
          }
        }}>
          {!row.original.hasOwnProperty('size') ? <MdFolder size={15} color='hsl(var(--primary))' /> : <FaFile size={15} color='hsl(var(--primary))' />}
          <span>{row.getValue('name')}</span>
        </div >
      ),

    },
  ];


  baseColumns.push({
    accessorKey: 'size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: info => 'size' in info.row.original ? <div>{formatStorage(info.row.original.size)}</div> : null,
  });


  baseColumns.push({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: info => (
      <div className="flex space-x-2">
        <FolderFileTableRowActions row={info.row} startTransition={startTransition} setCurrentPath={setCurrentPath} />
      </div>
    )
  });


  return baseColumns;
}

export const filterableColumns: DataTableFilterableColumn<Folder | File>[] = [
];

export const searchableColumns: DataTableSearchableColumn<Folder | File>[] = [
  {
    id: 'name',
    title: 'Name',
  },
];

