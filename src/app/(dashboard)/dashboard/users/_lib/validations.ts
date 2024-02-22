import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const updateUserRoleSchema = z.object({
  id: z.string(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});
