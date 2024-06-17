'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { regenerateKeySchema } from '@/models/validations/team';
import { getTranslations } from 'next-intl/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

interface RegenerateKeyResponse {
  success?: string;
  error?: string;
  key?: string;
}

export async function regenerateKey(
  values: z.infer<typeof regenerateKeySchema>
): Promise<RegenerateKeyResponse> {
  const t = await getTranslations('auth.server');
  const validatedFields = regenerateKeySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { userId, teamId } = validatedFields.data;

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

  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    return {
      error: 'Invalid team key. Please check the key and try again.',
    };
  }

  let key;
  let isUnique = false;
  do {
    key = uuidv4();
    const existingTeam = await db.team.findUnique({
      where: { key },
    });
    if (!existingTeam) isUnique = true;
  } while (!isUnique);

  await db.team.update({
    where: { id: teamId },
    data: { key },
  });

  return { success: 'key regenerate', key };
}
