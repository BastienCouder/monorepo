'use server';

import { z } from 'zod';

export const UserRole = z.enum(['ADMIN', 'OWNER', 'MEMBER']);

export const UserBase = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  emailVerified: z.date().optional(),
  role: UserRole,
  password: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isTwoFactorEnabled: z.boolean(),
  storageLimit: z.number(),
  storageUsed: z.number(),
});

export const TeamBase = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  key: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  storageLimit: z.number(),
  storageUsed: z.number(),
  creatorId: z.string(),
});

export const TeamMemberBase = z.object({
  id: z.string(),
  teamId: z.string(),
  userId: z.string(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InvitationBase = z.object({
  id: z.string(),
  teamId: z.string(),
  email: z.string().optional(),
  role: UserRole,
  token: z.string(),
  expires: z.date(),
  invitedBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sentViaEmail: z.boolean(),
});

export const FolderBase = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().optional(),
  teamId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().optional(),
});

export const FileBase = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string().optional(),
  size: z.number(),
  type: z.string().optional(),
  path: z.string().optional(),
  firebaseUrl: z.string().optional(),
  folderId: z.string().optional(),
  teamId: z.string().optional(),
  content: z.any().optional(),
  userId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

TeamBase.extend({
  creator: UserBase.optional(),
  members: z.array(TeamMemberBase),
  invitations: z.array(InvitationBase),
});

UserBase.extend({
  teams: z.array(TeamBase),
  teamLimits: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      count: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});

export const Folder = FolderBase.extend({
  subfolders: z.array(FolderBase).optional(),
  files: z.array(FileBase).optional(),
});

export const File = FileBase.extend({
  folder: Folder.optional(),
});

export const FolderExtended = Folder.extend({
  user: UserBase.optional(),
});

export const FileExtended = File.extend({
  user: UserBase.optional(),
});
