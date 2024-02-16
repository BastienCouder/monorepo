import z from "zod";

export const envSchema = z.object({
  NAME_WEBSITE: z.string().nonempty(),
});

export const env = process.env;

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};