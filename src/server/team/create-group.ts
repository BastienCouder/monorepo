'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { createGroupSchema } from '@/models/validations/team';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

interface createGroupResponse {
  success?: string;
  error?: string;
}

export async function createGroup(
  userId: string,
  values: z.infer<typeof createGroupSchema>
): Promise<createGroupResponse> {
  const t = await getTranslations('auth.server');
  const validatedFields = createGroupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { name } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return {
      error: 'You are not authorized to perform this action.',
    };
  }

  if (user.id !== userId) {
    return {
      error:
        'You do not have the necessary permissions to perform this action.',
    };
  }

  const key = uuidv4();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const userSubscription = await getUserSubscriptionPlan(userId);
  const teamStorageLimit = userSubscription.userStorageLimit;

  await db.team.create({
    data: {
      name,
      slug,
      key,
      creatorId: userId,
      members: {
        create: {
          userId: userId,
          role: 'OWNER',
        },
      },
      storageLimit: teamStorageLimit,
    },
  });

  revalidatePath('/dashboard');

  return {
    success: 'Group created successfully.',
  };
}
