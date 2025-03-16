'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { LoginSchema } from '@/models/auth';
import { getUserByEmail } from '@/lib/auth/user';
import { getTwoFactorTokenByEmail } from '@/lib/auth/two-factor-token';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getTwoFactorConfirmationByUserId } from '@/lib/auth/two-factor-confirmation';
import { db } from '@/lib/prisma';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/email';
import { getTranslations } from 'next-intl/server';

type Response = {
  error?: string;
  twoFactor?: boolean;
  success?: string;
};

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
): Promise<Response | undefined> => {
  const t = await getTranslations('auth.server');
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: t('email_not_exist') };
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email
  //   );

  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token
  //   );

  //   return { success: t('confirmation_email_sent') };
  // }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: t('invalid_code') };
      }

      if (twoFactorToken.token !== code) {
        return { error: t('invalid_code') };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: t('code_expired') };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: t('invalid_credentials') };
        default:
          return { error: t('something_went_wrong') };
      }
    }

    throw error;
  }
};
