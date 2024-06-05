'use server';
import { db } from '@/lib/prisma';
import { Team } from '@/models/db';



interface ExtendedTeam extends Team {
  totalStorageUsed: number;
  totalFileCount: number;
}

export async function getUserTeams(userId: string) {
  try {
    const userTeams = await db.teamMember.findMany({
      where: {
        userId,
      },
      include: {
        team: {
          include: { members: true },
        },
      },
    });

    const teamsWithFileData: ExtendedTeam[] = await Promise.all(
      userTeams.map(async (userTeam) => {
        const files = await db.file.findMany({
          where: {
            teamId: userTeam.team.id,
          },
          select: {
            size: true,
          },
        });

        const totalStorageUsed = files.reduce(
          (acc, file) => acc + file.size,
          0
        );
        const totalFileCount = files.length;

        return {
          ...userTeam.team,
          totalStorageUsed,
          totalFileCount,
        } as ExtendedTeam;
      })
    );

    return teamsWithFileData;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des équipes de l’utilisateur:',
      error
    );
    throw error;
  }
}
