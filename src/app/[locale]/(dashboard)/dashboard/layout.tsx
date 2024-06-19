import React from 'react';
import { DashboardShell } from './_components/dashboard-shell';
import { cookies } from 'next/headers';
import { SelectionProvider } from '../../../../providers/select-item-provider';
import { getUserTeams } from '@/server/user/get-user-team';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Team } from '@/models/db';
import { RouteParamProvider } from '@/providers/route-params-provider';
import { NextIntlClientProvider } from 'next-intl';
import { pick } from 'lodash';
import { getMessages } from 'next-intl/server';

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
  // const defaultCollapsed =
  //   collapsed && collapsed.value !== 'undefined'
  //     ? JSON.parse(collapsed.value)
  //     : undefined;

  const user = await currentUser();
  if (!user) {
    redirect('/');
  }
  const teams: Team[] = await getUserTeams(user.id);
  const messages = await getMessages();

  return (
    <>
      <RouteParamProvider>
        <NextIntlClientProvider messages={pick(messages, 'navbar')}>
          <DashboardShell
            defaultLayout={defaultLayout}
            defaultCollapsed={true}
            teams={teams}
          >
            <main
              className="flex w-full overflow-y-auto"
              style={{ minHeight: `calc(100vh - 3.5rem)` }}
            >
              {/* <ActiveStatus /> */}
              <SelectionProvider>
                <div className="w-full px-4">{children}</div>
              </SelectionProvider>
            </main>
          </DashboardShell>
        </NextIntlClientProvider>
      </RouteParamProvider>
    </>
  );
};

export default DashboardLayout;
