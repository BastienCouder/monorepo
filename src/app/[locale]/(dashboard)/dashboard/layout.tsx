import React from 'react';
import { DashboardShell } from './_components/dashboard-shell';
import { cookies } from 'next/headers';

import { userInfoTeam } from '@/server-actions/team/user-info-team';
import { SelectionProvider } from './(routes)/ai/(route)/_context/select-item';
import { getUserTeams } from '@/server-actions/user/get-user-team';
import { currentUser } from '@/lib/authCheck';
import { redirect } from 'next/navigation';
import { Team } from '@/schemas/db';
import ActiveStatus from '@/components/shared/active-status';

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

  const user = await currentUser();
  if (!user) {
    redirect('/');
  }
  const teams: Team[] = await getUserTeams(user.id);

  return (
    <>
      <DashboardShell
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        teams={teams}
      >
        <main
          className="flex w-full bg-muted overflow-y-auto"
          style={{ minHeight: `calc(100vh - 3.5rem)` }}
        >
          {/* <ActiveStatus /> */}
          <SelectionProvider>
            <div className="w-full  px-4">{children}</div>
          </SelectionProvider>
        </main>
      </DashboardShell>
    </>
  );
};

export default DashboardLayout;
