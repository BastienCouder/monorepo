import { db } from '@/lib/prisma';

async function getLatestFilesByUser(userId: string) {
  try {
    const teams = await db.teamMember.findMany({
      where: { userId },
      include: {
        team: true,
      },
    });

    const files = await Promise.all(
      teams.map(async ({ team }) =>
        db.file.findFirst({
          where: { teamId: team.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
        })
      )
    );

    return files.filter((file) => file !== null);
  } catch (error) {
    console.error('Error retrieving latest files:', error);
    throw error;
  }
}
