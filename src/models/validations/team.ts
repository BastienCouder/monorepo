import * as z from 'zod';

const baseSchema = z.object({
  name: z.string(),
});
const inviteSchema = z.object({
  invites: z.array(z.string().email().optional()).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(32),
});

export const createJoinTeamSchema = z.object({
  key: z.string().min(1).max(50),
});

export const deleteTeamSchema = z.object({
  id: z.string(),
});

export const createTeamSchema = baseSchema.merge(inviteSchema);
