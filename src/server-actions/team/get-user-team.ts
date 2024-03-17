'use server';
import { db } from '@/lib/prisma';

export async function getUserTeams(userId: string) {
  try {
    const userTeams = await db.teamMember.findMany({
      where: {
        userId,
      },
      include: {
        team: { include: { members: true } },
      },
    });

    const teams = userTeams.map((teamMember) => teamMember.team);

    return teams;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des équipes de l’utilisateur:',
      error
    );
    throw error;
  }
}
