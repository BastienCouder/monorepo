'use server';

import { currentRole } from '@/lib/authCheck';
import { UserRole } from '@prisma/client';

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: 'authorisé !' };
  }

  return { error: 'Non authorisé !' };
};
