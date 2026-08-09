import type { LucideIcon } from "lucide-react";
import {
  Anvil,
  Blend,
  Boxes,
  Factory,
  Flame,
  Layers3,
  PanelsTopLeft,
  Ship,
  Wrench
} from "lucide-react";
import evidenceData from "@/data/evidence-registry.json";
import qualificationData from "@/data/qualifications.json";

export type SiteConfig = {
  name: string;
  legalName: string;
  domain: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: string;
  register: string;
  taxId: string;
  responsible: string;
  description: string;
  isDraft: boolean;
};

export type HeroSlide = { src: string; alt: string; focus: string };

export type Service = {
  id: string;
  title: string;
  short: string;
  detail: string;
  scope: string;
  proofPoints: string[];
  deliverables: string[];
  icon: LucideIcon;
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

export type ProjectCategory = "Rohrbau" | "GFK" | "Schweißen" | "Stahlbau" | "Integration" | "Instandsetzung";
export type ProjectMedia = { src: string; category: ProjectCategory; alt: string; caption: string; aspect: "landscape" | "portrait"; focus?: string };

const configuredDomain = process.env.NEXT_PUBLIC_SITE_URL ?? "https://preview.triumph-technical-services.de";

export const siteConfig: SiteConfig = {
  name: "Triumph Technical Services",
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? "Rechtsträger wird vor Veröffentlichung ergänzt",
  domain: configuredDomain,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@triumph-technical-services.de",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+49 (0) 000 000000",
  phoneHref: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF ?? "+49000000000",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "Unternehmensanschrift wird ergänzt",
  register: process.env.NEXT_PUBLIC_COMPANY_REGISTER ?? "Registerangaben werden ergänzt",
  taxId: process.env.NEXT_PUBLIC_COMPANY_TAX_ID ?? "Steuerangaben werden ergänzt",
  responsible: process.env.NEXT_PUBLIC_COMPANY_RESPONSIBLE ?? "Verantwortliche Person wird ergänzt",
  description: "Technische Projektleistungen für Industrie und Schiffbau: Rohrbau, GFK-Systeme, Instandsetzung, Schweißarbeiten und Systemintegration aus einer Hand koordiniert.",
  isDraft: !process.env.NEXT_PUBLIC_SITE_URL || !process.env.NEXT_PUBLIC_CONTACT_PHONE
};

export const navItems = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Qualifikationen", href: "/#qualifikationen" },
  { label: "Projekte", href: "/#projekte" },
  { label: "Vorgehen", href: "/#vorgehen" },
  { label: "Unternehmen", href: "/#unternehmen" },
  { label: "Kontakt", href: "/#kontakt" }
];

export const heroSlides: HeroSlide[] = [
  { src: "/media/hero/rohrsystem.webp", alt: "Montiertes Rohrsystem in einer industriellen Anlage", focus: "center 55%" },
  { src: "/media/hero/gfk-rohrbau.webp", alt: "Vollständige GFK-Rohrbaugruppe in der Werkstatt", focus: "center 48%" },
  { src: "/media/hero/systemintegration.webp", alt: "Integriertes Rohrsystem mit roten Armaturen", focus: "center 52%" }
];

export const services: Service[] = [
  {
    id: "rohrbau", title: "Rohrbau & Reparaturen", icon: Blend, requestValue: "Rohrbau & Reparaturen",
    short: "Anpassung, Montage und Reparatur von Rohrleitungen und Rohrbaugruppen.",
    detail: "Wir bearbeiten Rohrsysteme projektbezogen – von der Bestandsaufnahme über die Vorbereitung bis zur Montage und dokumentierten Übergabe.",
    scope: "Werkstoff, Medium, Druckbereich und Prüfumfang werden vor der Ausführung abgeglichen.",
    proofPoints: ["Projektbezogene Personal- und Verfahrensnachweise", "Material- und Prüfanforderungen nach Vorgabe"],
    deliverables: ["Montage-/Übergabeprotokoll", "Vereinbarte Material- und Prüfnachweise"]
  },
  {
    id: "stahlbau", title: "Stahlbau & Reparaturen", icon: Anvil, requestValue: "Stahlbau & Reparaturen",
    short: "Pragmatische Lösungen für Stahlkonstruktionen, Bauteile und Reparaturen im Bestand.",
    detail: "Bestehende Konstruktionen werden geprüft, vorbereitet, instandgesetzt oder passgenau ergänzt – abgestimmt auf Einbausituation und Betriebsablauf.",
    scope: "Ausführungsklasse, Werkstoff und statische beziehungsweise konstruktive Vorgaben werden auftragsbezogen geklärt.",
    proofPoints: ["Schweißtechnische Nachweise passend zum Auftrag", "DIN EN 1090 nur im belegten Geltungsbereich"],
    deliverables: ["Ausführungs-/Fotodokumentation", "Prüf- und Materialunterlagen nach Vereinbarung"]
  },
  {
    id: "anlageninstandsetzung", title: "Anlageninstandsetzung", icon: Factory, requestValue: "Anlageninstandsetzung",
    short: "Geplante und kurzfristige Arbeiten an technischen Anlagen und Komponenten.",
    detail: "Wir koordinieren Instandsetzungsarbeiten im Bestand mit kurzen Wegen, klaren Zuständigkeiten und Rücksicht auf laufende Prozesse.",
    scope: "Zugang, Freigaben, Schnittstellen und Auswirkungen auf den Betrieb werden vor Beginn gemeinsam festgelegt.",
    proofPoints: ["Gefährdungs- und Freigabeanforderungen", "Qualifikation passend zu Tätigkeit und Einsatzort"],
    deliverables: ["Status und Restpunkte", "Geordnete Übergabe mit vereinbartem Nachweisumfang"]
  },
  {
    id: "schweissarbeiten", title: "Schweißarbeiten", icon: Flame, requestValue: "Schweißarbeiten",
    short: "Projektbezogene Schweißarbeiten für Neubau, Umbau und Reparatur.",
    detail: "Werkstoff, Verfahren, Position, Qualitätsanforderung und Prüfumfang werden vor dem Einsatz abgeglichen und nachvollziehbar festgelegt.",
    scope: "Qualifikationen gelten nie pauschal: Der tatsächliche Geltungsbereich wird anhand Ihrer Spezifikation geprüft.",
    proofPoints: ["Schweißer-/Bedienerqualifikation", "WPS/WPQR und Prüfanforderungen, soweit gefordert"],
    deliverables: ["Naht- und Prüfunterlagen nach Vorgabe", "Rückverfolgbare Dokumentation im vereinbarten Umfang"]
  },
  {
    id: "blechherstellung", title: "Blechherstellung", icon: PanelsTopLeft, requestValue: "Blechherstellung",
    short: "Projektbezogene Blechbauteile als Bestandteil einer koordinierten Gesamtlösung.",
    detail: "Benötigte Blechbauteile werden nach Zeichnung, Aufmaß und Einbausituation organisiert und in den Projektablauf integriert – aus einer Hand koordiniert.",
    scope: "Material, Toleranzen, Oberflächen und Schnittstellen werden vor Beauftragung eindeutig abgestimmt.",
    proofPoints: ["Geprüfte Projektanforderungen", "Geregelte Einbindung qualifizierter Ausführungspartner"],
    deliverables: ["Bauteile nach freigegebener Vorgabe", "Materialunterlagen nach Vereinbarung"]
  },
  {
    id: "gfk", title: "GFK-Instandsetzung & GFK-Rohr-/Systembau", icon: Layers3, requestValue: "GFK-Instandsetzung & GFK-Rohr-/Systembau",
    short: "Herstellung, Verbindung und Reparatur von GFK-Rohrleitungen und Systembauteilen.",
    detail: "Wir fertigen und montieren GFK-Baugruppen, bearbeiten Verbindungen und setzen beschädigte Komponenten projektbezogen instand.",
    scope: "Harzsystem, Laminataufbau, Medium, Temperatur und Prüfanforderungen werden vor Ausführung festgelegt.",
    proofPoints: ["DVS-/Systemqualifikation passend zum Auftrag", "Material-, Verarbeitungs- und Aushärtungsanforderungen"],
    deliverables: ["Verarbeitungs-/Fotodokumentation", "Prüf- und Materialunterlagen nach Vereinbarung"]
  },
  {
    id: "systemintegration", title: "Systemeinbau & Integration", icon: Boxes, requestValue: "Systemeinbau & Integration",
    short: "Einbau technischer Systeme in komplexen, räumlich begrenzten Umgebungen.",
    detail: "Komponenten, Rohrleitungen und Armaturen werden aufeinander abgestimmt, eingebaut und in vorhandene Strukturen integriert.",
    scope: "Schnittstellen, Zugänge, Montagefolge und Freigabepunkte werden vor dem Einbau geklärt.",
    proofPoints: ["Projektbezogene Montagequalifikation", "Integration in kundenseitige Sicherheitsprozesse"],
    deliverables: ["Montage- und Restpunktestatus", "Dokumentierte Übergabe"]
  },
  {
    id: "industrieisolierung", title: "Industrieisolierung", icon: Wrench, requestValue: "Industrieisolierung",
    short: "Koordinierte Isolierarbeiten an technischen Anlagen und Leitungssystemen.",
    detail: "Isolierarbeiten werden passend zu Temperatur, Feuchte, Korrosionsschutz, Zugänglichkeit und betrieblichem Ablauf eingeordnet.",
    scope: "DIN 4140, projektspezifische AGI-Vorgaben und Gefahrstoffanforderungen werden nur im passenden Einsatzfall angewendet.",
    proofPoints: ["Ausführungskompetenz passend zum Dämmsystem", "TRGS-Nachweise nur bei entsprechendem Material"],
    deliverables: ["Ausführungs-/Fotodokumentation", "Materialangaben nach Vereinbarung"]
  },
  {
    id: "schiffsausbau", title: "Schiffsausbau", icon: Ship, requestValue: "Schiffsausbau",
    short: "Technische Ausbau- und Integrationsarbeiten für maritime Einsatzbereiche.",
    detail: "Wir verbinden handwerkliche Ausführung mit enger Abstimmung der Gewerke – insbesondere dort, wo Platz, Terminlage und Bestand besondere Anforderungen stellen.",
    scope: "Flaggen-, Werft- und Klassifikationsanforderungen werden vor klasserelevanten Arbeiten verbindlich abgeglichen.",
    proofPoints: ["Verfahrens-/Personalnachweise nach Projektvorgabe", "Klassifikationsfreigaben nur im belegten Umfang"],
    deliverables: ["Ausführungs- und Übergabestatus", "Klassen-/Prüfunterlagen nach Anforderung"]
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

export const caseStudies: CaseStudy[] = [
  { id: "gfk-system", title: "GFK-Rohrsystem im Bestand", category: "GFK · Integration", image: "/media/projects/systemeinbau-rohrleitung.webp", alt: "Vertikal integrierte GFK-Rohrleitung mit Armaturen", task: "GFK-Rohrleitung und Armaturen in eine vorhandene Einbausituation integrieren.", constraints: "Begrenzter Bauraum, vorhandene Anschlusspunkte und mehrere technische Schnittstellen.", execution: "Montagefolge und Anschlüsse wurden projektbezogen vorbereitet und auf die Bestandssituation abgestimmt.", quality: "Prüf- und Dokumentationsumfang wird anhand der technischen Vorgabe vor Ausführung festgelegt.", result: "Integrierter Systemstand mit nachvollziehbarer Übergabe ohne Nennung vertraulicher Kunden- oder Standortdaten." },
  { id: "rohrsystem", title: "Rohrsystem mit Armaturen", category: "Rohrbau · Systemeinbau", image: "/media/projects/systemeinbau-armaturen.webp", alt: "Rohrleitungen und rote Armaturen in engem Einbauraum", task: "Rohrleitungen und Armaturen in einem anspruchsvollen Einbauraum zusammenführen.", constraints: "Enge Zugänge, bestehende Komponenten und Abstimmung mit angrenzenden Gewerken.", execution: "Schnittstellen, Montagefolge und Zugänglichkeit wurden als zusammenhängende Aufgabe betrachtet.", quality: "Änderungen und Restpunkte werden im Projektverlauf transparent dokumentiert.", result: "Geordnet integriertes System und klarer Leistungsstand für die anschließende Übergabe." },
  { id: "instandsetzung", title: "Reparaturvorbereitung im Bestand", category: "Instandsetzung · Schweißen", image: "/media/projects/instandsetzung-schweissarbeit.webp", alt: "Vorbereitete Reparaturstelle an einer industriellen Rohrleitung", task: "Eine Reparaturstelle an einer bestehenden Rohrleitung für die weitere Bearbeitung vorbereiten.", constraints: "Bestandsgeometrie, Zugänglichkeit und betriebliche Freigaben bestimmen das Vorgehen.", execution: "Anforderung, Werkstoff und geplanter Prüfumfang werden vor der eigentlichen Reparatur abgeglichen.", quality: "Personal- und Verfahrensnachweise werden passend zur freigegebenen Reparaturaufgabe vorgelegt.", result: "Vorbereiteter, abgestimmter Reparaturablauf mit dokumentierten Freigabepunkten." }
];

export const projectMedia: ProjectMedia[] = [
  { src: "/media/projects/anlageninstandsetzung.webp", category: "Instandsetzung", alt: "Instandsetzungsarbeiten an einem industriellen Behälter mit Rohrleitungen", caption: "Anlageninstandsetzung im Bestand", aspect: "portrait", focus: "center" },
  { src: "/media/hero/rohrsystem.webp", category: "Rohrbau", alt: "Montiertes Rohrleitungssystem in einer technischen Anlage", caption: "Montiertes Rohrsystem", aspect: "landscape" },
  { src: "/media/projects/gfk-flansch.webp", category: "GFK", alt: "Vorbereitete GFK-Flanschbauteile", caption: "GFK-Bauteile für die weitere Verarbeitung", aspect: "portrait" },
  { src: "/media/projects/rohrbau-fertigung.webp", category: "Rohrbau", alt: "Gefertigte Rohrbaugruppe mit roter Beschichtung", caption: "Rohrbaugruppe nach Projektvorgabe", aspect: "landscape" },
  { src: "/media/projects/schweissnaht.webp", category: "Schweißen", alt: "Nahaufnahme einer gleichmäßigen Schweißnaht", caption: "Schweißverbindung im Detail", aspect: "portrait" },
  { src: "/media/projects/stahlkonstruktion.webp", category: "Stahlbau", alt: "Gefertigte rechteckige Stahlkonstruktion", caption: "Stahlkonstruktion für den Einbau", aspect: "landscape" },
  { src: "/media/projects/systemeinbau-armaturen.webp", category: "Integration", alt: "Rohrleitungen und rote Armaturen in engem Einbauraum", caption: "Systemeinbau unter anspruchsvollen Platzverhältnissen", aspect: "portrait" },
  { src: "/media/projects/gfk-reparatur.webp", category: "GFK", alt: "Reparierte GFK-Rohrleitung an einer Bodendurchführung", caption: "GFK-Instandsetzung im Bestand", aspect: "portrait" },
  { src: "/media/projects/rohrkomponenten.webp", category: "Rohrbau", alt: "Vorbereitete Edelstahl-Rohrkomponenten", caption: "Komponenten für Rohrbau und Reparatur", aspect: "portrait" },
  { src: "/media/projects/instandsetzung-schweissarbeit.webp", category: "Schweißen", alt: "Vorbereitete Reparaturstelle an einer industriellen Rohrleitung", caption: "Vorbereitung einer Reparaturschweißung", aspect: "landscape" },
  { src: "/media/projects/gfk-verbindung.webp", category: "GFK", alt: "Detail einer GFK-Rohrverbindung", caption: "Verarbeitung einer GFK-Verbindung", aspect: "portrait" },
  { src: "/media/projects/stahlreparatur.webp", category: "Stahlbau", alt: "Arbeitsbereich innerhalb einer Stahlkonstruktion", caption: "Reparatur an einer Stahlkonstruktion", aspect: "portrait" },
  { src: "/media/projects/systemeinbau-rohrleitung.webp", category: "Integration", alt: "Vertikal integrierte GFK-Rohrleitung mit Armaturen", caption: "Integration von Rohrleitung und Armaturen", aspect: "portrait" },
  { src: "/media/projects/metallbearbeitung.webp", category: "Schweißen", alt: "Fachkraft bei der Metallbearbeitung", caption: "Vorbereitung für die fachgerechte Verbindung", aspect: "portrait" },
  { src: "/media/projects/rohrleitung-edelstahl.webp", category: "Rohrbau", alt: "Vormontierte Edelstahl-Rohrleitung", caption: "Vormontierte Edelstahl-Rohrleitung", aspect: "portrait" }
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
