'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';

interface UserRoleInTeamResponse {
  success?: string;
  error?: string;
  role?: string;
}

export async function getUserRoleInTeam(
  teamId: string,
  userId: string
): Promise<UserRoleInTeamResponse> {
  const user = await currentUser();

  if (!user) {
    return {
      error: 'You are not authorized to perform this action.',
    };
  }

  if (user.id !== userId) {
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

  try {
    const teamMember = await db.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: userId,
        },
      },
    });

    if (!teamMember) {
      return {
        error: 'User is not a member of this team or the team does not exist.',
      };
    }

    return { role: teamMember.role };
  } catch (error) {
    return {
      error: 'Error retrieving user role.',
    };
  }
}
