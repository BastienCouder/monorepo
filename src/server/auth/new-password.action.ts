'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { NewPasswordSchema } from '@/models/auth';
import { getPasswordResetTokenByToken } from '@/lib/auth/password-reset-token';
import { getUserByEmail } from '@/lib/auth/user';
import { db } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
type Response = {
  error?: string;
  success?: string;
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
): Promise<Response> => {
  const t = await getTranslations('auth.server');

  if (!token) {
    return { error: t('missing_token') };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: t('invalid_token') };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: t('token_expired') };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: t('email_not_exist') };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: t('password_updated') };
};
