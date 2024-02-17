import { env } from "@/lib/env";
import { MetadataRoute } from "next";
import routes from "@/lib/data/routes.json";

const locales = ["fr", "en"];

const URL = `${env.NEXT_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        `${routes.home}`,
    ];

    const statics = staticRoutes.flatMap((route) =>
        locales.map((locale) => ({
            url: `${URL}/${locale}${route}`,
            lastModified: new Date().toISOString(),
        }))
    );
    return [...statics];
}