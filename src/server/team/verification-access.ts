'use server';

import { db } from '@/lib/prisma';

export default async function verificationAccess(
  teamSlug: string,
  key: string
): Promise<string> {
  const team = await db.team.findUnique({
    where: { slug: teamSlug },
  });

  if (!team) return 'Team not found.';

  if (team.key !== key) return 'Key not authorized';

  return 'Authorized !';
}
