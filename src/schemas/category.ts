import * as z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(3).max(32),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).max(32),
});

export const deleteCategorySchema = z.object({
  id: z.string(),
});
