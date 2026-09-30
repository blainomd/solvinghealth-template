import type { MetadataRoute } from "next";
import { sitemapUrls } from "@/lib/manifest";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapUrls().map((url) => ({ url, lastModified: siteConfig.updated }));
}
