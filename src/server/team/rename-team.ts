'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { renameTeamSchema } from '@/models/validations/team';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

interface RenameTeamResponse {
  success?: string;
  error?: string;
}

export async function renameTeam(
  userId: string,
  teamId: string,
  values: z.infer<typeof renameTeamSchema>
): Promise<RenameTeamResponse> {
  const t = await getTranslations('auth.server');
  const validatedFields = renameTeamSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { name } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return {
      error: 'You are not authorized to delete this team.',
    };
  }

  if (user.id !== userId && user.role !== 'OWNER') {
    return {
      error: 'You are not authorized to delete this team.',
    };
  }

  const team = await db.team.findUnique({ where: { id: teamId } });

  if (!team) {
    return {
      error: 'Team not found.',
    };
  }

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
    return {
      error: 'You are not authorized to rename this team.',
    };
  }

  await db.team.update({
    where: { id: teamId },
    data: { name },
  });

  revalidatePath('/dashboard');

  return {
    success: 'Update successful.',
  };
}
