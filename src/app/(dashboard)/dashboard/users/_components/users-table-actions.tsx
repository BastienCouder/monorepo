import * as React from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { CheckCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import { SelectTrigger } from '@radix-ui/react-select';
import { type Table } from '@tanstack/react-table';
import { toast } from 'sonner';

import { catchError } from '@/lib/catch-error';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';

import { deleteUser, updateUserRole } from '../_lib/actions';
import { User, UserRole } from '@prisma/client';
import { enumToKeyValueArray } from '@/lib/helper';

export function deleteSelectedRows(
  table: Table<User>,
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
) {
  event?.preventDefault();
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: User;
  }[];

  noStore();
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        deleteUser({
          id: row.original.id,
        })
      )
    ),
    {
      loading: 'Deleting...',
      success: () => {
        return 'Users deleted successfully.';
      },
      error: (err: unknown) => {
        return catchError(err);
      },
    }
  );
}

export function updateUsersRole(table: Table<User>, status: string) {
  const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
    original: User;
  }[];

  noStore();
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        updateUserRole({
          id: row.original.id,
          role: status as User['role'],
        })
      )
    ),
    {
      loading: 'Updating...',
      success: () => {
        return 'Users updated successfully.';
      },
      error: (err: unknown) => {
        return catchError(err);
      },
    }
  );
}

export function UsersTableFloatingBarContent(table: Table<User>) {
  return (
    <div className="justify-between gap-2 align-middle">
      <Select onValueChange={(value) => updateUsersRole(table, value)}>
        <SelectTrigger asChild>
          <Button
            aria-label="Update role for selected rows"
            title="Update Role"
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            <CheckCircledIcon className="size-4" aria-hidden="true" />
          </Button>
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {enumToKeyValueArray(UserRole).map((data) => (
              <SelectItem
                key={data.value}
                value={data.value}
                className="capitalize"
              >
                {data.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        title="Delete"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          table.toggleAllPageRowsSelected(false);
          deleteSelectedRows?.(table, event);
        }}
      >
        <TrashIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
