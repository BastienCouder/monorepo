'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';

interface ToggleKeyActiveResponse {
  success?: string;
  error?: string;
}

export async function toggleKeyActive(
  userId: string,
  teamId: string
): Promise<ToggleKeyActiveResponse> {
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
    where: { id: teamId },
  });

  if (!team) {
    return {
      error: 'Team not found.',
    };
  }

  const updatedTeam = await db.team.update({
    where: { id: teamId },
    data: { isKeyActive: !team.isKeyActive },
  });

  return {
    error: `Team key is now ${updatedTeam.isKeyActive ? 'activated' : 'deactivated'}`,
  };
}
