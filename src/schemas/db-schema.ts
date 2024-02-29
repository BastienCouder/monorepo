import { z } from 'zod';

export const UserRoleEnum = z.enum(['ADMIN', 'USER']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    role: UserRoleEnum,
    image: z.string().nullable(),
    createdAt: z.date(),
    deleteAt: z.date().nullable(),
    purchases: z.array(PurchaseSchema).optional(),
  })
);

const CourseSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    price: z.number().optional(),
    isPublished: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    categoryId: z.array(CategorySchema).optional(),
    chapters: z.array(ChapterSchema).optional(),
    attachments: z.array(AttachmentSchema).optional(),
    purchases: z.array(PurchaseSchema).optional(),
  })
);

const PurchaseSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string(),
    courseId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: UserSchema.optional(),
    course: CourseSchema.optional(),
  })
);

const ChapterSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    videoUrl: z.string().url().optional(),
    position: z.number(),
    isPublished: z.boolean(),
    courseId: z.string(),
  })
);

const CategorySchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
  })
);

const AttachmentSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    courseId: z.string(),
  })
);

const ContentSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    code: z.string().optional(),
    imageUrl: z.string().optional(),
  })
);

export type User = z.infer<typeof UserSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type Content = z.infer<typeof ContentSchema>;
