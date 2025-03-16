import { db } from "../lib/prisma";
import { MetadataRoute } from "next";

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [];
}
