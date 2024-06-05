'use server';

import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import type { updateUserRoleSchema } from './validations';

import { deleteUserSchema } from '@/models/user';
import { db } from '@/lib/prisma';
import { currentUser } from '@/lib/authCheck';

export async function updateUserRole({
  id,
  role,
}: z.infer<typeof updateUserRoleSchema>) {
  await db.user.update({
    where: {
      id: id,
    },
    data: {
      role: role,
    },
  });

  revalidatePath('/');
}

// export async function deleteUser(input: { id: string }) {
//   await db.user.delete({
//     where: {
//       id: input.id,
//     },
//   });

//   revalidatePath('/');
// }

export const deleteUser = async (values: z.infer<typeof deleteUserSchema>) => {
  const validatedFields = deleteUserSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields!');
    // return { error: 'Invalid fields!' };
  }

  const { id } = validatedFields.data;

  // Validation
  const user = await currentUser();
  if (id == user?.id) {
    throw new Error('Unable to remove your own user!');
    // return { error: 'Unable to remove your own user!' };
  }

  await db.user.delete({
    where: {
      id,
    },
  });

  // return { success: 'User Deleted Successfully!' };

  revalidatePath('/');
};
