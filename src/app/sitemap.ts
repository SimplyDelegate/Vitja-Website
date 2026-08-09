import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteConfig.isDraft) return [];
  return ["", "/impressum", "/datenschutz"].map((path) => ({ url: `${siteConfig.domain}${path}`, lastModified: new Date(), changeFrequency: path ? "yearly" as const : "monthly" as const, priority: path ? 0.3 : 1 }));
}
