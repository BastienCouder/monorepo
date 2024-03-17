import * as z from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1).max(32),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(32),
});

export const deleteFolderSchema = z.object({
  id: z.string(),
});
