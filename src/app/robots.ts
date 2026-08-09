import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.isDraft) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteConfig.domain}/sitemap.xml`, host: siteConfig.domain };
}
