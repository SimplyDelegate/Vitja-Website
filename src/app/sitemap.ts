import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

// Pflicht fuer `output: "export"` -- die Datei wird beim Build erzeugt.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteConfig.isDraft) return [];
  return ["", "/impressum", "/datenschutz"].map((path) => ({ url: `${siteConfig.domain}${path}`, lastModified: new Date(), changeFrequency: path ? "yearly" as const : "monthly" as const, priority: path ? 0.3 : 1 }));
}
