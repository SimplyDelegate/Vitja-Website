import type { MetadataRoute } from "next";
import { featuredProjects, heroSlides, projectMedia, siteConfig } from "@/lib/content";
import { absoluteAssetUrl } from "@/lib/assets";
import { siteUrl } from "@/lib/seo";

// Pflicht fuer `output: "export"` -- die Datei wird beim Build erzeugt.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteConfig.isDraft) return [];
  const images = [...new Set([
    ...heroSlides.map((image) => image.src),
    ...projectMedia.map((image) => image.src),
    ...featuredProjects.flatMap((project) => [project.leadImage, ...project.detailImages].map((image) => image.src))
  ])].map((path) => absoluteAssetUrl(path, siteConfig.domain));

  // Keine Anker oder Formularparameter und kein erfundenes Änderungsdatum:
  // Ein erneuter Build bedeutet keine inhaltliche Änderung.
  return [
    { url: siteUrl(), images },
    { url: siteUrl("impressum/") },
    { url: siteUrl("datenschutz/") }
  ];
}
