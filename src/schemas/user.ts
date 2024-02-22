import * as z from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(6).max(161),
  // // @ts-expect-error
  // role: z.enum(enumToArray(UserRole))
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  newPassword: z.string().min(6).max(161).optional(),
  // // @ts-expect-error
  // role: z.enum(enumToArray(UserRole))
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export const deleteUserSchema = z.object({
  id: z.string(),
});
