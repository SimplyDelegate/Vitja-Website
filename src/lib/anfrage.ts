import { services, siteConfig } from "./content";

/**
 * Anfrageformular – zentrale Konfiguration und testbare Logik.
 *
 * Die Pfadkarten in Stufe 1 werden aus `services` (content.ts) abgeleitet,
 * damit Leistungsraster und Formular nicht auseinanderlaufen. Hier stehen nur
 * die formular-spezifischen Texte und die reinen Prüf-/Zusammenfassungs-
 * funktionen; das Markup liegt in components/anfrage/.
 */

export type Pfad = {
  /** Wert des Checkbox-Inputs und stabiler Schlüssel der Leistung */
  id: string;
  /** Beschriftung der Auswahlkarte in Stufe 1 */
  label: string;
  /** Zweite Zeile der Auswahlkarte */
  hinweis: string;
};

export const pfade: Pfad[] = [
  ...services.map((service) => ({
    id: service.id,
    label: service.title,
    hinweis: service.short
  })),
  {
    id: "unklar",
    label: "Noch nicht sicher / Sonstiges",
    hinweis: "Wir ordnen Ihr Vorhaben gemeinsam ein."
  }
];

/** Akutpfad – läuft außerhalb der drei Stufen in einem eigenen Panel. */
export const stoerfall = {
  id: "stoerfall",
  label: "Störfall / Anlagenstillstand",
  submitLabel: "Störfall melden"
} as const;

export const pfadLabels: Record<string, string> = {
  ...Object.fromEntries(pfade.map((p) => [p.id, p.label])),
  [stoerfall.id]: stoerfall.label
};

/** Ordnet die CTA-Werte aus dem Leistungsraster einem Pfad zu. */
export const pfadFuerAnfrageWert: Record<string, string> = {
  ...Object.fromEntries(services.map((service) => [service.requestValue, service.id])),
  "Sonstiges / Beratung": "unklar"
};

/** Löst einen ?pfad=-Parameter oder CTA-Wert in einen gültigen Pfad auf. */
export function findePfad(kandidat: string | null | undefined): string | null {
  if (!kandidat) return null;
  if (kandidat === stoerfall.id) return stoerfall.id;
  if (pfade.some((p) => p.id === kandidat)) return kandidat;
  return pfadFuerAnfrageWert[kandidat] ?? null;
}

/** Beschriftungen für die Zusammenfassung nach dem Absenden. */
export const zeitrahmenLabels: Record<string, string> = {
  sofort: "so schnell wie möglich",
  wochen: "in den nächsten Wochen",
  stillstand: "zum geplanten Stillstand oder Revisionstermin",
  planung: "noch in der Planung, Termin offen"
};

export const stoerfallBetriebLabels: Record<string, string> = {
  stillstand: "Produktion steht",
  eingeschraenkt: "eingeschränkter Betrieb",
  laeuft: "läuft noch"
};

/** Upload-Grenzen (gelten nur, wenn der Upload per Env-Flag aktiv ist). */
export const upload = {
  maxDateien: 5,
  maxGesamtBytes: 12 * 1024 * 1024,
  akzeptiert: ".pdf,.dxf,.dwg,.step,.stp,.jpg,.jpeg,.png,.webp,.heic,.heif",
  hinweis: "PDF, DXF, DWG, STEP, JPG, PNG oder HEIC · max. 5 Dateien · zusammen 12 MB"
} as const;

export function pruefeUpload(dateien: Array<{ size: number }>): string | null {
  if (dateien.length > upload.maxDateien) return `Bitte höchstens ${upload.maxDateien} Dateien auswählen.`;
  const gesamt = dateien.reduce((summe, datei) => summe + datei.size, 0);
  if (gesamt > upload.maxGesamtBytes) return "Die Dateien sind zusammen zu groß (max. 12 MB).";
  return null;
}

export function istEmailPlausibel(wert: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert.trim());
}

/** Kontaktweg-Regel der Stufe 3: E-Mail oder Telefon, eines genügt. */
export function pruefeKontaktweg(email: string, telefon: string): string | null {
  const hatEmail = email.trim().length > 0;
  const hatTelefon = telefon.trim().length > 0;
  if (!hatEmail && !hatTelefon) return "Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.";
  if (hatEmail && !istEmailPlausibel(email)) return "Diese E-Mail-Adresse sieht unvollständig aus.";
  return null;
}

/** Fehlerschlüssel der Kurznachricht in der Ansprechpartner-Karte. */
export type KurzFehler = Partial<Record<"firma" | "email" | "nachricht" | "datenschutz", string>>;

/**
 * Regeln der Kurznachricht. Anders als in Stufe 3 ist die E-Mail Pflicht: das
 * kurze Formular kennt kein Telefonfeld, sie ist der einzige Rückweg.
 */
export function pruefeKurznachricht(werte: {
  firma?: string;
  email?: string;
  nachricht?: string;
  datenschutz?: string;
}): KurzFehler {
  const fehler: KurzFehler = {};
  const email = (werte.email ?? "").trim();

  if (!(werte.firma ?? "").trim()) fehler.firma = "Bitte geben Sie Ihr Unternehmen oder Ihren Namen an.";
  if (!email) fehler.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (!istEmailPlausibel(email)) fehler.email = "Diese E-Mail-Adresse sieht unvollständig aus.";
  if (!(werte.nachricht ?? "").trim()) fehler.nachricht = "Bitte schildern Sie kurz, worum es geht.";
  if (werte.datenschutz !== "1") fehler.datenschutz = "Ohne Ihre Zustimmung dürfen wir die Nachricht nicht bearbeiten.";

  return fehler;
}

export const minimumFillTimeMs = 1800;

export function wurdeZuSchnellAusgefuellt(startedAt: number, now = Date.now()): boolean {
  return now - startedAt < minimumFillTimeMs || startedAt > now;
}

/** Baut die Kurzzusammenfassung der Bestätigungsansicht aus den Formularwerten. */
export function baueZusammenfassung(input: {
  akut: boolean;
  pfade: string[];
  werte: Record<string, string>;
}): Array<[string, string]> {
  const { akut, pfade: ausgewaehltePfade, werte } = input;
  const eintraege: Array<[string, string]> = [];

  if (akut) {
    eintraege.push(["Anliegen", stoerfall.label]);
    const betrieb = werte.stoerfall_betrieb ?? "";
    if (betrieb) eintraege.push(["Betrieb", stoerfallBetriebLabels[betrieb] ?? betrieb]);
  } else if (ausgewaehltePfade.length) {
    const leistungen = ausgewaehltePfade.map((pfad) => pfadLabels[pfad] ?? pfad).join(", ");
    eintraege.push([ausgewaehltePfade.length === 1 ? "Leistung" : "Leistungen", leistungen]);
    const zeit = werte.zeitrahmen ?? "";
    if (zeit) {
      const termin = (werte.termin ?? "").trim();
      eintraege.push(["Zeitrahmen", (zeitrahmenLabels[zeit] ?? zeit) + (termin ? ` (${termin})` : "")]);
    }
  }

  const ort = [werte.plz, werte.ort].map((teil) => (teil ?? "").trim()).filter(Boolean).join(" ");
  if (ort) eintraege.push(["Einsatzort", ort]);
  if ((werte.firma ?? "").trim()) eintraege.push(["Unternehmen", werte.firma.trim()]);
  if ((werte.name ?? "").trim()) eintraege.push(["Ansprechpartner", werte.name.trim()]);

  return eintraege;
}

/**
 * Kontaktdaten für Trust-Karte, Störfall-Shortcut und Bestätigungsansicht.
 * Quelle ist siteConfig; hier stehen nur die formular-spezifischen Zusätze.
 */
export const anfrageKontakt = {
  ansprechpartner: siteConfig.contactPerson,
  rolle: siteConfig.contactRole,
  telefonAnzeige: siteConfig.phone,
  telefonLink: `tel:${siteConfig.phoneHref}`,
  email: siteConfig.email,
  einsatzgebiet: "Norddeutschland",
  einsatzgebietZusatz: "Abhängig von Umfang, Termin und Aufgabe auch bundesweit.",
  verantwortlich: `${siteConfig.legalName}, ${siteConfig.address}`
} as const;

/** Hinweis beider Formulare, solange kein Versand-Key hinterlegt ist. */
export const versandGesperrtMeldung =
  `Der direkte Versand ist noch nicht freigeschaltet. Bitte nutzen Sie Telefon (${anfrageKontakt.telefonAnzeige}) oder E-Mail (${anfrageKontakt.email}).`;
