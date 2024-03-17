import { db } from '@/lib/prisma';

export const deleteTeam = async (teamId: string, userId: string) => {
  const team = await db.team.findUnique({ where: { id: teamId } });

  if (!team) throw new Error('Team not found.');
  if (team.creatorId !== userId)
    throw new Error('You are not authorized to delete this team.');

  await db.team.delete({ where: { id: teamId } });
};
