import { describe, expect, it } from "vitest";
import { caseStudies, evidenceRegistry, heroSlides, processCommitments, projectMedia, qualificationGroups, qualifications, services, siteConfig } from "./content";

describe("Website-Inhalte", () => {
  it("enthält die neun vereinbarten Leistungen", () => {
    expect(services).toHaveLength(9);
    expect(new Set(services.map((service) => service.id)).size).toBe(9);
  });

  it("ordnet nur fachlich belegten Leistungen ein Projektbild zu", () => {
    const illustrated = services.filter((service) => service.image);
    const withoutImage = services.filter((service) => !service.image).map((service) => service.id);

    expect(illustrated).toHaveLength(6);
    expect(withoutImage).toEqual(["blechherstellung", "industrieisolierung", "schiffsausbau"]);
    for (const service of illustrated) {
      expect(service.image?.src).toMatch(/^\/media\/projects\/.+\.webp$/);
      expect(service.image?.alt).toBeTruthy();
      expect(service.image?.focus).toMatch(/%$/);
    }
  });

  it("verwendet drei Hero-Motive und 15 echte Projektbilder", () => {
    expect(heroSlides).toHaveLength(3);
    expect(projectMedia).toHaveLength(15);
    expect(heroSlides[0].src).toContain("/media/hero/");
  });

  it("enthält die neue Vertrauensarchitektur und anonymisierte Projekteinblicke", () => {
    expect(processCommitments).toHaveLength(6);
    expect(qualificationGroups).toHaveLength(5);
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    expect(caseStudies.every((item) => !/GmbH|AG|Werft|Kunde:/i.test(item.title))).toBe(true);
  });

  it("veröffentlicht keine ungeprüften Zertifikatsdatensätze", () => {
    const publicQualifications = qualifications.filter((item) => item.publicVisibility === "summary");
    for (const item of publicQualifications) {
      expect(item.status).toBe("verified");
      expect(item.evidenceId).toBeTruthy();
      expect(evidenceRegistry.find((entry) => entry.id === item.evidenceId)?.approved).toBe(true);
      expect(item.standard && item.scope && item.issuer && item.validUntil).toBeTruthy();
    }
  });

  it("enthält weder alte Marke noch ausgeschlossene Partnernennung", () => {
    const content = JSON.stringify({ services, siteConfig, heroSlides, projectMedia, caseStudies, qualificationGroups });
    expect(content).not.toMatch(/Vitja|Struppe|Käfer|Bredo|G\+H|Weber/i);
    expect(siteConfig.name).toBe("Triumph Technical Services");
  });
});
