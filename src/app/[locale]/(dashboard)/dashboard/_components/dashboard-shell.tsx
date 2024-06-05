'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { Nav } from './nav';

import { MobileNav } from './mobile-nav';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { UserAccountNav } from '@/components/layout/user-account-nav';
import Link from 'next/link';
import { useDashboardConfig } from '@/config/dashboard';
import Logo from './logo';
import { Team } from '@/models/db';
import { CreateTeamForm } from '../(routes)/drive/_components/create-team-form';
import { useRouteParam } from '@/providers/route-params-provider';
import { useSocket } from '@/providers/socket-provider';
import { LangSwitcher } from '@/components/shared/language-switcher';
import { Icons } from '@/components/shared/icons';
import CreateModal from '../(routes)/users/_components/create-modal';

interface IDashboardShell {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
  teams: Team[];
}

type User = {
  id: string;
  name: string;
  teamIds: string[];
};

export function DashboardShell({
  defaultLayout = [265, 440 + 655],
  defaultCollapsed = false,
  navCollapsedSize = 4,
  children,
  teams,
}: IDashboardShell) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const user = useCurrentUser();
  const { setParam } = useRouteParam();
  const config = useDashboardConfig();
  const sidebarNav = config.sidebarNav;

  const { connectedUsers } = useSocket();

  // Filtrer les utilisateurs en ligne par équipe
  // const filteredUsers = onlineUsers.filter(user => user.teamIds.includes(param!));
  // setUsersInTeam(filteredUsers);
  console.log('users connected :', connectedUsers);


  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="min-h-full items-stretch bg-muted  fixed"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={12}
          maxSize={15}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed && ' transition-all duration-300 ease-in-out',
            'hidden lg:block'
          )}
        >
          <Logo isCollapsed={isCollapsed} />
          <Nav isCollapsed={isCollapsed} links={sidebarNav} />
          <div className="px-4">
            <Separator />
          </div>
          <div className="py-4 px-8 space-y-4">
            <div className="flex items-center">
              <h2 className="font-semibold text-sm">Users</h2>


            </div>
            <ul>
              {connectedUsers.map(user => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>
          <div className="py-4 px-8 space-y-4">
            <div className="flex items-center">
              <h2 className="font-semibold text-sm">Group</h2>

            </div>
            <ul className="flex flex-col gap-2">
              {teams.map((team) => (
                <li key={team.id} className="group">
                  <Link href={`/dashboard/drive/${team.id}`}>
                    <div className="flex gap-4 items-center text-sm cursor-pointer">
                      <span>#</span>{' '}
                      <p className="first-letter:uppercase text-muted-foreground group-hover:text-foreground">
                        {team.name}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className={cn('h-full overflow-y-auto')}>
            <div
              className={cn(
                'sticky top-0 z-10',
                'h-[52px]',
                'bg-muted/90 backdrop-blur supports-[backdrop-filter]:bg-muted/90',
                'flex items-center justify-between px-4'
              )}
            >
              <div className="block lg:hidden">
                <MobileNav />
              </div>
              <div className="block lg:hidden">
                {/* <Logo isCollapsed={true} /> */}
              </div>
              <div className="flex items-center space-x-4 lg:ml-auto">
                <ModeToggle />
                <LangSwitcher />
                <UserAccountNav
                  user={{
                    name: user?.name ?? 'N/A',
                    image: user?.image ?? 'N/A',
                    email: user?.email ?? 'N/A',
                  }}
                />
              </div>
            </div>
            <div className={cn('overflow-y-auto')}>{children}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
