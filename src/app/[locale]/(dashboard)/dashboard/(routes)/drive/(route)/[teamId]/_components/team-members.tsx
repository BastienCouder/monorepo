'use client';

import { GetKeyTeam } from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/get-key-team';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Team, User } from '@/models/db';
import { useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerClose,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useModal } from '@/hooks/use-modal-store';

interface TeamMemberProps {
    team: Team;
    user: User;
    teamMembers: { user: User; role: string }[];
    isDesktop?: boolean;
    children?: React.ReactNode;
}

async function updateRole(teamId: string, userId: string, newRole: string) {
    const response = await fetch('/api/update-role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, userId, newRole }),
    });
    const data = await response.json();
    return data;
}

export function TeamMember({
    children,
    team,
    user,
    teamMembers,
    isDesktop,
}: TeamMemberProps) {
    const role = useCurrentRole();
    const [members, setMembers] = useState(teamMembers);
    const { isOpen: modalOpen, onClose, type } = useModal();
    const [isOpen, setIsOpen] = useState(
        modalOpen && type === 'create-folder-team'
    );

    const handleRoleChange = async (userId: string, newRole: string) => {
        const res = await updateRole(team.id, userId, newRole);
        if (res.success) {
            setMembers((prevMembers) =>
                prevMembers.map((member) =>
                    member.user.id === userId ? { ...member, role: newRole } : member
                )
            );
        } else {
            console.error(res.error);
        }
    };

    const content = (
        <>
            {(role === 'ADMINISTRATOR' || role === 'OWNER' || role === 'MEMBER') && (
                <>
                    <div className="flex flex-col space-y-2">
                        <GetKeyTeam team={team} user={user} />
                    </div>
                    <Separator className="my-4" />
                </>
            )}
            <div className="space-y-4">
                <h4 className="text-sm font-medium">People with access</h4>
                <div className="max-h-[200px] overflow-y-auto pr-4 scrollbar-custom-small">
                    <div className="grid gap-6">
                        {members.length > 0 &&
                            members.map((member) => {
                                const { user: memberUser, role: memberRole } = member;
                                const firstNameInitial = memberUser.firstName
                                    ? memberUser.firstName[0]
                                    : '';
                                const lastNameInitial = memberUser.lastName
                                    ? memberUser.lastName[0]
                                    : '';
                                return (
                                    <div
                                        key={memberUser.id}
                                        className="flex items-center justify-between space-x-4"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="size-8">
                                                <AvatarImage
                                                    src={memberUser.image || '/default-avatar.png'}
                                                />
                                                <AvatarFallback className="text-sm">{`${firstNameInitial}${lastNameInitial}`}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {`${memberUser.firstName || ''} ${memberUser.lastName || ''}`}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {memberUser.email}
                                                </p>
                                            </div>
                                        </div>
                                        {memberUser.id !== user.id ? (
                                            <Select
                                                defaultValue={memberRole}
                                                onValueChange={(newRole) =>
                                                    handleRoleChange(memberUser.id, newRole)
                                                }
                                            >
                                                <SelectTrigger className="ml-auto w-[110px]">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="OWNER">Can edit</SelectItem>
                                                    <SelectItem value="MEMBER">Can view</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="text-xs">You are the owner of this team</p>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );

    if (isDesktop) {
        return <>{content}</>;
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent className="space-y-4 p-4 pt-0">{content}</DrawerContent>
            </Drawer>
        </>
    );
}
