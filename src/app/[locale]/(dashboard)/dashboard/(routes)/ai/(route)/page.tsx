import * as React from 'react';
import type { SearchParams } from '@/types';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { FoldersFilesTable } from './_components/folders-files-table';
import { getTranslations } from 'next-intl/server';
import { currentUser } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { User } from '@/models/db';

export interface AIPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: `${t('ai-title')} - ${siteConfig.name}`,
    description: `${t('ai-description')}`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default async function AIPage({ searchParams }: AIPageProps) {
  const user: User = await currentUser();

  const userData: User = await db.user.findUnique({ where: { id: user?.id } });

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

          <FoldersFilesTable searchParams={searchParams} user={userData} />
        </React.Suspense>
      </div>
    </>
  );
}

const generateFakeData = (type: any, itemCount: any) => {
  const data = [];

  for (let i = 0; i < itemCount; i++) {
    if (type === 'folder') {
      data.push({
        id: `folder - ${i} `,
        name: `Dossier ${i + 1} `,
        createdAt: new Date().toISOString(),
      });
    } else if (type === 'file') {
      data.push({
        id: `file - ${i} `,
        name: `Fichier ${i + 1} `,
        size: Math.floor(Math.random() * 1024 * 1024), // Taille aléatoire en octets
        createdAt: new Date().toISOString(),
      });
    }
  }

  return data;
};
