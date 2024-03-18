import { currentUser } from '@/lib/authCheck';
import { getUserTeams } from '@/server-actions/team/get-user-team';
import React from 'react';
import ActionsDrive from './_components/actions-drive';
import CreateFolderModal from '../../../../../components/modal/create-modal';
import { Team } from '@/schemas/db';

export default async function drive() {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const teams: Team[] = await getUserTeams(user.id);

  return (
    <div>
      <ActionsDrive teams={teams} />
    </div>
  );
}
