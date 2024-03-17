'use server';

import { db } from '@/lib/prisma';
import { Team } from '@prisma/client';

interface ExtendedTeam extends Team {
  totalStorageUsed: number;
  totalFileCount: number;
}

export async function getUserTeams(userId: string): Promise<ExtendedTeam[]> {
  try {
    const userTeams = await db.teamMember.findMany({
      where: {
        userId: userId,
      },
      include: {
        team: true,
      },
    });

    const teamsWithFileData: ExtendedTeam[] = await Promise.all(
      userTeams.map(async (userTeam) => {
        const team: ExtendedTeam = userTeam.team as ExtendedTeam;

        const files = await db.file.findMany({
          where: {
            teamId: team.id,
          },
          select: {
            size: true,
          },
        });

        team.totalStorageUsed = files.reduce((acc, file) => acc + file.size, 0);
        team.totalFileCount = files.length;

        return team;
      })
    );

    return teamsWithFileData;
  } catch (error) {
    console.error('Error fetching user teams:', error);
    throw error;
  }
}
