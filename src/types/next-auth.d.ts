/* eslint-disable no-unused-vars */
import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  role: UserRole;
  storageUsed: number;
  storageLimit: number;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
