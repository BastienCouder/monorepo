'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { User, UserRole } from '@/models/db';

interface TeamMemberDetail {
  user: User;
  role: any;
}

interface TeamMembersResponse {
  success?: string;
  error?: string;
  userDetails?: TeamMemberDetail[];
}

export async function getTeamMembers(
  teamId: string,
  userId: string
): Promise<TeamMembersResponse> {
  try {
    const user = await currentUser();
    if (!user || user.id !== userId) {
      return { error: 'You are not authorized to perform this action.' };
    }

    const teamWithMembers = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!teamWithMembers) {
      return { error: 'Invalid team key. Please check the key and try again.' };
    }

    if (teamWithMembers.members.length) {
      const userDetails = teamWithMembers.members
        .filter((member) => member.user !== null)
        .map((member) => ({
          user: member.user,
          role: member.role,
        }));

      if (userDetails.length === 0) {
        return { error: 'No valid members found in this team.' };
      }

      return { success: 'Members fetched successfully.', userDetails };
    } else {
      return { error: 'No members found in this team.' };
    }
  } catch (error) {
    console.error('Error retrieving team members:', error);
    return { error: 'Error while retrieving team members.' };
  }
}
