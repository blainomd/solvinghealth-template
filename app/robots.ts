import type { MetadataRoute } from "next";
import { base } from "@/lib/manifest";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base()}/sitemap.xml` };
}
