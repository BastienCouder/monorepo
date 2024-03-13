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
    categories: z.array(CategoryOnCourseSchema).optional(),
    chapters: z.array(ChapterSchema).optional(),
    attachments: z.array(AttachmentSchema).optional(),
    purchases: z.array(PurchaseSchema).optional(),
  })
);

const CategoryOnCourseSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    courseId: z.string(),
    categoryId: z.string(),
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
    userProgress: z.array(UserProgressSchema).optional(),
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

export const OptionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string().uuid(),
  label: z.string(),
  options: z.array(OptionSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const QuizSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  isPublished: z.boolean().default(false),
  chapterId: z.string().uuid(),
  questions: z.array(QuestionSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const UserProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  chapterId: z.string().uuid(),
  isCompleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AnswerSchema = z.object({
  questionId: z.string(),
  optionId: z.string(),
});

export const QuizAttemptSchema = z.object({
  answers: z.array(AnswerSchema),
});

export type User = z.infer<typeof UserSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryOnCourse = z.infer<typeof CategoryOnCourseSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Questions = z.infer<typeof QuestionSchema>;
export type Option = z.infer<typeof OptionSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;
