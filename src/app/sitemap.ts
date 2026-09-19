import type { MetadataRoute } from "next";
import { getPublished } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const site = await getPublished();
  const urls: MetadataRoute.Sitemap = [];
  const add = (path: string, priority = 0.7) => {
    urls.push({ url: `${base}${path}`, lastModified: site.updatedAt, priority, alternates: { languages: { en: `${base}${path}`, bn: `${base}/bn${path === "/" ? "" : path}` } } });
    urls.push({ url: `${base}/bn${path === "/" ? "" : path}`, lastModified: site.updatedAt, priority: priority - 0.1 });
  };
  add("/", 1);
  add("/projects", 0.8);
  for (const p of site.pages) if (!["home", "projects"].includes(p.props.slug) && !p.props.noindex) add(`/${p.props.slug}`);
  for (const p of site.collections.projects) add(`/projects/${p.slug}`, 0.6);
  return urls;
}
