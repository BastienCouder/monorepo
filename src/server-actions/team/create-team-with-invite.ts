'use server';

import { db } from '@/lib/prisma';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { v4 as uuidv4 } from 'uuid';

export async function createTeam(
  creatorUserId: string,
  name: string,
  memberEmails: string[]
) {
  const key = uuidv4();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const userSubscription = await getUserSubscriptionPlan(creatorUserId);
  const teamStorageLimit = userSubscription.userStorageLimit;

  const team = await db.team.create({
    data: {
      name,
      slug,
      key,
      creatorId: creatorUserId,

      members: {
        create: {
          userId: creatorUserId,
          role: 'ADMINISTRATOR',
        },
      },
      storageLimit: teamStorageLimit,
    },
  });

  // memberEmails.forEach((email) => {
  //   sendTeamInvitationEmail(email, team.slug, team.key);
  // });

  return team;
}
