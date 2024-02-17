'use server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

// Check Register Email
export async function checkIfEmailExists(email: string): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  return Boolean(existingUser);
}

// Check Login Email
export async function checkEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return null;
  }
  return user;
}

// Check Login Password
export async function checkPassword(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password) {
      return compare(password, user.password);
    }
    return false;
  } catch (error) {
    console.error('Error checking password:', error);
    return false;
  }
}
