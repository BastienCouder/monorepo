import z from 'zod';

export const envSchema = z.object({
  NAME_WEBSITE: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  NEXT_PUBLIC_APP_URL: z.string().nonempty(),
  AUTH_SECRET: z.string().nonempty(),
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
  RESEND: z.string().nonempty(),
});

export const env = process.env;

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
