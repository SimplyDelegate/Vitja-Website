import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadSeo(domain: string, indexing: string, basePath = "") {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", domain);
  vi.stubEnv("NEXT_PUBLIC_SITE_INDEXING", indexing);
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
  vi.resetModules();
  const [seo, { default: sitemap }, { default: robots }] = await Promise.all([
    import("./seo"), import("../app/sitemap"), import("../app/robots")
  ]);
  return { ...seo, sitemap, robots };
}

describe("SEO-Freigabe und URL-Konsistenz", () => {
  it("liefert nach Freigabe identische Haupt-URLs in Sitemap, Canonical und Open Graph", async () => {
    const seo = await loadSeo("https://www.firma.de/", "true");
    const entries = seo.sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://www.firma.de/", "https://www.firma.de/impressum/", "https://www.firma.de/datenschutz/"
    ]);
    for (const entry of entries) {
      const path = new URL(entry.url).pathname;
      const metadata = seo.pageMetadata("Seitentitel", "Beschreibung", path);
      expect(metadata.alternates?.canonical).toBe(entry.url);
      expect(metadata.openGraph?.url).toBe(entry.url);
      expect(metadata.robots).toMatchObject({ index: true, follow: true });
      expect(entry).not.toHaveProperty("lastModified");
    }
    expect(seo.robots()).toMatchObject({ rules: { allow: "/" }, sitemap: "https://www.firma.de/sitemap.xml" });
    expect(entries[0].images?.length).toBeGreaterThan(0);
    for (const image of entries[0].images ?? []) {
      expect(existsSync(join(process.cwd(), "public", new URL(image).pathname))).toBe(true);
    }
  });

  it.each([
    ["", "true"],
    ["https://www.firma.de", "false"],
    ["https://preview.firma.de", "true"],
    ["https://website.pages.dev", "true"],
    ["https://branch.website.pages.dev", "true"],
    ["https://www.ihre-domain.de", "true"],
    ["http://www.firma.de", "true"]
  ])("hält %s mit Freigabe %s aus Suchergebnissen und Sitemap heraus", async (domain, indexing) => {
    const seo = await loadSeo(domain, indexing);
    expect(seo.pageMetadata("Titel", "Beschreibung").robots).toEqual({ index: false, follow: false });
    expect(seo.sitemap()).toEqual([]);
    expect(seo.robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("behält einen Hosting-Unterpfad für Seiten und Social-Bilder genau einmal bei", async () => {
    const seo = await loadSeo("https://www.firma.de/website/", "true", "/website");
    const metadata = seo.pageMetadata("Datenschutz", "Beschreibung", "datenschutz/");
    expect(metadata.alternates?.canonical).toBe("https://www.firma.de/website/datenschutz/");
    expect(metadata.openGraph).toMatchObject({
      url: "https://www.firma.de/website/datenschutz/",
      images: [{ url: "https://www.firma.de/website/brand/social-preview.jpg" }]
    });
    expect(seo.robots().sitemap).toBe("https://www.firma.de/website/sitemap.xml");
  });
});
