'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';

interface JoinTeamWithKeyResponse {
  success?: string;
  error?: string;
}

export async function joinTeamWithKey(
  userId: string,
  teamKey: string
): Promise<JoinTeamWithKeyResponse> {
  const user = await currentUser();

  if (!user) {
    return {
      error: 'You are not authorized to perform this action.',
    };
  }

  if (user.id !== userId && user.role !== 'OWNER') {
    return {
      error:
        'You do not have the necessary permissions to perform this action.',
    };
  }

  const team = await db.team.findUnique({
    where: {
      key: teamKey,
    },
  });

  if (!team) {
    return {
      error: 'Invalid team key. Please check the key and try again.',
    };
  }

  const existingMember = await db.teamMember.findFirst({
    where: {
      teamId: team.id,
      userId: userId,
    },
  });

  if (existingMember) {
    return {
      error: 'You are already a member of this team.',
    };
  }

  await db.teamMember.create({
    data: {
      teamId: team.id,
      userId: userId,
    },
  });

  return {
    success: 'You have successfully joined the team.',
  };
}
