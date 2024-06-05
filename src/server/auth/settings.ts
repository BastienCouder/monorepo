'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { SettingsSchema } from '@/models/auth';

import { generateVerificationToken } from '@/lib/tokens';
import { currentUser } from '@/lib/auth';
import { getUserByEmail, getUserById } from '@/lib/auth/user';
import { sendVerificationEmail } from '@/lib/email';
import { db } from '@/lib/prisma';
import { update } from '@/auth';
import { getTranslations } from 'next-intl/server';

type Response = {
  error?: string;
  success?: string;
};

export const settings = async (
  values: z.infer<typeof SettingsSchema>
): Promise<Response> => {
  const user = await currentUser();
  const t = await getTranslations('auth.server');

  if (!user) {
    return { error: t('unauthorized') };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: t('unauthorized') };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: t('email_in_use') };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: t('verification_email_sent') };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: t('incorrect_password') };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  });

  return { success: t('settings_updated') };
};
