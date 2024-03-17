import React from 'react';
import { DashboardShell } from './_components/dashboard-shell';
import { cookies } from 'next/headers';
import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';
import { userInfoTeam } from '@/server-actions/user-info-team';
import TeamSwitcher from './_components/team-switcher';

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
        teams={teams}
      >
        <main className={`flex min-h-screen w-full bg-muted`}>
          <div className="w-full  px-4">{children}</div>
        </main>
      </DashboardShell>
    </>
  );
};

export default DashboardLayout;
