import evidenceData from "@/data/evidence-registry.json";
import featuredProjectMetricData from "@/data/featured-project-metrics.json";
import qualificationData from "@/data/qualifications.json";

export type SiteConfig = {
  name: string;
  legalName: string;
  domain: string;
  email: string;
  phone: string;
  phoneHref: string;
  contactPerson: string;
  contactRole: string;
  address: string;
  register: string;
  taxId: string;
  taxOffice: string;
  bankName: string;
  iban: string;
  bic: string;
  responsible: string;
  description: string;
  isDraft: boolean;
};

export type HeroSlide = { src: string; alt: string; focus: string };

export type ServiceImage = { src: string; alt: string; focus: string };

export type Service = {
  id: string;
  title: string;
  short: string;
  image?: ServiceImage;
  gallery?: [ServiceImage, ServiceImage, ...ServiceImage[]];
  requestValue: string;
};

export type QualificationStatus = "verified" | "on-request" | "project-specific";

export type Qualification = {
  id: string;
  category: "Unternehmen" | "Schweißtechnik" | "GFK" | "Sicherheit" | "Spezialanforderungen";
  standard: string;
  level?: string;
  scope: string;
  issuer?: string;
  certificateNumber?: string;
  validFrom?: string;
  validUntil?: string;
  serviceIds: string[];
  status: QualificationStatus;
  evidenceId?: string;
  publicVisibility: "summary" | "on-request" | "private";
};

export type EvidenceRegistryEntry = {
  id: string;
  legalHolder: string;
  sourceFile: string;
  reviewedAt: string;
  reviewedBy: string;
  approved: boolean;
};

export type QualificationGroup = {
  category: Qualification["category"];
  title: string;
  intro: string;
  areas: string[];
  note: string;
};

export type ProcessCommitment = {
  number: string;
  title: string;
  customerRisk: string;
  commitment: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  task: string;
  constraints: string;
  execution: string;
  quality: string;
  result: string;
};

export type FeaturedProjectImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
};

export type FeaturedProjectMetric = {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
};

export type FeaturedProjectMetricSet = {
  projectId: string;
  status: "placeholder" | "verified";
  items: [FeaturedProjectMetric, FeaturedProjectMetric, FeaturedProjectMetric];
};

export type FeaturedProject = {
  id: string;
  category: string;
  title: string;
  description: string;
  metrics: FeaturedProjectMetricSet;
  leadImage: FeaturedProjectImage;
  detailImages: [FeaturedProjectImage, FeaturedProjectImage];
};

export type ProjectCategory = "Industrieisolierung" | "Rohrbau" | "GFK" | "Schweißen" | "Stahlbau" | "Integration" | "Instandsetzung";
export type ProjectMedia = { src: string; category: ProjectCategory; alt: string; caption: string; layout: "standard" | "wide" | "tall"; focus?: string };

const configuredDomain = process.env.NEXT_PUBLIC_SITE_URL ?? "https://preview.triumph-technical-services.de";

export const siteConfig: SiteConfig = {
  name: "Triumph Technical Services",
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? "Triumphbaugesellschaft UG",
  domain: configuredDomain,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@triumph-baugesellschaft.de",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+49 176 40076405",
  phoneHref: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF ?? "+4917640076405",
  contactPerson: "Viktor Jakobi",
  contactRole: "Geschäftsführer",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "Auf dem Jarten 6, 27607 Geestland",
  register: process.env.NEXT_PUBLIC_COMPANY_REGISTER ?? "Handelsregister: HRB 211.346",
  taxId: process.env.NEXT_PUBLIC_COMPANY_TAX_ID ?? "Steuernummer: 49/200/32853",
  taxOffice: process.env.NEXT_PUBLIC_COMPANY_TAX_OFFICE ?? "Finanzamt Wesermünde",
  bankName: process.env.NEXT_PUBLIC_COMPANY_BANK_NAME ?? "Oldenburgische Landesbank AG",
  iban: process.env.NEXT_PUBLIC_COMPANY_IBAN ?? "DE29 2802 0050 1022 4707 00",
  bic: process.env.NEXT_PUBLIC_COMPANY_BIC ?? "OLBODEH2XXX",
  responsible: process.env.NEXT_PUBLIC_COMPANY_RESPONSIBLE ?? "Viktor Jakobi, Geschäftsführer",
  description: "Technische Projektleistungen für Industrie und Schiffbau: Rohrbau, GFK-Systeme, Instandsetzung, Schweißarbeiten und Systemintegration aus einer Hand koordiniert.",
  isDraft: !process.env.NEXT_PUBLIC_SITE_URL || !process.env.NEXT_PUBLIC_CONTACT_PHONE
};

export const navItems = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Projekte", href: "/#projektbeispiele" },
  { label: "Kontakt", href: "/#kontakt" }
];

export const heroSlides: HeroSlide[] = [
  { src: "/media/hero/rohrsystem.webp", alt: "Montiertes Rohrsystem in einer industriellen Anlage", focus: "center 55%" },
  { src: "/media/hero/gfk-rohrbau.webp", alt: "Vollständige GFK-Rohrbaugruppe in der Werkstatt", focus: "center 48%" },
  { src: "/media/hero/systemintegration.webp", alt: "Integriertes Rohrsystem mit roten Armaturen", focus: "center 52%" }
];

export const services: Service[] = [
  {
    id: "industrieisolierung", title: "Industrieisolierung", requestValue: "Industrieisolierung",
    gallery: [
      {
        src: "/media/services/industrieisolierung/industrieisolierung-blechmantel-formteil.webp",
        alt: "Segmentierte metallische Ummantelung an einem großformatigen Rohrbogen",
        focus: "center 50%"
      },
      {
        src: "/media/services/industrieisolierung/industrieisolierung-uebergang-daemmung-blech.webp",
        alt: "Übergang von Mineralwolldämmung zu metallischer Rohrverkleidung",
        focus: "center 50%"
      },
      {
        src: "/media/services/industrieisolierung/industrieisolierung-rohrleitung-behaelter.webp",
        alt: "Metallisch ummantelte Rohrleitung vor einem isolierten Industriebehälter",
        focus: "center 50%"
      },
      {
        src: "/media/services/industrieisolierung/industrieisolierung-rohrbogen-montagebereich.webp",
        alt: "Segmentierter Blechmantel an einem Rohrbogen über einer Arbeitsbühne",
        focus: "center 50%"
      },
      {
        src: "/media/services/industrieisolierung/industrieisolierung-luftkanal-folienmantel.webp",
        alt: "Folienummantelte Luftkanäle und Formteile in einer technischen Anlage",
        focus: "center 50%"
      }
    ],
    short: "Koordinierte Isolierarbeiten an technischen Anlagen und Leitungssystemen.",
  },
  {
    id: "rohrbau", title: "Rohrbau & Reparaturen", requestValue: "Rohrbau & Reparaturen",
    gallery: [
      {
        src: "/media/services/rohrbau/rohrbau-fertigungskomponenten.webp",
        alt: "Vorgefertigte Rohrleitungen und Flanschbauteile in einer Werkstatt",
        focus: "center 52%"
      },
      {
        src: "/media/projects/rohrbau-fertigung.webp",
        alt: "Gefertigte Rohrbaugruppen mit Flanschverbindungen in einer Werkstatt",
        focus: "center 55%"
      },
      {
        src: "/media/services/rohrbau/rohrbau-anlagenbestand.webp",
        alt: "Metallisch ummanteltes Rohrleitungssystem in einer Industrieanlage",
        focus: "center 48%"
      }
    ],
    short: "Anpassung, Montage und Reparatur von Rohrleitungen und Rohrbaugruppen.",
  },
  {
    id: "gfk", title: "GFK-Instandsetzung & GFK-Rohr-/Systembau", requestValue: "GFK-Instandsetzung & GFK-Rohr-/Systembau",
    gallery: [
      {
        src: "/media/services/gfk/gfk-sammelleitung-fertigung.webp",
        alt: "Großformatige GFK-Rohrbaugruppe mit mehreren Anschlüssen während der Fertigung",
        focus: "center 48%"
      },
      {
        src: "/media/projects/gfk-rohrbaugruppe.webp",
        alt: "GFK-Rohrbaugruppe während der Fertigung",
        focus: "center 35%"
      },
      {
        src: "/media/services/gfk/gfk-flanschverbindung-detail.webp",
        alt: "Detail einer passgenau ausgeführten GFK-Flanschverbindung",
        focus: "center 50%"
      }
    ],
    short: "Herstellung, Verbindung und Reparatur von GFK-Rohrleitungen und Systembauteilen.",
  },
  {
    id: "systemintegration", title: "Systemeinbau & Integration", requestValue: "Systemeinbau & Integration",
    image: { src: "/media/projects/systemeinbau-armaturen.webp", alt: "Integriertes Rohrsystem mit Armaturen in engem Bauraum", focus: "center 46%" },
    short: "Einbau technischer Systeme in komplexen, räumlich begrenzten Umgebungen.",
  },
  {
    id: "stahlbau", title: "Stahlbau & Reparaturen", requestValue: "Stahlbau & Reparaturen",
    image: { src: "/media/projects/stahlkonstruktion.webp", alt: "Gefertigte und beschichtete Stahlkonstruktion in einer Werkstatt", focus: "center 45%" },
    short: "Pragmatische Lösungen für Stahlkonstruktionen, Bauteile und Reparaturen im Bestand.",
  },
  {
    id: "anlageninstandsetzung", title: "Anlageninstandsetzung", requestValue: "Anlageninstandsetzung",
    gallery: [
      {
        src: "/media/projects/anlageninstandsetzung.webp",
        alt: "Technische Anlage mit Behälter, Rohrleitungen und Armaturen",
        focus: "center 42%"
      },
      {
        src: "/media/services/anlageninstandsetzung/anlageninstandsetzung-aggregat-arbeitsbereich.webp",
        alt: "Technische Anlagenkomponente mit Rohranschlüssen im Wartungsbereich",
        focus: "center 50%"
      },
      {
        src: "/media/services/anlageninstandsetzung/anlageninstandsetzung-ventilbank.webp",
        alt: "Ventilbank mit mehreren Handarmaturen in einer technischen Anlage",
        focus: "center 48%"
      }
    ],
    short: "Geplante und kurzfristige Arbeiten an technischen Anlagen und Komponenten.",
  },
  {
    id: "schweissarbeiten", title: "Schweißarbeiten", requestValue: "Schweißarbeiten",
    gallery: [
      {
        src: "/media/projects/schweissnaht.webp",
        alt: "Gleichmäßige Schweißnaht an einem Rohrbauteil",
        focus: "center 50%"
      },
      {
        src: "/media/services/schweissarbeiten/schweissnaht-rohrabzweig.webp",
        alt: "Umlaufende Schweißnähte an einem Rohrabzweig aus Edelstahl",
        focus: "center 50%"
      },
      {
        src: "/media/services/schweissarbeiten/schweissnaht-flansch-detail.webp",
        alt: "Mehrlagige Schweißnähte an einem Rohrflansch",
        focus: "center 50%"
      }
    ],
    short: "Projektbezogene Schweißarbeiten für Neubau, Umbau und Reparatur.",
  },
  {
    id: "blechherstellung", title: "Blechvorrichtungen", requestValue: "Blechvorrichtungen",
    gallery: [
      {
        src: "/media/services/blechvorrichtungen/blechvorrichtung-zugangsklappen.webp",
        alt: "Metallische Blechvorrichtung mit passgenauen Zugangsklappen an einer Industrieanlage",
        focus: "center 50%"
      },
      {
        src: "/media/services/blechvorrichtungen/blechvorrichtung-frontansicht.webp",
        alt: "Frontansicht einer segmentierten Blechvorrichtung mit Wartungsöffnungen",
        focus: "center 50%"
      }
    ],
    short: "Projektbezogene Blechvorrichtungen und Verkleidungen als Bestandteil einer koordinierten Gesamtlösung.",
  },
  {
    id: "schiffsausbau", title: "Schiffsausbau", requestValue: "Schiffsausbau",
    image: {
      src: "/media/services/schiffsausbau/schiffsausbau-rohrsystem-montage.webp",
      alt: "Rohrleitungssystem mit Armaturen im technisch ausgebauten Schiffsbereich",
      focus: "center 50%"
    },
    short: "Technische Ausbau- und Integrationsarbeiten für maritime Einsatzbereiche.",
  }
];

export const processCommitments: ProcessCommitment[] = [
  { number: "01", title: "Ein Verantwortlicher", customerRisk: "Unklare Zuständigkeiten und verlorene Informationen", commitment: "Ein fester Ansprechpartner führt technische Abstimmungen, Termine und Schnittstellen zusammen." },
  { number: "02", title: "Änderungen nur nach Abstimmung", customerRisk: "Überraschende Zusatzarbeiten und Kosten", commitment: "Abweichungen im Bestand werden transparent gemeldet. Auswirkungen werden vor der weiteren Ausführung abgestimmt." },
  { number: "03", title: "Qualifikation passend zum Auftrag", customerRisk: "Pauschale Zertifikate ohne passenden Geltungsbereich", commitment: "Personal, Verfahren und Prüfungen werden nach Werkstoff, Einsatzbereich und Projektanforderung ausgewählt." },
  { number: "04", title: "Rücksicht auf den Betrieb", customerRisk: "Unnötige Stillstände und Behinderungen", commitment: "Arbeitsbereiche, Freigaben und Schnittstellen werden vor Beginn gemeinsam geklärt." },
  { number: "05", title: "Nachvollziehbare Qualität", customerRisk: "Fehlende Unterlagen nach Projektende", commitment: "Vereinbarte Material-, Fertigungs- und Prüfunterlagen werden während der Ausführung geführt." },
  { number: "06", title: "Geordnete Übergabe", customerRisk: "Offene Restpunkte und unklarer Leistungsstand", commitment: "Ergebnisse, Restpunkte und übergebene Dokumente werden nachvollziehbar festgehalten." }
];

export const qualificationGroups: QualificationGroup[] = [
  { category: "Unternehmen", title: "Lieferantenfähigkeit", intro: "Unternehmens-, Versicherungs- und Managementnachweise für eine zügige Präqualifikation.", areas: ["Rechtsträger & Ansprechpartner", "Haftpflicht- und BG-Nachweise", "Qualitäts-, Umwelt- und Arbeitsschutzmanagement"], note: "Vollständige Unterlagen stellen wir nach Legitimation auf Anfrage bereit." },
  { category: "Schweißtechnik", title: "Schweißtechnische Eignung", intro: "Der Geltungsbereich wird anhand von Werkstoff, Verfahren, Position und Bauteilanforderung geprüft.", areas: ["Schweißer-/Bedienerqualifikationen", "Schweißaufsicht und Verfahrensunterlagen", "Prüf- und Materialdokumentation"], note: "Norm, Stufe und Laufzeit werden erst nach Prüfung der Originalnachweise veröffentlicht." },
  { category: "GFK", title: "GFK & Kunststoffe", intro: "Qualifikation und Verarbeitungsanforderungen werden passend zu Materialsystem und Anwendung zugeordnet.", areas: ["Laminier-/Klebequalifikation", "System- und Herstellerschulungen", "Chargen-, Verarbeitungs- und Prüfunterlagen"], note: "WHG-/Druckanforderungen werden nur im jeweils belegten Tätigkeitsbereich genannt." },
  { category: "Sicherheit", title: "Sicherer Fremdfirmeneinsatz", intro: "Die Ausführung wird in kundenseitige Sicherheits-, Freigabe- und Erlaubnisscheinprozesse integriert.", areas: ["Gefährdungs- und Arbeitsplanung", "Einsatzbezogene Unterweisungen", "Freimessen, PSAgA, Brandwache oder Rettung nach Bedarf"], note: "Personenbezogene Nachweise bleiben geschützt und werden projektbezogen vorgelegt." },
  { category: "Spezialanforderungen", title: "Projektabhängige Freigaben", intro: "Druck-, WHG-, Klassen- oder ATEX-Anforderungen sind nicht pauschal, sondern auftragsbezogen.", areas: ["Drucktragende Systeme", "Wassergefährdende Stoffe", "Werft-, Flaggen- und Klassifikationsvorgaben"], note: "Wir bestätigen die Anwendbarkeit vor Auftragsannahme und nicht erst auf der Baustelle." }
];

// Wird nach Prüfung der Originaldokumente befüllt. Ungeprüfte Zertifikate werden nicht als öffentliche Claims verwendet.
export const qualifications = qualificationData as Qualification[];
export const evidenceRegistry = evidenceData as EvidenceRegistryEntry[];
export const featuredProjectMetrics = featuredProjectMetricData as FeaturedProjectMetricSet[];

function metricsFor(projectId: string): FeaturedProjectMetricSet {
  const metrics = featuredProjectMetrics.find((entry) => entry.projectId === projectId);
  if (!metrics) throw new Error(`Kennzahlen für Projekt ${projectId} fehlen.`);
  return metrics;
}

export const caseStudies: CaseStudy[] = [
  { id: "gfk-system", title: "GFK-Rohrsystem im Bestand", category: "GFK · Integration", image: "/media/projects/systemeinbau-rohrleitung.webp", alt: "Vertikal integrierte GFK-Rohrleitung mit Armaturen", task: "GFK-Rohrleitung und Armaturen in eine vorhandene Einbausituation integrieren.", constraints: "Begrenzter Bauraum, vorhandene Anschlusspunkte und mehrere technische Schnittstellen.", execution: "Montagefolge und Anschlüsse wurden projektbezogen vorbereitet und auf die Bestandssituation abgestimmt.", quality: "Prüf- und Dokumentationsumfang wird anhand der technischen Vorgabe vor Ausführung festgelegt.", result: "Integrierter Systemstand mit nachvollziehbarer Übergabe ohne Nennung vertraulicher Kunden- oder Standortdaten." },
  { id: "rohrsystem", title: "Rohrsystem mit Armaturen", category: "Rohrbau · Systemeinbau", image: "/media/projects/systemeinbau-armaturen.webp", alt: "Rohrleitungen und rote Armaturen in engem Einbauraum", task: "Rohrleitungen und Armaturen in einem anspruchsvollen Einbauraum zusammenführen.", constraints: "Enge Zugänge, bestehende Komponenten und Abstimmung mit angrenzenden Gewerken.", execution: "Schnittstellen, Montagefolge und Zugänglichkeit wurden als zusammenhängende Aufgabe betrachtet.", quality: "Änderungen und Restpunkte werden im Projektverlauf transparent dokumentiert.", result: "Geordnet integriertes System und klarer Leistungsstand für die anschließende Übergabe." },
  { id: "instandsetzung", title: "Reparaturvorbereitung im Bestand", category: "Instandsetzung · Schweißen", image: "/media/projects/instandsetzung-schweissarbeit.webp", alt: "Vorbereitete Reparaturstelle an einer industriellen Rohrleitung", task: "Eine Reparaturstelle an einer bestehenden Rohrleitung für die weitere Bearbeitung vorbereiten.", constraints: "Bestandsgeometrie, Zugänglichkeit und betriebliche Freigaben bestimmen das Vorgehen.", execution: "Anforderung, Werkstoff und geplanter Prüfumfang werden vor der eigentlichen Reparatur abgeglichen.", quality: "Personal- und Verfahrensnachweise werden passend zur freigegebenen Reparaturaufgabe vorgelegt.", result: "Vorbereiteter, abgestimmter Reparaturablauf mit dokumentierten Freigabepunkten." }
];

export const featuredProjects: FeaturedProject[] = [
  {
    id: "wirbelofen",
    category: "Industrieisolierung · Blechverkleidung",
    title: "Isolierung und Blechmantel am Wirbelofen",
    description: "Isolierung und segmentierte Blechverkleidung als definiertes Leistungspaket – montagegerecht für den Einhub vorbereitet.",
    metrics: metricsFor("wirbelofen"),
    leadImage: {
      src: "/media/featured-projects/wirbelofen-anlagenzustand.webp",
      alt: "Wirbelofen mit ausgeführter Isolierung und metallischer Blechverkleidung"
    },
    detailImages: [
      {
        src: "/media/featured-projects/wirbelofen-kraneinhub.webp",
        alt: "Kran hebt den isolierten und metallisch verkleideten Wirbelofen in den Anlagenbestand"
      },
      {
        src: "/media/featured-projects/wirbelofen-gesamtansicht.webp",
        alt: "Gesamtansicht des eingerüsteten Wirbelofens während der Isolier- und Blechverkleidungsarbeiten"
      }
    ]
  },
  {
    id: "rohrisolierung",
    category: "Industrieisolierung · Produktionsunterstützung",
    title: "Rohrisolierung im Anlagenbestand",
    description: "Dämmung und metallische Ummantelung von Leitungen, Bögen und Übergängen als geschlossenes Ausführungspaket.",
    metrics: metricsFor("rohrisolierung"),
    leadImage: {
      src: "/media/featured-projects/rohrisolierung-anlagenkontext.webp",
      alt: "Metallisch ummantelte Rohrleitungen in einer Produktionsanlage"
    },
    detailImages: [
      {
        src: "/media/featured-projects/rohrisolierung-formteil.webp",
        alt: "Gedämmtes Rohrformteil mit segmentierter Metallummantelung"
      },
      {
        src: "/media/featured-projects/rohrisolierung-rohrverlauf.webp",
        alt: "Parallel geführte, metallisch ummantelte Rohrleitungen in einer Industriehalle"
      }
    ]
  }
];

export const projectMedia: ProjectMedia[] = [
  { src: "/media/projects/anlageninstandsetzung.webp", category: "Instandsetzung", alt: "Instandsetzungsarbeiten an einem industriellen Behälter mit Rohrleitungen", caption: "Anlageninstandsetzung im Bestand", layout: "wide", focus: "center" },
  { src: "/media/hero/rohrsystem.webp", category: "Rohrbau", alt: "Montiertes Rohrleitungssystem in einer technischen Anlage", caption: "Montiertes Rohrsystem", layout: "standard" },
  { src: "/media/projects/gfk-flansch.webp", category: "GFK", alt: "Vorbereitete GFK-Flanschbauteile", caption: "GFK-Bauteile für die weitere Verarbeitung", layout: "tall" },
  { src: "/media/projects/gallery/industrieisolierung-behaelter-daemmung.webp", category: "Industrieisolierung", alt: "Großbehälter mit montierter Mineralwolldämmung im Anlagenbestand", caption: "Behälterdämmung im Anlagenbestand", layout: "tall", focus: "center 48%" },
  { src: "/media/projects/schweissnaht.webp", category: "Schweißen", alt: "Nahaufnahme einer gleichmäßigen Schweißnaht", caption: "Schweißverbindung im Detail", layout: "standard" },
  { src: "/media/projects/stahlkonstruktion.webp", category: "Stahlbau", alt: "Gefertigte rechteckige Stahlkonstruktion", caption: "Stahlkonstruktion für den Einbau", layout: "wide" },
  { src: "/media/projects/systemeinbau-armaturen.webp", category: "Integration", alt: "Rohrleitungen und rote Armaturen in engem Einbauraum", caption: "Systemeinbau unter anspruchsvollen Platzverhältnissen", layout: "standard" },
  { src: "/media/projects/gfk-reparatur.webp", category: "GFK", alt: "Reparierte GFK-Rohrleitung an einer Bodendurchführung", caption: "GFK-Instandsetzung im Bestand", layout: "standard" },
  { src: "/media/projects/gallery/industrieisolierung-matratzendaemmung.webp", category: "Industrieisolierung", alt: "Matratzendämmung an Rohrleitungen, Formteilen und einer Anlagenwand", caption: "Matratzendämmung an Leitungen und Formteilen", layout: "standard", focus: "center 48%" },
  { src: "/media/projects/rohrkomponenten.webp", category: "Rohrbau", alt: "Vorbereitete Edelstahl-Rohrkomponenten", caption: "Komponenten für Rohrbau und Reparatur", layout: "standard" },
  { src: "/media/projects/instandsetzung-schweissarbeit.webp", category: "Schweißen", alt: "Vorbereitete Reparaturstelle an einer industriellen Rohrleitung", caption: "Vorbereitung einer Reparaturschweißung", layout: "wide" },
  { src: "/media/projects/gfk-verbindung.webp", category: "GFK", alt: "Detail einer GFK-Rohrverbindung", caption: "Verarbeitung einer GFK-Verbindung", layout: "standard" },
  { src: "/media/projects/stahlreparatur.webp", category: "Stahlbau", alt: "Arbeitsbereich innerhalb einer Stahlkonstruktion", caption: "Reparatur an einer Stahlkonstruktion", layout: "standard" },
  { src: "/media/projects/gallery/industrieisolierung-anlagenkomponente.webp", category: "Industrieisolierung", alt: "Isolierte technische Anlagenkomponente mit metallischer Schutzummantelung", caption: "Isolierte Anlagenkomponente im Maschinenraum", layout: "standard", focus: "center 48%" },
  { src: "/media/projects/systemeinbau-rohrleitung.webp", category: "Integration", alt: "Vertikal integrierte GFK-Rohrleitung mit Armaturen", caption: "Integration von Rohrleitung und Armaturen", layout: "standard" },
  { src: "/media/projects/metallbearbeitung.webp", category: "Schweißen", alt: "Fachkraft bei der Metallbearbeitung", caption: "Vorbereitung für die fachgerechte Verbindung", layout: "standard" },
  { src: "/media/projects/gallery/rohrbau-montagearbeiten.webp", category: "Rohrbau", alt: "Vormontierte Rohrbaugruppe während der Montage- und Schweißarbeiten", caption: "Montagearbeiten an einer Rohrbaugruppe", layout: "wide", focus: "center 48%" },
  { src: "/media/projects/rohrleitung-edelstahl.webp", category: "Rohrbau", alt: "Vormontierte Edelstahl-Rohrleitung", caption: "Vormontierte Edelstahl-Rohrleitung", layout: "standard" }
];

export const processSteps = [
  { number: "01", title: "Bestand & Auftrag klären", text: "Anforderung, Bestand, Schnittstellen, Sicherheitsvorgaben und Terminrahmen werden gemeinsam geklärt.", checkpoint: "Freigabepunkt: belastbarer Leistungsrahmen", output: "Aufgaben- und Schnittstellenklärung" },
  { number: "02", title: "Ausführung freigeben", text: "Material, Verfahren, Qualifikationen, Prüfumfang und Montagefolge werden passend zur Einbausituation festgelegt.", checkpoint: "Freigabepunkt: technische und terminliche Abstimmung", output: "Vorbereiteter Ausführungsplan" },
  { number: "03", title: "Kontrolliert ausführen", text: "Die Ausführung erfolgt koordiniert und mit Rücksicht auf den Betrieb. Abweichungen werden vor der Fortsetzung abgestimmt.", checkpoint: "Kontrollpunkt: Status, Qualität und Änderungen", output: "Nachvollziehbarer Leistungsstand" },
  { number: "04", title: "Prüfen & übergeben", text: "Ergebnisse, vereinbarte Prüfungen, Restpunkte und Dokumente werden gemeinsam nachvollziehbar festgehalten.", checkpoint: "Abschluss: Prüfung und Restpunkteliste", output: "Geordnete Dokumentationsübergabe" }
];

export const faqItems = [
  { question: "Welche Zertifikate und Nachweise können Sie vorlegen?", answer: "Das hängt von Werkstoff, Verfahren und Einsatzbereich ab. Wir gleichen den benötigten Geltungsbereich mit den vorhandenen Unternehmens-, Personal- und Verfahrensnachweisen ab und stellen die passenden Unterlagen auf Anfrage bereit." },
  { question: "Wie gehen Sie mit Nachunternehmern oder Ausführungspartnern um?", answer: "Projektpartner werden nicht pauschal eingesetzt. Zuständigkeit, Qualifikation, Schnittstellen und geforderte Nachweise werden vor ihrem Einsatz geprüft und in die Projektsteuerung eingebunden." },
  { question: "Wie integrieren Sie sich in unsere Arbeitssicherheitsprozesse?", answer: "Gefährdungen, Unterweisungen, Freigaben und Erlaubnisscheine werden vor Arbeitsbeginn abgestimmt. Besondere Anforderungen wie Freimessen, Brandwache, PSAgA oder Rettung werden nur mit passender Qualifikation eingeplant." },
  { question: "Wie wird die Ausführung dokumentiert?", answer: "Der Umfang wird vorab vereinbart. Möglich sind Status- und Fotodokumentation, Material- und Prüfunterlagen, Naht- beziehungsweise Verfahrensnachweise sowie ein Übergabeprotokoll mit Restpunkten." },
  { question: "Übernehmen Sie klasserelevante Arbeiten im Schiffbau?", answer: "Solche Arbeiten werden erst nach Abgleich der Werft-, Flaggen- und Klassifikationsanforderungen bestätigt. Erforderliche Personal-, Verfahrens- und Freigabenachweise müssen zum konkreten Auftrag passen." },
  { question: "Sind auch kurzfristige Arbeiten möglich?", answer: "Kurzfristige Arbeiten sind nach Abstimmung möglich. Entscheidend sind Umfang, Zugänglichkeit, Materialverfügbarkeit, Sicherheitsvorgaben und die erforderlichen Qualifikationen." },
  { question: "Arbeiten Sie auch in bestehenden Anlagen?", answer: "Ja. Ablauf, Schutzmaßnahmen, Freigaben und Schnittstellen werden auf die jeweilige Betriebssituation abgestimmt, damit Beeinträchtigungen möglichst begrenzt bleiben." },
  { question: "In welchem Gebiet führen Sie Projekte aus?", answer: "Unser Schwerpunkt liegt in Norddeutschland. Abhängig von Umfang, Termin und Aufgabe übernehmen wir Einsätze auch bundesweit." }
];
