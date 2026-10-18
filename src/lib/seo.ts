import type { Metadata } from "next";
import { absoluteAssetUrl } from "./assets";
import { siteConfig } from "./content";

export const homeTitle = "Industrieisolierung & Rohrleitungsbau | Triumph Technical Services";

/** Gemeinsame URL-Basis für Canonical, Sitemap und strukturierte Daten. */
export function siteUrl(path = ""): string {
  return new URL(path.replace(/^\/+/, ""), `${siteConfig.domain}/`).toString();
}

export function pageMetadata(title: string, description: string, path = ""): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: siteUrl(path) },
    robots: siteConfig.isDraft
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title,
      description,
      url: siteUrl(path),
      siteName: siteConfig.name,
      locale: "de_DE",
      type: "website",
      images: [{
        url: absoluteAssetUrl("/brand/social-preview.jpg", siteConfig.domain),
        width: 1200,
        height: 630,
        alt: "Triumph Technical Services – Technische Lösungen für die Industrie"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteAssetUrl("/brand/social-preview.jpg", siteConfig.domain)]
    }
  };
}
