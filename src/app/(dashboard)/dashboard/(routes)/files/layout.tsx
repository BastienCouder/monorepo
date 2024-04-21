import React from 'react';
import StorageUsage from './_components/analyse-storage-usage';
import { calculateFolderSummary } from '@/server-actions/user/folder-summary-user';
import { currentUser } from '@/lib/authCheck';
import { BillingInfo } from '@/app/(app)/(marketing)/pricing/_components/billing-info';
import { db } from '@/lib/prisma';
import { User } from '@/schemas/db';

interface FilesLayoutProps {
  children?: React.ReactNode;
}

export default async function FilesLayout({ children }: FilesLayoutProps) {
  const summary = await calculateFolderSummary();
  const session = await currentUser()

  const user: User = await db.user.findUnique({ where: { id: session?.id } })

  return (
    <>
      <main
        className={`flex flex-col lg:flex-row min-h-full w-full overflow-hidden p-4 space-y-8`}
      >
        <div className="w-full lg:w-4/6">{children}</div>
        <aside className="w-full lg:w-2/6 lg:pr-10 space-y-6">
          <StorageUsage summary={summary} user={user} />
          <BillingInfo />
        </aside>
      </main>
    </>
  );
};

