import React from 'react';
import StorageUsage from './_components/analyse-storage-usage';
import { calculateFolderSummary } from '@/server-actions/user/folder-summary-user';
import { currentUser } from '@/lib/authCheck';

interface FilesLayoutProps {
  children?: React.ReactNode;
}

const FilesLayout = async ({ children }: FilesLayoutProps) => {
  const summary = await calculateFolderSummary();

  return (
    <>
      <main
        className={`flex flex-col lg:flex-row min-h-full w-full overflow-hidden p-4 space-y-8`}
      >
        <div className="w-full lg:w-4/6">{children}</div>
        <aside className="w-full lg:w-2/6 lg:pr-10 space-y-6">
          <StorageUsage summary={summary} />
        </aside>
      </main>
    </>
  );
};

export default FilesLayout;
