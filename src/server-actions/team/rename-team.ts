'use server';

import { db } from '@/lib/prisma';

export const renameTeam = async (
  teamId: string,
  userId: string,
  newName: string
) => {
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Team not found.');

  const teamMember = await db.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: teamId,
        userId: userId,
      },
    },
  });

  if (
    !teamMember ||
    (teamMember.role !== 'ADMINISTRATOR' &&
      teamMember.role !== 'OWNER' &&
      teamMember.userId !== team.creatorId)
  ) {
    throw new Error('You are not authorized to rename this team.');
  }

  const updatedTeam = await db.team.update({
    where: { id: teamId },
    data: { name: newName },
  });

  return updatedTeam;
};
