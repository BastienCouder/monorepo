'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';

import { type getUsers } from '../_lib/queries';
import {
  deleteSelectedRows,
  UsersTableFloatingBarContent,
} from './users-table-actions';
import {
  fetchUsersTableColumnDefs,
  filterableColumns,
  searchableColumns,
} from './users-table-column-def';
import { User } from '@prisma/client';

interface UsersTableProps {
  usersPromise: ReturnType<typeof getUsers>;
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(usersPromise);

  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<User, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      floatingBarContent={UsersTableFloatingBarContent(dataTable)}
      deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  );
}
