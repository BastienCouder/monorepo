'use server';
import { currentUser } from '@/lib/authCheck';
import { db } from '@/lib/prisma';

export async function userInfoTeam() {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const userInfo = await db.user.findUnique({
      where: { id: userId },
      include: {
        TeamMember: {
          include: {
            team: true,
          },
        },
      },
    });

    if (userInfo && userInfo.TeamMember) {
      return userInfo.TeamMember.map((TeamMember) => ({
        id: TeamMember.team.id,
        name: TeamMember.team.name,
        createdAt: TeamMember.team.createdAt,
        updatedAt: TeamMember.team.updatedAt,
        role: TeamMember.role,
      }));
    }

    return [];
  } catch (error) {
    console.error('[GET_USER_INFO_TEAM]', error);
    throw error;
  }
}
