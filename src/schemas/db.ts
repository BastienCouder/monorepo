'use server';

import { z } from 'zod';

export const UserRole = z.enum([
  'ADMINISTRATOR',
  'OWNER',
  'MEMBER',
  'EDITOR',
  'READER',
]);

const UserSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.date().optional(),
    role: UserRole,
    storageLimit: z.number(),
    storageUsed: z.number(),
    // TeamMember: z.array(TeamMemberSchema).optional(),
    // Team: z.array(TeamSchema).optional(),
    // Invitation: z.array(InvitationSchema).optional(),
    // Folder: z.array(FolderSchema).optional(),
    // File: z.array(FileSchema).optional(),
  })
);

const TeamSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    // key: z.string(),
    updatedAt: z.date(),
    storageLimit: z.number(),
    storageUsed: z.number(),
    creatorId: z.string(),
    creator: UserSchema.optional(),
    members: z.array(TeamMemberSchema).optional(),
    invitations: z.array(InvitationSchema).optional(),
    Folder: z.array(FolderSchema).optional(),
    File: z.array(FileSchema).optional(),
  })
);

const TeamLimitSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    user: UserSchema.optional(),
    count: z.number(),
  })
);

const TeamMemberSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    teamId: z.string(),
    userId: z.string(),
    role: UserRole,
    createdAt: z.date(),
    updatedAt: z.date(),
    user: UserSchema.optional(),
    team: TeamSchema.optional(),
  })
);

const InvitationSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
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
    user: UserSchema.optional(),
    team: TeamSchema.optional(),
  })
);

const FolderSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().optional(),
    teamId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string().optional(),
    user: UserSchema.optional(),
    parent: FolderSchema.optional(),
    team: TeamSchema.optional(),
    subfolders: z.array(FolderSchema).optional(),
    files: z.array(FileSchema).optional(),
  })
);

const FileSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
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
    folder: FolderSchema.optional(),
    user: UserSchema.optional(),
    team: TeamSchema.optional(),
  })
);

export type User = z.infer<typeof UserSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type TeamLimit = z.infer<typeof TeamLimitSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type Folder = z.infer<typeof FolderSchema>;
export type File = z.infer<typeof FileSchema>;
