import * as React from 'react';
import type { SearchParams } from '@/types';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

import { UsersTable } from './_components/users-table';
import { getUsers } from './_lib/queries';
import CreateModal from './_components/create-modal';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface UsersPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Gestion des Utilisateurs - ${siteConfig.name}`,
    description: `Administrez efficacement les utilisateurs de votre plateforme avec notre outil de gestion. Ajoutez, supprimez, ou modifiez les informations des membres pour maintenir votre communauté active et sécurisée.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  const usersPromise = getUsers(searchParams);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4">
        <div className="flex flex-row flex-wrap items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Utilisateurs</h2>
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
