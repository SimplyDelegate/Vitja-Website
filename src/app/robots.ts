import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    // Vorschau-Stand mit Platzhalterdaten: bewusst nicht indexieren.
    rules: {
      userAgent: "*",
      disallow: "/"
    },
    sitemap: `${siteConfig.domain}/sitemap.xml`
  };
}
