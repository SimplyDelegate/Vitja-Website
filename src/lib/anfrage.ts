import { services, siteConfig } from "./content";

/**
 * Anfrageformular – zentrale Konfiguration und testbare Logik.
 *
 * Die Pfadkarten in Stufe 1 werden aus `services` (content.ts) abgeleitet,
 * damit Leistungsraster und Formular nicht auseinanderlaufen. Hier stehen nur
 * die formular-spezifischen Texte und die reinen Prüf-/Zusammenfassungs-
 * funktionen; das Markup liegt in components/anfrage/.
 */

export type PfadDetails = {
  /** Überschrift und Einleitung von Stufe 2 */
  stufe2: { titel: string; hinweis: string };
  /** Beschriftung des Beschreibungsfelds in Stufe 2 */
  beschreibungLabel: string;
  /** Beschriftung des Absende-Buttons für diesen Pfad */
  submitLabel: string;
};

export type Pfad = PfadDetails & {
  /** Wert des Radio-Inputs und Schlüssel für die pfadabhängigen Fragen */
  id: string;
  /** Beschriftung der Auswahlkarte in Stufe 1 */
  label: string;
  /** Zweite Zeile der Auswahlkarte */
  hinweis: string;
};

const standardDetails: PfadDetails = {
  stufe2: {
    titel: "Was sollten wir über das Vorhaben wissen?",
    hinweis: "Ein kurzer Überblick reicht. Details klären wir anschließend im Gespräch."
  },
  beschreibungLabel: "Beschreiben Sie Ihr Vorhaben",
  submitLabel: "Anfrage senden"
};

const pfadDetails: Record<string, PfadDetails> = {
  industrieisolierung: {
    stufe2: { titel: "Was soll isoliert werden?", hinweis: "Anlagenteil, Temperaturbereich und Zugänglichkeit helfen bei der ersten Einordnung." },
    beschreibungLabel: "Beschreiben Sie Anlagenteil und Umfang der Isolierung",
    submitLabel: "Isolierung anfragen"
  },
  rohrbau: {
    stufe2: { titel: "Was sollen wir an der Leitung machen?", hinweis: "Werkstoff, Nennweite und Medium helfen uns bei der ersten Einordnung – fehlende Angaben klären wir im Gespräch." },
    beschreibungLabel: "Beschreiben Sie die Leitung und den geplanten Eingriff",
    submitLabel: "Rohrbau-Anfrage senden"
  },
  gfk: {
    stufe2: { titel: "Worum geht es beim GFK-Bauteil?", hinweis: "Medium, Temperatur und Druck entscheiden über Laminataufbau und Harzsystem." },
    beschreibungLabel: "Beschreiben Sie Bauteil, Schadensbild oder geplantes System",
    submitLabel: "GFK-Anfrage senden"
  },
  systemintegration: {
    stufe2: { titel: "Was soll eingebunden werden?", hinweis: "Für die Planung ist wichtig, wie stark der laufende Betrieb betroffen ist." },
    beschreibungLabel: "Beschreiben Sie das System und die bestehende Anlage",
    submitLabel: "Systemeinbau anfragen"
  },
  stahlbau: {
    stufe2: { titel: "Was ist an der Konstruktion zu tun?", hinweis: "Ein paar Sätze zu Bauteil, Belastung und Zustand genügen für den Einstieg." },
    beschreibungLabel: "Beschreiben Sie die Konstruktion und den Umfang",
    submitLabel: "Stahlbau-Anfrage senden"
  },
  anlageninstandsetzung: {
    stufe2: { titel: "Um welche Anlage geht es?", hinweis: "Wichtig ist vor allem, ob die Anlage läuft und wann ein Eingriff möglich wäre." },
    beschreibungLabel: "Beschreiben Sie Anlage, Schadensbild und bisherige Maßnahmen",
    submitLabel: "Instandsetzung anfragen"
  },
  schweissarbeiten: {
    stufe2: { titel: "Was ist zu schweißen?", hinweis: "Werkstoff und geforderte Dokumentation bestimmen Verfahren und Prüfumfang." },
    beschreibungLabel: "Beschreiben Sie Bauteil, Nahtart und Einsatzbedingungen",
    submitLabel: "Schweißarbeiten anfragen"
  },
  blechherstellung: {
    stufe2: { titel: "Was sollen wir für Sie fertigen?", hinweis: "Mit Zeichnung geht es am schnellsten. Skizze oder Muster reichen aber auch." },
    beschreibungLabel: "Beschreiben Sie Bauteil, Werkstoff und Blechdicke",
    submitLabel: "Fertigung anfragen"
  },
  schiffsausbau: {
    stufe2: { titel: "Worum geht es an Bord?", hinweis: "Ein paar Sätze zu Schiff, Bereich und Zeitfenster genügen für den Einstieg." },
    beschreibungLabel: "Beschreiben Sie Schiff, Bereich und geplante Arbeiten",
    submitLabel: "Schiffsausbau anfragen"
  },
  unterlagen: {
    stufe2: { titel: "Welche Nachweise brauchen Sie?", hinweis: "Nennen Sie Anlass und gewünschten Umfang – wir stellen die passenden Unterlagen zusammen." },
    beschreibungLabel: "Beschreiben Sie Anlass und benötigte Unterlagen",
    submitLabel: "Unterlagen anfordern"
  },
  unklar: {
    stufe2: { titel: "Was steht bei Ihnen an?", hinweis: "Beschreiben Sie das Vorhaben in eigenen Worten. Die Zuordnung übernehmen wir." },
    beschreibungLabel: "Beschreiben Sie Ihr Vorhaben",
    submitLabel: "Anfrage senden"
  }
};

export const pfade: Pfad[] = [
  ...services.map((service) => ({
    id: service.id,
    label: service.title,
    hinweis: service.short,
    ...(pfadDetails[service.id] ?? standardDetails)
  })),
  {
    id: "unterlagen",
    label: "Qualifikations- / Präqualifikationsunterlagen",
    hinweis: "Nachweise und Unterlagen für Ihre Einkaufs- oder Lieferantenprüfung.",
    ...pfadDetails.unterlagen
  },
  {
    id: "unklar",
    label: "Mehrere Gewerke oder noch offen",
    hinweis: "Wir ordnen Ihr Vorhaben gemeinsam ein.",
    ...pfadDetails.unklar
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

/** Pfade, bei denen die Projektfragen (Einsatzort, Ausführungsort, Zeitrahmen) entfallen. */
export const pfadeOhneProjektfragen = new Set(["unterlagen"]);

/** Ordnet die CTA-Werte aus Leistungsraster und Qualifikationsbereich einem Pfad zu. */
export const pfadFuerAnfrageWert: Record<string, string> = {
  ...Object.fromEntries(services.map((service) => [service.requestValue, service.id])),
  "Qualifikations- / Präqualifikationsunterlagen": "unterlagen",
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

export const minimumFillTimeMs = 1800;

export function wurdeZuSchnellAusgefuellt(startedAt: number, now = Date.now()): boolean {
  return now - startedAt < minimumFillTimeMs || startedAt > now;
}

/** Baut die Kurzzusammenfassung der Bestätigungsansicht aus den Formularwerten. */
export function baueZusammenfassung(input: {
  akut: boolean;
  pfad: string;
  werte: Record<string, string>;
}): Array<[string, string]> {
  const { akut, pfad, werte } = input;
  const eintraege: Array<[string, string]> = [];

  if (akut) {
    eintraege.push(["Anliegen", stoerfall.label]);
    const betrieb = werte.stoerfall_betrieb ?? "";
    if (betrieb) eintraege.push(["Betrieb", stoerfallBetriebLabels[betrieb] ?? betrieb]);
  } else if (pfad) {
    eintraege.push(["Leistung", pfadLabels[pfad] ?? pfad]);
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
