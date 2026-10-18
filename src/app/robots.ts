import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

// Pflicht fuer `output: "export"` -- die Datei wird beim Build erzeugt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.isDraft) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: siteUrl("sitemap.xml") };
}
