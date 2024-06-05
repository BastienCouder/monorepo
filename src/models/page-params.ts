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

export const searchFolderFileParamsSchema = z.object({
  page: z.string().default('1'),
  per_page: z.string().default('10'),
  sort: z.string().optional(),
  operator: z.string().optional(),

  // Commun à dossiers et fichiers
  name: z.string().optional(),
  type: z.string().optional(),

  // Spécifique aux fichiers
  mimeType: z.string().optional(),
  size: z.string().optional(),

  // Dates de création et de modification pour une recherche basée sur la plage de dates
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),

  // Ajout de dateFrom et dateTo pour les filtres de plage de dates
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),

  // Spécifique aux dossiers
  parentId: z.string().optional(),

  // Filtres avancés
  userId: z.string().optional(),
});
