import * as React from 'react';
import type { SearchParams } from '@/types';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Metadata } from 'next';
import DriveTable from './_components/drive-table';
import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/auth';
import { siteConfig } from '@/config/site';
import { getTeamMembers } from '@/server/team/get-team-members';
import Error from './error';
import { getTranslations } from 'next-intl/server';
import { getTreeTeam } from '@/server/drive/get-folders-files-team';

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
  const t = await getTranslations('DriveTeamPage');
  const user = await currentUser();
  console.log(user);

  if (!user) {
    return <Error message={t('no_user_found')} />;
  }

  const team = await db.team.findUnique({ where: { id: params.teamId } });
  if (!team) {
    return <Error message={t('team_not_found')} />;
  }
  const tree = await getTreeTeam(team.id)
  console.log(JSON.stringify(tree));

  const res = await getTeamMembers(team.id, user.id);
  if (res.error) {
    return <Error message={res.error} />;
  }

  if (
    !res.userDetails ||
    !res.userDetails.some((member) => member.user.id === user.id)
  ) {
    return <Error message={t('not_a_team_member')} />;
  }

  return (
    <React.Suspense
      fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
    >
      <section className="w-full">
        <DriveTable
          searchParams={searchParams}
          team={team}
          params={params}
          teamMembers={res.userDetails}
          tree={tree}
        />
      </section>
    </React.Suspense>
  );
}
