'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { Team, TeamMember, File } from '@/models/db';

export async function getAllFilesForUserTeams(): Promise<File[]> {
  const user = await currentUser();
  if (!user?.id) throw new Error('Unauthorized');

  const teamMemberships = await db.teamMember.findMany({
    where: {
      userId: user.id,
    },
    include: {
      team: true,
    },
  });

  const allFiles = await Promise.all(
    teamMemberships.map(async (teamMember: TeamMember & { team: Team }) => {
      const files = await db.file.findMany({
        where: { teamId: teamMember.team.id },
        orderBy: { createdAt: 'desc' },
      });
      return files as File[];
    })
  );

  return allFiles.flat();
}
