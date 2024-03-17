'use server';
import { sendTeamInvitationEmail } from '@/lib/email';
import { db } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export const createTeam = async (
  creatorUserId: string,
  name: string,
  memberEmails: string[]
) => {
  const key = uuidv4();
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const team = await db.team.create({
    data: {
      name,
      slug,
      key,
      creatorId: creatorUserId,

      members: {
        create: {
          userId: creatorUserId,
          role: UserRole.ADMIN,
        },
      },
    },
  });

  memberEmails.forEach((email) => {
    sendTeamInvitationEmail(email, team.slug, team.key);
  });

  return team;
};
