import * as React from 'react';
import type { SearchParams } from '@/types';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';


import { Metadata } from 'next';
import { DriveTable } from './_components/drive-table';
import { db } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/authCheck';
import { getTeamMembers } from '@/server-actions/team/get-team-members';
import { SettingsTeam } from './_components/settings-team';
import { getUserRoleInTeam } from '@/server-actions/team/get-user-role-team';
import { siteConfig } from '@/config/site';

export interface UsersPageProps {
  searchParams: SearchParams;
  params: { slug: string, locale: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Gestion des Utilisateurs - ${siteConfig.name}`,
    description: `Administrez efficacement les utilisateurs de votre plateforme avec notre outil de gestion. Ajoutez, supprimez, ou modifiez les informations des membres pour maintenir votre communauté active et sécurisée.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default async function UsersPage({ searchParams, params }: UsersPageProps) {
  const user = await currentUser()

  const team = await db.team.findUnique({
    where: {
      slug: params.slug,
    },
  });
  if (!team || !user) {
    return
  }
  const userTeam = await getTeamMembers(team.id)

  const role = await getUserRoleInTeam(team.id, user.id)
  console.log(role);

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
          <section className="w-full space-y-2 lg:pr-4">
            <div className="w-full flex justify-between">
              <h1 className="font-bold text-xl first-letter:uppercase">
                {team?.name}
              </h1>
              <div className='flex gap-4'>
                {/* {userTeam.map((user, index) => (
                  <img
                    key={index}
                    src={user?.image!}
                    alt={`Avatar ${index + 1}`}
                    className="w-10 h-10 border-2 border-white rounded-full object-cover shadow"
                    style={{ zIndex: userTeam.length - index }}
                  />
                ))} */}
                {(role === 'ADMINISTRATOR' || role === 'OWNER') && (
                  <SettingsTeam team={team} userId={user.id} />
                )}
                <Link href={'/dashboard/drive'}>
                  <Button>Back</Button>
                </Link>
              </div>
            </div>
            <DriveTable searchParams={searchParams} team={team} userTeam={userTeam} />
          </section>
        </React.Suspense>
      </div>
    </>
  );
}
