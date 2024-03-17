'use server';

import { db } from '@/lib/prisma';

export const renameTeam = async (
  teamId: string,
  userId: string,
  newName: string
) => {
  const team = await db.team.findUnique({ where: { id: teamId } });

  if (!team) throw new Error('Team not found.');
  if (team.creatorId !== userId)
    throw new Error('You are not authorized to rename this team.');

  const updatedTeam = await db.team.update({
    where: { id: teamId },
    data: { name: newName },
  });

  return updatedTeam;
};
