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
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import Link from 'next/link';
import { useDashboardConfig } from '@/config/dashboard';
import LanguageSwitcher from '@/components/shared/language-switcher';
import Logo from './logo';
import { Team } from '@/schemas/db';
import CreateModal from '@/components/modal/create-modal';
import { CreateTeamForm } from '../(routes)/drive/_components/create-team-form';
import { PlusCircle } from 'lucide-react';

interface IDashboardShell {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
  teams: Team[];
}

export function DashboardShell({
  defaultLayout = [265, 440 + 655],
  defaultCollapsed = false,
  navCollapsedSize = 4,
  children,
  teams,
}: IDashboardShell) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const user = useCurrentUser();
  const config = useDashboardConfig();
  const sidebarNav = config.sidebarNav;

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
              <h2 className="font-semibold text-sm">Group</h2>
              <CreateModal
                title={<PlusCircle size={15} className="mt-[1px]" />}
                dialogTitle="Create Team"
                Component={CreateTeamForm}
                variant={'ghost'}
              />
            </div>
            <ul className="flex flex-col gap-2">
              {teams.map((team) => (
                <li key={team.id} className="group">
                  <Link href={`/dashboard/drive/${team.slug}`}>
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
              <div className="flex items-center space-x-8 lg:ml-auto">
                <div className="flex items-center space-x-2">
                  <LanguageSwitcher />
                  <ModeToggle />
                  <Link href={'/help'}>
                    <Button variant={'ghost'} className="p-0">
                      <Icons.help size={17} />
                    </Button>
                  </Link>
                  <Link href={'/dashboard/settings'}>
                    <Button variant={'ghost'} className="p-0">
                      <Icons.settings size={17} />
                    </Button>
                  </Link>
                </div>
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
