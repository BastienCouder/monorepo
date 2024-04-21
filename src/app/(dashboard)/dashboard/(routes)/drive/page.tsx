import { currentUser } from '@/lib/authCheck';

import React from 'react';
import ActionsDrive from './_components/actions-drive';
import { Team } from '@/schemas/db';
import { getUserTeams } from '@/server-actions/user/get-user-team';

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
