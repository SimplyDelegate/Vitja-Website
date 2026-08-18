import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { caseStudies, evidenceRegistry, featuredProjectMetrics, featuredProjects, heroSlides, processCommitments, projectMedia, qualificationGroups, qualifications, services, siteConfig } from "./content";

describe("Website-Inhalte", () => {
  it("enthält die neun vereinbarten Leistungen", () => {
    expect(services).toHaveLength(9);
    expect(new Set(services.map((service) => service.id)).size).toBe(9);
  });

  it("ordnet nur fachlich belegten Leistungen ein Projektbild zu", () => {
    const illustrated = services.filter((service) => service.image || service.gallery);
    const withoutImage = services.filter((service) => !service.image && !service.gallery).map((service) => service.id).sort();

    expect(illustrated).toHaveLength(9);
    expect(withoutImage).toEqual([]);
    for (const service of illustrated) {
      const images = service.gallery ?? (service.image ? [service.image] : []);
      for (const image of images) {
        expect(image.src).toMatch(/^\/media\/.+\.webp$/);
        expect(image.alt).toBeTruthy();
        expect(image.focus).toMatch(/%$/);
        expect(existsSync(join(process.cwd(), "public", image.src.replace(/^\//, "")))).toBe(true);
      }
    }

    const shipbuilding = services.find((service) => service.id === "schiffsausbau");
    expect(shipbuilding?.image).toEqual({
      src: "/media/services/schiffsausbau/schiffsausbau-rohrsystem-montage.webp",
      alt: "Rohrleitungssystem mit Armaturen im technisch ausgebauten Schiffsbereich",
      focus: "center 50%"
    });
  });

  it("stellt für Industrieisolierung, Rohrbau, GFK, Anlageninstandsetzung, Schweißarbeiten und Blechvorrichtungen eindeutige Galerien bereit", () => {
    const galleryServices = services.filter((service) => service.gallery);
    expect(galleryServices.map((service) => service.id)).toEqual(["industrieisolierung", "rohrbau", "gfk", "anlageninstandsetzung", "schweissarbeiten", "blechherstellung"]);

    const insulationGallery = galleryServices.find((service) => service.id === "industrieisolierung")?.gallery ?? [];
    expect(insulationGallery).toHaveLength(5);
    expect(new Set(insulationGallery.map((image) => image.src)).size).toBe(5);
    expect(insulationGallery.map((image) => image.src)).toEqual([
      "/media/services/industrieisolierung/industrieisolierung-blechmantel-formteil.webp",
      "/media/services/industrieisolierung/industrieisolierung-uebergang-daemmung-blech.webp",
      "/media/services/industrieisolierung/industrieisolierung-rohrleitung-behaelter.webp",
      "/media/services/industrieisolierung/industrieisolierung-rohrbogen-montagebereich.webp",
      "/media/services/industrieisolierung/industrieisolierung-luftkanal-folienmantel.webp"
    ]);

    const rohrbauGallery = galleryServices.find((service) => service.id === "rohrbau")?.gallery ?? [];
    expect(rohrbauGallery).toHaveLength(3);
    expect(new Set(rohrbauGallery.map((image) => image.src)).size).toBe(3);
    expect(rohrbauGallery.map((image) => image.src)).toEqual([
      "/media/services/rohrbau/rohrbau-fertigungskomponenten.webp",
      "/media/projects/rohrbau-fertigung.webp",
      "/media/services/rohrbau/rohrbau-anlagenbestand.webp"
    ]);

    const gfkGallery = galleryServices.find((service) => service.id === "gfk")?.gallery ?? [];
    expect(gfkGallery).toHaveLength(3);
    expect(new Set(gfkGallery.map((image) => image.src)).size).toBe(3);
    expect(gfkGallery.map((image) => image.src)).toEqual([
      "/media/services/gfk/gfk-sammelleitung-fertigung.webp",
      "/media/projects/gfk-rohrbaugruppe.webp",
      "/media/services/gfk/gfk-flanschverbindung-detail.webp"
    ]);

    const maintenanceGallery = galleryServices.find((service) => service.id === "anlageninstandsetzung")?.gallery ?? [];
    expect(maintenanceGallery).toHaveLength(3);
    expect(new Set(maintenanceGallery.map((image) => image.src)).size).toBe(3);
    expect(maintenanceGallery.map((image) => image.src)).toEqual([
      "/media/projects/anlageninstandsetzung.webp",
      "/media/services/anlageninstandsetzung/anlageninstandsetzung-aggregat-arbeitsbereich.webp",
      "/media/services/anlageninstandsetzung/anlageninstandsetzung-ventilbank.webp"
    ]);

    const weldingGallery = galleryServices.find((service) => service.id === "schweissarbeiten")?.gallery ?? [];
    expect(weldingGallery).toHaveLength(3);
    expect(new Set(weldingGallery.map((image) => image.src)).size).toBe(3);
    expect(weldingGallery.map((image) => image.src)).toEqual([
      "/media/projects/schweissnaht.webp",
      "/media/services/schweissarbeiten/schweissnaht-rohrabzweig.webp",
      "/media/services/schweissarbeiten/schweissnaht-flansch-detail.webp"
    ]);

    const sheetMetalGallery = galleryServices.find((service) => service.id === "blechherstellung")?.gallery ?? [];
    expect(sheetMetalGallery).toHaveLength(2);
    expect(new Set(sheetMetalGallery.map((image) => image.src)).size).toBe(2);
    expect(sheetMetalGallery.map((image) => image.src)).toEqual([
      "/media/services/blechvorrichtungen/blechvorrichtung-zugangsklappen.webp",
      "/media/services/blechvorrichtungen/blechvorrichtung-frontansicht.webp"
    ]);
  });

  it("verwendet Blechvorrichtungen als sichtbare Leistungsbezeichnung", () => {
    const service = services.find((item) => item.id === "blechherstellung");
    expect(service?.title).toBe("Blechvorrichtungen");
    expect(service?.requestValue).toBe("Blechvorrichtungen");
    expect(`${service?.title} ${service?.short} ${service?.requestValue}`).not.toMatch(/Blechherstellung/i);
  });

  it("verwendet drei Hero-Motive und 18 bündig angeordnete Projektbilder", () => {
    expect(heroSlides).toHaveLength(3);
    expect(projectMedia).toHaveLength(18);
    expect(heroSlides[0].src).toContain("/media/hero/");

    expect(new Set(projectMedia.map((item) => item.src)).size).toBe(18);
    expect(new Set(projectMedia.map((item) => item.category))).toEqual(new Set([
      "Industrieisolierung",
      "Rohrbau",
      "GFK",
      "Schweißen",
      "Stahlbau",
      "Integration",
      "Instandsetzung"
    ]));
    expect(projectMedia.filter((item) => item.layout === "wide")).toHaveLength(4);
    expect(projectMedia.filter((item) => item.layout === "tall")).toHaveLength(2);
    expect(projectMedia.filter((item) => item.layout === "standard")).toHaveLength(12);
    expect(projectMedia.some((item) => item.caption === "Rohrbaugruppe nach Projektvorgabe")).toBe(false);

    const newGalleryImages = [
      "/media/projects/gallery/industrieisolierung-behaelter-daemmung.webp",
      "/media/projects/gallery/industrieisolierung-matratzendaemmung.webp",
      "/media/projects/gallery/industrieisolierung-anlagenkomponente.webp",
      "/media/projects/gallery/rohrbau-montagearbeiten.webp"
    ];
    expect(projectMedia.filter((item) => newGalleryImages.includes(item.src))).toHaveLength(4);

    for (const item of projectMedia) {
      expect(item.src).toMatch(/^\/media\/.+\.webp$/);
      expect(item.alt.trim()).toBeTruthy();
      expect(item.caption.trim()).toBeTruthy();
      expect(existsSync(join(process.cwd(), "public", item.src.replace(/^\//, "")))).toBe(true);
    }

    const rohrbau = services.find((service) => service.id === "rohrbau");
    expect(rohrbau?.gallery?.some((image) => image.src === "/media/projects/rohrbau-fertigung.webp")).toBe(true);
  });

  it("enthält die neue Vertrauensarchitektur und anonymisierte Projekteinblicke", () => {
    expect(processCommitments).toHaveLength(6);
    expect(qualificationGroups).toHaveLength(5);
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    expect(caseStudies.every((item) => !/GmbH|AG|Werft|Kunde:/i.test(item.title))).toBe(true);
  });

  it("enthält zwei anonymisierte Projektbeispiele mit lokalen Medien", () => {
    expect(featuredProjects).toHaveLength(2);
    expect(new Set(featuredProjects.map((project) => project.id)).size).toBe(2);

    const publishedCopy = featuredProjects.map((project) => [
      project.id,
      project.category,
      project.title,
      project.description,
      ...project.metrics.items.map((metric) => metric.label)
    ].join(" "));
    expect(JSON.stringify(publishedCopy)).not.toMatch(/Personal bereitstellen|Mitarbeiter überlassen|Zeitarbeit|Fachkräfte nach Bedarf/i);
    expect(JSON.stringify(publishedCopy)).not.toMatch(/Kunde:|Standort:|GmbH|\bAG\b/i);

    for (const project of featuredProjects) {
      expect(project).not.toHaveProperty("number");
      expect(project.description.length).toBeLessThanOrEqual(140);
      expect(project.metrics.projectId).toBe(project.id);
      expect(project.metrics.status).toBe("placeholder");
      expect(project.metrics.items).toHaveLength(3);
      expect(project.metrics.items.every((metric) => Number.isFinite(metric.value) && metric.value >= 0 && metric.label.trim())).toBe(true);
      expect(project.metrics.items.every((metric) => typeof metric.prefix === "string" && typeof metric.suffix === "string")).toBe(true);

      const images = [project.leadImage, ...project.detailImages];
      expect(images).toHaveLength(3);
      for (const image of images) {
        expect(image.src).toMatch(/^\/media\/featured-projects\/.+\.webp$/);
        expect(image.alt).toBeTruthy();
        expect(existsSync(join(process.cwd(), "public", image.src.replace(/^\//, "")))).toBe(true);
      }
    }

    const wirbelofen = featuredProjects.find((project) => project.id === "wirbelofen");
    expect(wirbelofen?.detailImages[1].fit ?? "cover").toBe("cover");

    expect(featuredProjectMetrics).toHaveLength(2);
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

  it("enthält die freigegebenen Unternehmens- und Kontaktdaten", () => {
    expect(siteConfig).toMatchObject({
      legalName: "Triumphbaugesellschaft UG",
      email: "info@triumph-baugesellschaft.de",
      phone: "+49 176 40076405",
      phoneHref: "+4917640076405",
      contactPerson: "Viktor Jakobi",
      contactRole: "Geschäftsführer",
      address: "Auf dem Jarten 6, 27607 Geestland",
      register: "Handelsregister: HRB 211.346",
      taxId: "Steuernummer: 49/200/32853",
      taxOffice: "Finanzamt Wesermünde",
      bankName: "Oldenburgische Landesbank AG",
      iban: "DE29 2802 0050 1022 4707 00",
      bic: "OLBODEH2XXX",
      responsible: "Viktor Jakobi, Geschäftsführer"
    });
  });
});
