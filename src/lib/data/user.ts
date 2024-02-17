import { prisma } from '@/lib/prisma';
import { User } from '@/schemas/db-schema';

export const getUserByEmail = async (email: string) => {
  try {
    const user: User = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user: User = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
