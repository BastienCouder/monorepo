'use server';

import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

type Response = {
  error?: string;
  success?: string;
};

export const admin = async (): Promise<Response> => {
  const t = await getTranslations('auth.server');
  const role = await currentRole();

  if (role === UserRole.ADMINISTRATOR) {
    return { success: t('authorized') };
  }

  return { error: t('unauthorized') };
};
