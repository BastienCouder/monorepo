'use server';

import { z } from 'zod';

export const UserRole = z.enum([
  'ADMINISTRATOR',
  'OWNER',
  'MEMBER',
  'EDITOR',
  'READER',
]);

const UserSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.date().optional(),
    role: UserRole,
  })
);


export type User = z.infer<typeof UserSchema>;
