import {
  Building2,
  CircleGauge,
  ClipboardCheck,
  Factory,
  HardHat,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap
} from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// next/link und die _next-Assets bekommen den basePath von Next automatisch,
// next/image mit `unoptimized` aber nicht. Lokale public/-Pfade daher hierueber ausgeben.
export function withBasePath(path: string) {
  return `${basePath}${path}`;
}

export const siteConfig = {
  name: "Vitja",
  // Solange die Seite auf GitHub Pages liegt, ist das die kanonische Adresse.
  // Bei einer eigenen Domain reicht es, NEXT_PUBLIC_SITE_URL im Build zu setzen.
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://simplydelegate.github.io/Vitja-Website",
  email: "info@vitja.de",
  phone: "+49 000 000000",
  address: "Musterstrasse 1, 00000 Musterstadt",
  description:
    "Industrielle Dienstleistungen, technische Projektunterstuetzung und verlaessliche Umsetzung fuer Betriebe mit anspruchsvollen Anlagen."
};

export const navItems = [
  { label: "Kunden", href: "#kunden" },
  { label: "Leistungen", href: "#leistungen" },
  { label: "Ueber uns", href: "#ueber-uns" },
  { label: "Kontakt", href: "#kontakt" }
];

export const services = [
  {
    title: "Industriemontage",
    description:
      "Montage, Umbau und Erweiterung technischer Anlagen mit eingespielten Teams und sauberer Baustellenkoordination.",
    icon: Factory
  },
  {
    title: "Wartung & Instandhaltung",
    description:
      "Planbare Serviceeinsaetze, vorbeugende Wartung und schnelle Stoerungsbehebung fuer produktionskritische Systeme.",
    icon: Wrench
  },
  {
    title: "Projektkoordination",
    description:
      "Schnittstellenmanagement zwischen Betrieb, Lieferanten und Gewerken, damit Termine und Abnahmen belastbar bleiben.",
    icon: ClipboardCheck
  },
  {
    title: "Anlagenoptimierung",
    description:
      "Analyse bestehender Prozesse, technische Verbesserungen und Umsetzung direkt im laufenden Betrieb.",
    icon: CircleGauge
  },
  {
    title: "Sicherheitsbegleitung",
    description:
      "Arbeitsvorbereitung, Unterweisungen und Dokumentation fuer sichere Einsaetze in sensiblen Industrieumgebungen.",
    icon: ShieldCheck
  },
  {
    title: "Elektro-nahe Arbeiten",
    description:
      "Unterstuetzung bei technischen Installationen, Kabelwegen und vorbereitenden Arbeiten nach Projektvorgabe.",
    icon: Zap
  },
  {
    title: "Betriebsnahe Teams",
    description:
      "Flexible Fachkraefte fuer Spitzen, Stillstaende und Sonderprojekte mit klarem Ansprechpartner.",
    icon: HardHat
  },
  {
    title: "Qualitaetssicherung",
    description:
      "Pruefprotokolle, Fotodokumentation und strukturierte Uebergaben fuer transparente Projektergebnisse.",
    icon: Sparkles
  },
  {
    title: "Technische Beratung",
    description:
      "Pragmatische Einschaetzungen zu Machbarkeit, Ablauf und Ressourceneinsatz vor der Umsetzung.",
    icon: Building2
  }
];

export const clients = [
  { name: "Käefer", initials: "KÄ", logoSrc: withBasePath("/logos/kaefer.svg") },
  { name: "Bredo Werft", initials: "BW", logoSrc: withBasePath("/logos/bredo.png"), logoVariant: "dark" },
  { name: "G+H Isolierung", initials: "G+H", logoSrc: withBasePath("/logos/guh.png") },
  { name: "Weber Rohrleitungsbau", initials: "WR", logoSrc: withBasePath("/logos/weber.svg") }
];

export const stats = [
  { label: "Projektfokus", value: 100, suffix: "%" },
  { label: "Leistungsfelder", value: 9, suffix: "" },
  { label: "Partner", value: 4, suffix: "+" }
];

export const contactItems = [
  { label: "Telefon", value: siteConfig.phone, icon: Phone },
  { label: "E-Mail", value: siteConfig.email, icon: Mail },
  { label: "Standort", value: siteConfig.address, icon: MapPin }
];
