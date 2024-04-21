import React from 'react';
import { DashboardShell } from './_components/dashboard-shell';
import { cookies } from 'next/headers';

import { userInfoTeam } from '@/server-actions/team/user-info-team';
import { SelectionProvider } from './(routes)/ai/(route)/_context/select-item';


interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');
  const defaultLayout =
    layout && layout.value !== 'undefined'
      ? JSON.parse(layout.value)
      : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value !== 'undefined'
      ? JSON.parse(collapsed.value)
      : undefined;
  const teams = await userInfoTeam();

  return (
    <>
      <DashboardShell
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}

      >
        <main className="flex w-full bg-muted" style={{ minHeight: `calc(100vh - 3rem)` }}>
          <SelectionProvider>
            <div className="w-full  px-4">{children}</div>
          </SelectionProvider>
        </main>
      </DashboardShell>
    </>
  );
};

export default DashboardLayout;
