import * as React from 'react';
import type { SearchParams } from '@/types';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

import { UsersTable } from './_components/users-table';
import { getUsers } from './_lib/queries';
import CreateModal from './_components/create-modal';

export interface UsersPageProps {
  searchParams: SearchParams;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  const usersPromise = getUsers(searchParams);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4">
        <div className="flex flex-row flex-wrap items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <CreateModal />
        </div>
        <React.Suspense
          fallback={
            <DataTableSkeleton columnCount={4} filterableColumnCount={2} />
          }
        >
          {/**
           * The `UsersTable` component is used to render the `DataTable` component within it.
           * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
           * By encapsulating the `DataTable` component within the `usertable` component, we can ensure that the necessary logic and state management is handled correctly.
           */}
          <UsersTable usersPromise={usersPromise} />
        </React.Suspense>
      </div>
    </>
  );
}
