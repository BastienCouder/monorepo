import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { RegisterAdminSchema, RegisterSchema } from '@/schemas/index';
import { getUserByEmail } from '@/lib/data/user';
import { prisma } from '@/lib/prisma';
import { User, UserRole } from '@/schemas/db-schema';

type CreateUserResponse = {
  success?: string;
  user?: User;
  error?: string;
};

type CreateUserParams = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
};

async function createUser({
  email,
  password,
  name,
  role,
}: CreateUserParams): Promise<CreateUserResponse> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email déjà utilisé !' };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  // const verificationToken = await generateVerificationToken(to);
  // await sendEmail(resend, EmailType.Verification, to, verificationToken.token);

  return { success: 'Confirmation email envoyé !', user };
}
export const register = async (
  values: z.infer<typeof RegisterSchema>
): Promise<CreateUserResponse> => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Champs invalide !' };
  }

  return await createUser({ ...validatedFields.data, role: 'USER' });
};

export const registerDashboard = async (
  values: z.infer<typeof RegisterAdminSchema>
): Promise<CreateUserResponse> => {
  const validatedFields = RegisterAdminSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Champs invalide !' };
  }

  return await createUser({
    ...validatedFields.data,
    role: 'ADMIN' as UserRole,
  });
};
