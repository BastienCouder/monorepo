'use server';

import { currentUser, roleCheckMiddleware } from '@/lib/authCheck';
import { db } from '@/lib/prisma';
import { createCategorySchema, deleteCategorySchema } from '@/schemas/category';
import * as z from 'zod';

export const createCategory = async (
  values: z.infer<typeof createCategorySchema>
) => {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    throw new Error('Unauthorized');
  }

  const validatedFields = createCategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name } = validatedFields.data;

  const existingUser = await getCategoryByName(name);

  if (existingUser) {
    return { error: 'Category already in use!' };
  }

  await db.category.create({
    data: {
      name,
    },
  });

  return { success: 'Category Create Successfully!' };
};

export const deleteUser = async (
  values: z.infer<typeof deleteCategorySchema>
) => {
  const session = await currentUser();
  const isAuthorized = await roleCheckMiddleware(session);

  if (!isAuthorized) {
    throw new Error('Unauthorized');
  }

  const validatedFields = deleteCategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { id } = validatedFields.data;

  await db.category.delete({
    where: {
      id,
    },
  });

  return { success: 'User Deleted Successfully!' };
};

export const getCategoryByName = async (name: string) => {
  try {
    const category = await db.category.findUnique({ where: { name } });

    return category;
  } catch {
    return null;
  }
};
