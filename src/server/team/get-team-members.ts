'use server';
import { db } from '@/lib/prisma';

export async function getTeamMembers(teamId: string) {
  try {
    const teamWithMembers = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        members: true,
      },
    });
    if (teamWithMembers && teamWithMembers.members.length) {
      const userDetails = await Promise.all(
        teamWithMembers.members.map((member) =>
          db.user.findUnique({
            where: { id: member.userId },
          })
        )
      );
      return userDetails;
    }
    return [];
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des membres de l’équipe:',
      error
    );
    throw error;
  }
}
