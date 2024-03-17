'use server';

import { db } from '@/lib/prisma';

export async function joinTeamWithKey(
  userId: string,
  teamKey: string
): Promise<string> {
  const team = await db.team.findUnique({
    where: {
      key: teamKey,
    },
  });

  if (!team) {
    throw new Error('Invalid team key. Please check the key and try again.');
  }

  const existingMember = await db.teamMember.findFirst({
    where: {
      teamId: team.id,
      userId: userId,
    },
  });

  if (existingMember) {
    throw new Error('You are already a member of this team.');
  }

  await db.teamMember.create({
    data: {
      teamId: team.id,
      userId: userId,
    },
  });

  return 'You have successfully joined the team.';
}
