'use client';

import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { formatStorage } from '@/lib/utils';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from '@/types';
import FolderFileTableRowActions from './drive-table-row-actions';
import { MdFolder } from 'react-icons/md';
import { FaFile } from 'react-icons/fa6';
import { useSelection } from '@/providers/select-item-provider';

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

const fetchItemsTableColumnDefs = (
  setCurrentPath: (path: { id: string; name: string }) => void,
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<Folder | File, unknown>[] => {

  const { selectedItems, toggleItem, clearSelection } = useSelection();
  console.log(selectedItems);

  const baseColumns: ColumnDef<Folder | File, unknown>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table.getRowModel().rows.map(row => row.original.id);
              allIds.forEach(id => toggleItem(id));
            } else {
              clearSelection();
            }
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Checkbox
            checked={row.original.id in selectedItems}
            onCheckedChange={() => toggleItem(row.original.id)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
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
              setCurrentPath({ id: item.id, name: item.name });
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

export default fetchItemsTableColumnDefs;
