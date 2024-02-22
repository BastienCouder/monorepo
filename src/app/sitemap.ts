import { env } from '@/lib/env';
import { MetadataRoute } from 'next';
import routes from '@/lib/routes.json';
const URL = `${env.NEXT_PUBLIC_APP_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [`${routes.home}`];

  const statics = staticRoutes.flatMap((route) => ({
    url: `${URL}/${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...statics];
}
