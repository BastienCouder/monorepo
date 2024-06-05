import * as React from 'react';
import type { SearchParams } from '@/types';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

import { Metadata } from 'next';
import { DriveTable } from './_components/drive-table';
import { db } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/auth';
import { SettingsTeam } from './_components/settings-team';
import { getUserRoleInTeam } from '@/server/team/get-user-role-team';
import { siteConfig } from '@/config/site';
import { unstable_setRequestLocale } from 'next-intl/server';
import ActionsTeam from './_components/actions-team';

export interface UsersPageProps {
  searchParams: SearchParams;
  params: { teamId: string; locale: string };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Gestion des Utilisateurs - ${siteConfig.name}`,
    description: `Administrez efficacement les utilisateurs de votre plateforme avec notre outil de gestion. Ajoutez, supprimez, ou modifiez les informations des membres pour maintenir votre communauté active et sécurisée.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default async function DriveTeamPage({
  searchParams,
  params,
}: UsersPageProps) {
  const user = await currentUser();
  unstable_setRequestLocale(params.locale);

  const team = await db.team.findUnique({
    where: {
      id: params.teamId,
    },
  });

  if (!team || !user) {
    return;
  }

  const role = await getUserRoleInTeam(team.id, user.id);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4">
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
          <section className="w-full space-y-2">
            {/* <div className="w-full flex justify-between"> */}
            {/* <h1 className="font-bold text-xl first-letter:uppercase">
                {team?.name}
              </h1>
              <ActionsTeam role={role} user={user} team={team} />
            </div> */}
            <DriveTable searchParams={searchParams} team={team} params={params} />
          </section>
        </React.Suspense>
      </div>
    </>
  );
}
