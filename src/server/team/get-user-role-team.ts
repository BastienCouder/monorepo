'use server';

import { db } from '@/lib/prisma';

export async function getUserRoleInTeam(teamId: string, userId: string) {
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
      console.log(
        'User is not a member of this team or the team does not exist.'
      );
      return null;
    }

    return teamMember.role;
  } catch (error) {
    console.error('Error retrieving user role:', error);
    throw error;
  }
}
