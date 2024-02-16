import { z } from "zod";

export const UserRoleEnum = z.enum(["ADMIN", "USER"]);

export const UserSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    role: UserRoleEnum,
    image: z.string().nullable(),
    createdAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

export type User = z.infer<typeof UserSchema>;