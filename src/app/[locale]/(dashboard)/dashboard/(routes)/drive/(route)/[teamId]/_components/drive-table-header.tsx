'use client';

import { useModal } from '@/hooks/use-modal-store';
import { RenameTeamModal } from '@/components/modal/rename-team-modal';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/shared/icons';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentRole } from '@/hooks/use-current-role';
import { DeleteTeamModal } from '@/components/modal/delete-team-modal';
import React, { useEffect, useState } from 'react';
import { Team, User } from '@/models/db';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { TeamMember } from './team-members';
import {
    buttonVariants,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Card,
    BreadcrumbEllipsis,
} from '@/components/ui/';
import { Text } from '@/components/container';
import { ChevronDown } from 'lucide-react';
import Tree from './tree';

interface DriveTableHeaderProps {
    user: User;
    team: Team;
    pathHistory: string[];
    teamMembers: User[];
    data: any;
}

const fakeTeamMembers = [
    {
        user: {
            id: 'user2',
            firstName: 'Olivia',
            lastName: 'Martin',
            email: 'olivia.martin@example.com',
            avatarUrl: '/avatars/02.png',
        } as User,
        role: 'MEMBER',
    },
    {
        user: {
            id: 'user3',
            firstName: 'Isabella',
            lastName: 'Nguyen',
            email: 'isabella.nguyen@example.com',
            avatarUrl: '/avatars/03.png',
        } as User,
        role: 'MEMBER',
    },
    {
        user: {
            id: 'user5',
            firstName: 'Sofia',
            lastName: 'Davis',
            email: 'sofia.davis@example.com',
            avatarUrl: '/avatars/04.png',
        } as User,
        role: 'MEMBER',
    },
    {
        user: {
            id: 'user6',
            firstName: 'Sofia',
            lastName: 'Davis',
            email: 'sofia.davis@example.com',
            avatarUrl: '/avatars/04.png',
        } as User,
        role: 'MEMBER',
    },
    {
        user: {
            id: 'user7',
            firstName: 'Sofia',
            lastName: 'Davis',
            email: 'sofia.davis@example.com',
            avatarUrl: '/avatars/04.png',
        } as User,
        role: 'MEMBER',
    },
    {
        user: {
            id: 'user4',
            firstName: 'Sofia',
            lastName: 'Davis',
            email: 'sofia.davis@example.com',
            avatarUrl: '/avatars/04.png',
        } as User,
        role: 'MEMBER',
    },
];

const DriveTableHeader = ({
    user,
    team,
    pathHistory,
    teamMembers,
    data
}: DriveTableHeaderProps) => {
    const { onOpen } = useModal();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const role = useCurrentRole();

    const [pathHistoryLength, setPathHistoryLength] = useState(pathHistory.length);

    useEffect(() => {
        setPathHistoryLength(pathHistory.length);
    }, [pathHistory]);

    const renderBreadcrumb = () => {
        const shouldShowEllipsis = pathHistoryLength > 1;

        return (
            <Breadcrumb>
                <BreadcrumbList>
                    {shouldShowEllipsis && (
                        <React.Fragment>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className='p-2'>
                                        <div className="max-h-[100px] pr-2 overflow-y-auto scrollbar-custom-small">
                                            {pathHistory.slice(0, -1).map((path, index) => (
                                                <DropdownMenuItem key={index} className='cursor-default text-xs'>{path}</DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                        </React.Fragment>
                    )}
                    {pathHistoryLength > 0 && (
                        <React.Fragment>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{pathHistory[pathHistoryLength - 1]}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </React.Fragment>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        );
    };

    const handleAddUserToTeam = (userId: string) => {
        onOpen('add-user-to-team', { userId });
    };

    const handleRenameTeam = (
        userId: string,
        teamId: string,
        teamName: string
    ) => {
        onOpen('rename-team', { userId, teamId, teamName });
    };

    const handleDeleteTeam = (userId: string, teamId: string) => {
        onOpen('delete-team', { userId, teamId });
    };


    return (
        <div className="w-full flex justify-between">
            <Card className="px-4 pt-3 flex items-center gap-2 rounded-b-none rounded-tr-none md:rounded-tr-md border-none shadow-none transition-all">
                <Text.H1 className="first-letter:uppercase">{team?.name}</Text.H1>
                {pathHistory.length > 0 && <div>{renderBreadcrumb()}</div>}
            </Card>
            <div className="relative flex-1 bg-card">
                <div className="z-50 flex-1 h-full md:bg-background md:rounded-t-none rounded-md" />
            </div>
            <Card className="pt-3 px-4 flex rounded-tl-none md:rounded-tl-md rounded-b-none border-none shadow-none">
                {isDesktop ? (
                    <div className="flex gap-2">
                        {user && (role === 'OWNER' || 'ADMINISTRATOR') && (
                            <>
                                <Popover>
                                    <PopoverTrigger
                                        className={`px-2 py-0 gap-2 opacity-80 ${cn(buttonVariants({ variant: 'none', size: 'sm' }))}`}
                                    >
                                        Membre de la team <ChevronDown size={10} />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[500px]">
                                        <TeamMember
                                            isDesktop={isDesktop}
                                            team={team}
                                            user={user}
                                            teamMembers={fakeTeamMembers}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger
                                        className={`px-2 py-0 gap-2 opacity-80 ${cn(buttonVariants({ variant: 'none', size: 'sm' }))}`}
                                    >
                                        Voir l'arbre <ChevronDown size={10} />{' '}
                                    </PopoverTrigger>
                                    <PopoverContent className="min-w-[300px]">
                                        <Tree data={data} />
                                    </PopoverContent>
                                </Popover>
                                {/* <AddUserToTeamModal>
                                    <Button
                                        className='px-2 py-0 gap-2'
                                        variant={'none'}
                                        size={'sm'}
                                        onClick={() => handleAddUserToTeam(user.id)}
                                    >
                                        Ajouter Users via Email
                                    </Button> */}
                                {/* </AddUserToTeamModal> */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className={cn(
                                            buttonVariants({ variant: 'default', size: 'sm' })
                                        )}
                                    >
                                        Settings Team
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="space-y-1">
                                        <DropdownMenuItem asChild>
                                            {user && (
                                                <>
                                                    <RenameTeamModal>
                                                        <Text.Small
                                                            className="flex items-center gap-x-2.5 py-1 px-2 text-sm rounded-sm cursor-pointer hover:bg-muted"
                                                            onClick={() =>
                                                                handleRenameTeam(user.id, team.id, team.name)
                                                            }
                                                        >
                                                            <Icons.edit /> RenameTeam
                                                        </Text.Small>
                                                    </RenameTeamModal>
                                                    <DeleteTeamModal>
                                                        <Text.Small
                                                            className="flex items-center gap-x-2.5 py-1 px-2 text-sm rounded-sm cursor-pointer hover:bg-muted"
                                                            onClick={() => handleDeleteTeam(user.id, team.id)}
                                                        >
                                                            <Icons.trash size={14} /> Delete Team
                                                        </Text.Small>
                                                    </DeleteTeamModal>
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(buttonVariants({ variant: 'outline' }))}
                        >
                            Settings Team
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="space-y-2 p-2">
                            <DropdownMenuItem asChild>
                                {user && (
                                    <TeamMember
                                        isDesktop={!isDesktop}
                                        team={team}
                                        user={user}
                                        teamMembers={fakeTeamMembers}
                                    >
                                        <div
                                            className="flex items-center space-x-2.5 text-sm"
                                            onClick={() => handleAddUserToTeam(user.id)}
                                        >
                                            Members
                                        </div>
                                    </TeamMember>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                {/* <AddUserToTeamModal>
                                    <Button
                                        className="px-2 py-0 gap-2"
                                        variant={'outline'}
                                        size={'sm'}
                                        onClick={() => handleAddUserToTeam(user.id)}
                                    >
                                        <Icons.mail size={17} /> Ajouter Users via Email
                                    </Button>
                                </AddUserToTeamModal> */}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                {user && (
                                    <RenameTeamModal>
                                        <div
                                            className="flex items-center space-x-2.5 text-sm"
                                            onClick={() =>
                                                handleRenameTeam(user.id, team.id, team.name)
                                            }
                                        >
                                            RenameTeam
                                        </div>
                                    </RenameTeamModal>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </Card>
        </div>
    );
}

export default DriveTableHeader