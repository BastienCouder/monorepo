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

interface IDashboardShell {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  defaultLayout = [265, 440 + 655],
  defaultCollapsed = false,
  navCollapsedSize = 4,
  children,
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
        className="min-h-full items-stretch bg-muted"
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
            isCollapsed &&
            ' transition-all duration-300 ease-in-out',
            'hidden lg:block'
          )}
        >
          {/* <Logo isCollapsed={isCollapsed} /> */}
          <Nav isCollapsed={isCollapsed} links={sidebarNav} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className={cn('h-full overflow-y-auto')}>
            <div
              className={cn(
                'sticky top-0 z-10',
                'h-[52px]',
                'bg-muted backdrop-blur supports-[backdrop-filter]:bg-muted',
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
                <Link href={'/dashboard/settings'}>
                  <Button variant={'ghost'} className='py-0 px-1'>
                    <Icons.settings size={20} />
                  </Button>
                </Link>
                <UserAccountNav
                  user={{
                    name: user?.name ?? 'N/A',
                    image: user?.image ?? 'N/A',
                    email: user?.email ?? 'N/A',
                  }}
                />
              </div>
            </div >
            <div className={cn('overflow-y-auto')}>{children}</div>
          </div >
        </ResizablePanel >
      </ResizablePanelGroup >
    </TooltipProvider >
  );
}
