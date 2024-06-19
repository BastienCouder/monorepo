'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Nav } from './nav';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ModeToggle } from '@/components/layout/mode-toggle';
import Link from 'next/link';
import { useDashboardConfig } from '@/config/dashboard';
import Logo from './logo';
import { Team } from '@/models/db';
import { LangSwitcher } from '@/components/shared/language-switcher';
import { Icons } from '@/components/shared/icons';
import { useModal } from '@/hooks/use-modal-store';
import { CreateGroupModal } from '@/components/modal/create-group-modal';
import {
  Button,
  Card,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator
} from '@/components/ui';
import { Container, Text } from '@/components/container';
import { UserAvatar } from '@/components/shared/user-avatar';
import { LogoutButton } from '@/app/[locale]/(auth)/_components';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { UserAccountNav } from '@/components/layout/user-account-nav';

interface IDashboardShell {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
  teams: Team[];
}

export const DashboardShell = ({
  defaultLayout = [265, 440 + 655],
  defaultCollapsed = true,
  navCollapsedSize = 4,
  children,
  teams,
}: IDashboardShell) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const user = useCurrentUser();
  const config = useDashboardConfig();
  const sidebarNav = config.sidebarNav;
  const { onOpen } = useModal();

  // Filtrer les utilisateurs en ligne par équipe
  // const filteredUsers = onlineUsers.filter(user => user.teamIds.includes(param!));
  // setUsersInTeam(filteredUsers);
  const handleCreateGroup = (userId: string, storageUsed: number, storageLimit: number) => {
    onOpen('create-group', { userId, storageUsed, storageLimit });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="min-h-full items-stretch fixed"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={14}
          maxSize={18}
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
            'hidden lg:block p-4 space-y-4'
          )}
        >
          {isCollapsed ? (
            <>
              <Card className="bg-card p-2 justify-center items-center">
                <Logo isCollapsed={isCollapsed} />
                <Nav isCollapsed={isCollapsed} links={sidebarNav} />
              </Card>
              <Card className="bg-card p-2 flex flex-col gap-2 justify-center items-center">
                <ModeToggle />
                <LangSwitcher isCollapsed={isCollapsed} />
                {/* <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Container.Div
                      className={cn(
                        buttonVariants({
                          variant:
                            'ghost',
                          size: 'icon',
                        }),
                        'h-9 w-9',
                      )}
                    >
                      <Icons.laptop className="h-4 w-4" />
                      <span className="sr-only">Group</span>
                    </Container.Div >
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    <span className="ml-auto text-muted-foreground">
                      hello
                    </span>
                  </TooltipContent>
                </Tooltip> */}

              </Card>
              <Card className='p-2 flex justify-center items-center'>
                <UserAccountNav
                  isCollapsed={isCollapsed}
                  user={{
                    name: user?.name ?? 'N/A',
                    image: user?.image ?? 'N/A',
                    email: user?.email ?? 'N/A',
                  }} />
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-card p-2 md:h-full flex flex-col gap-4">
                <Logo isCollapsed={isCollapsed} />
                <div className="px-4">
                  <Separator />
                </div>
                <Nav isCollapsed={isCollapsed} links={sidebarNav} />
                <div className="px-4">
                  <Separator />
                </div>
                <div className="flex-1 px-8 space-y-4">
                  {user && (
                    <CreateGroupModal>
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => handleCreateGroup(user.id, user.storageUsed, user.storageLimit)}
                      >
                        <h2 className="font-semibold text-sm">Group</h2>
                        <Icons.plus size={17} />
                      </div>
                    </CreateGroupModal>
                  )}
                  <div className="max-h-[110px] pr-4 overflow-y-auto srcolmbar-custom-small">
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
                </div>
                <Container.Div className='w-full flex-col flex items-center mb-8 gap-4 justify-center'>
                  <UserAvatar user={{
                    name: user?.name ?? 'N/A',
                    image: user?.image ?? 'N/A',
                    email: user?.email ?? 'N/A',

                  }} />
                  <Container.Div className="flex flex-col items-center gap-2">
                    <Text.H4>
                      {user?.name ?? 'N/A'}
                    </Text.H4>
                    <Text.Small>
                      {user?.email ?? 'N/A'}
                    </Text.Small>
                  </Container.Div>
                  <Container.Div className='w-full justify-center items-center flex gap-4'>
                    <LangSwitcher isCollapsed={isCollapsed} />

                    <LogoutButton>
                      <Container.Div className="flex items-center gap-x-2.5">
                        <LogOut className="size-4" />
                        <Text.Small>Logout</Text.Small>
                      </Container.Div>
                    </LogoutButton>
                  </Container.Div>
                </Container.Div>
              </Card>
            </>
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {/* <div className={cn('h-full overflow-y-auto')}>
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
                <Logo isCollapsed={true} /> 
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
            </div> */}
          <div className={cn('overflow-y-auto')}>{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
