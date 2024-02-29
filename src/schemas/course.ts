import * as z from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3).max(32),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).max(32),
});

export const deleteCourseSchema = z.object({
  id: z.string(),
});
