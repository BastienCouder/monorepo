import * as z from 'zod';

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(32),
});

export const renameTeamSchema = z.object({
  name: z.string().min(1).max(32),
});

export const createGroupSchema = z.object({
  name: z.string().min(1).max(32),
  storageLimit: z.number(),
});

export const createJoinTeamSchema = z.object({
  key: z.string().min(1).max(50),
});

export const deleteTeamSchema = z.object({
  userId: z.string().min(1).max(50),
  teamId: z.string().min(1).max(50),
});

export const regenerateKeySchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  teamId: z.string().min(1, 'Team ID is required.'),
});
