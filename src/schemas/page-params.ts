import * as z from 'zod';

export const searchParamsSchema = z.object({
  page: z.string().default('1'),
  per_page: z.string().default('10'),
  sort: z.string().optional(),
  operator: z.string().optional(),

  // Task
  name: z.string().optional(),
  title: z.string().optional(),

  // Store
  category: z.string().optional(),
  store: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),

  // User
  role: z.string().optional(),
  email: z.string().optional(),
});
