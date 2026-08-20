import { describe, expect, it } from "vitest";
import {
  baueZusammenfassung,
  findePfad,
  istEmailPlausibel,
  minimumFillTimeMs,
  pfade,
  pfadFuerAnfrageWert,
  pfadLabels,
  pruefeKontaktweg,
  pruefeKurznachricht,
  pruefeUpload,
  stoerfall,
  upload,
  wurdeZuSchnellAusgefuellt
} from "./anfrage";
import { services } from "./content";

describe("Pfade", () => {
  it("bietet für jede Leistung der Website einen eigenen Pfad an", () => {
    for (const service of services) {
      expect(pfade.some((p) => p.id === service.id), service.id).toBe(true);
    }
  });

  it("ordnet jeden CTA-Wert des Leistungsrasters einem Pfad zu", () => {
    for (const service of services) {
      expect(findePfad(service.requestValue), service.requestValue).not.toBeNull();
    }
  });

  it("bietet nur technische Leistungen und die offene Auswahl an", () => {
    expect(pfade).toHaveLength(services.length + 1);
    expect(pfade.at(-1)?.id).toBe("unklar");
    expect(pfade.some((pfad) => pfad.id === "unterlagen")).toBe(false);
    expect(findePfad("Qualifikations- / Präqualifikationsunterlagen")).toBeNull();
  });

  it("löst Deeplink-Parameter, Störfall und Unbekanntes korrekt auf", () => {
    expect(findePfad("gfk")).toBe("gfk");
    expect(findePfad("blechherstellung")).toBe("blechherstellung");
    expect(findePfad("Blechvorrichtungen")).toBe("blechherstellung");
    expect(findePfad(stoerfall.id)).toBe(stoerfall.id);
    expect(findePfad("gibt-es-nicht")).toBeNull();
    expect(findePfad(null)).toBeNull();
  });

  it("hat für jeden Pfad vollständige Auswahltexte", () => {
    for (const pfad of pfade) {
      expect(pfad.label.length, pfad.id).toBeGreaterThan(0);
      expect(pfad.hinweis.length, pfad.id).toBeGreaterThan(0);
    }
  });

  it("verweist in der Zuordnungstabelle nur auf existierende Pfade", () => {
    for (const [wert, ziel] of Object.entries(pfadFuerAnfrageWert)) {
      expect(pfadLabels[ziel], `${wert} → ${ziel}`).toBeDefined();
    }
  });
});

describe("Kontaktweg-Regel", () => {
  it("akzeptiert E-Mail oder Telefon", () => {
    expect(pruefeKontaktweg("max@example.de", "")).toBeNull();
    expect(pruefeKontaktweg("", "040 123456")).toBeNull();
    expect(pruefeKontaktweg("max@example.de", "040 123456")).toBeNull();
  });

  it("verlangt mindestens einen Kontaktweg", () => {
    expect(pruefeKontaktweg("", "")).not.toBeNull();
    expect(pruefeKontaktweg("  ", " ")).not.toBeNull();
  });

  it("weist unplausible E-Mail-Adressen ab, wenn keine Nummer angegeben ist", () => {
    expect(pruefeKontaktweg("max@", "")).not.toBeNull();
    expect(istEmailPlausibel("max@example")).toBe(false);
    expect(istEmailPlausibel("max@example.de")).toBe(true);
  });
});

describe("Kurznachricht", () => {
  const vollstaendig = {
    firma: "Nordwerft GmbH",
    email: "planung@nordwerft.de",
    nachricht: "Wir brauchen eine Isolierung an zwei Kesseln.",
    datenschutz: "1"
  };

  it("lässt vollständige Angaben durch", () => {
    expect(pruefeKurznachricht(vollstaendig)).toEqual({});
  });

  it("bemängelt jedes fehlende Pflichtfeld einzeln", () => {
    const fehler = pruefeKurznachricht({});
    expect(Object.keys(fehler).sort()).toEqual(["datenschutz", "email", "firma", "nachricht"]);
  });

  it("wertet Eingaben aus reinen Leerzeichen als fehlend", () => {
    const fehler = pruefeKurznachricht({ ...vollstaendig, firma: "   ", nachricht: " " });
    expect(fehler.firma).toBeDefined();
    expect(fehler.nachricht).toBeDefined();
    expect(fehler.email).toBeUndefined();
  });

  it("verlangt eine plausible E-Mail-Adresse", () => {
    expect(pruefeKurznachricht({ ...vollstaendig, email: "planung@" }).email).toBeDefined();
    expect(pruefeKurznachricht({ ...vollstaendig, email: "planung@nordwerft.de" }).email).toBeUndefined();
  });

  it("besteht auf der Datenschutz-Zustimmung", () => {
    expect(pruefeKurznachricht({ ...vollstaendig, datenschutz: undefined }).datenschutz).toBeDefined();
    expect(pruefeKurznachricht({ ...vollstaendig, datenschutz: "0" }).datenschutz).toBeDefined();
  });
});

describe("Upload-Grenzen", () => {
  it("akzeptiert Auswahl innerhalb der Grenzen", () => {
    expect(pruefeUpload([{ size: 1024 }, { size: 2048 }])).toBeNull();
    expect(pruefeUpload([])).toBeNull();
  });

  it("weist zu viele oder zu große Dateien ab", () => {
    expect(pruefeUpload(Array.from({ length: upload.maxDateien + 1 }, () => ({ size: 1 })))).not.toBeNull();
    expect(pruefeUpload([{ size: upload.maxGesamtBytes + 1 }])).not.toBeNull();
  });
});

describe("Ausfüllzeit", () => {
  it("erkennt zu schnelle und unplausible Zeitstempel", () => {
    const now = Date.now();
    expect(wurdeZuSchnellAusgefuellt(now - minimumFillTimeMs - 1, now)).toBe(false);
    expect(wurdeZuSchnellAusgefuellt(now - 100, now)).toBe(true);
    expect(wurdeZuSchnellAusgefuellt(now + 5000, now)).toBe(true);
  });
});

describe("Zusammenfassung", () => {
  it("fasst eine Standardanfrage zusammen", () => {
    const eintraege = baueZusammenfassung({
      akut: false,
      pfade: ["gfk", "rohrbau"],
      werte: { zeitrahmen: "stillstand", termin: "KW 38", plz: "21079", ort: "Hamburg", firma: "Muster GmbH", name: "Max Mustermann" }
    });
    expect(eintraege).toEqual([
      ["Leistungen", `${pfadLabels.gfk}, ${pfadLabels.rohrbau}`],
      ["Zeitrahmen", "zum geplanten Stillstand oder Revisionstermin (KW 38)"],
      ["Einsatzort", "21079 Hamburg"],
      ["Unternehmen", "Muster GmbH"],
      ["Ansprechpartner", "Max Mustermann"]
    ]);
  });

  it("fasst eine Störfallmeldung zusammen und lässt Leeres weg", () => {
    const eintraege = baueZusammenfassung({
      akut: true,
      pfade: [],
      werte: { stoerfall_betrieb: "stillstand", plz: "20457", firma: "Muster GmbH", name: "Max Mustermann" }
    });
    expect(eintraege[0]).toEqual(["Anliegen", stoerfall.label]);
    expect(eintraege[1]).toEqual(["Betrieb", "Produktion steht"]);
    expect(eintraege).toHaveLength(5);
  });
});
