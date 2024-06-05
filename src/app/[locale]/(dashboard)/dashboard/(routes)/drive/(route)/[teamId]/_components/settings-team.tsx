'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Mail } from 'lucide-react';
import { Team } from '@/models/db';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { deleteTeam } from '@/server/team/delete-team';
import { ConfirmModal } from '@/components/modal/confirm-modal';

interface SettingsTeamProps extends React.HTMLAttributes<HTMLDivElement> {
  team: Team;
  userId: string;
}

export function SettingsTeam({ team, userId }: SettingsTeamProps) {
  const handleDeleteTeam = async () => {
    await deleteTeam(team.id, userId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Settings team</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <div className="flex items-center space-x-2.5">
            <LayoutDashboard className="size-4" />
            <p className="text-sm">Rename team</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="flex items-center space-x-2.5">
            <Mail className="size-4" />
            <p className="text-sm">Invite</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="flex items-center space-x-2.5">
            <ConfirmModal onConfirm={handleDeleteTeam}>
              <div className="flex items-center space-x-2.5">
                <Icons.trash className="size-4" />
                <p className="text-sm">Delete</p>
              </div>
            </ConfirmModal>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
