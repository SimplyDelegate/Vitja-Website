import { describe, expect, it } from "vitest";
import { contactEndpointOrigin, minimumFillTimeMs, validateContactPayload } from "./contact";

const payload = {
  name: "Max Mustermann", company: "", email: "max@example.de", phone: "", service: "GFK",
  location: "Hamburg", timeframe: "KW 40", urgency: "Planbar", operationalState: "Anlage in Betrieb",
  message: "Beschreibung des geplanten Einsatzes.", privacy: true, website: "", startedAt: Date.now() - 3000
};

describe("Kontaktvalidierung", () => {
  it("akzeptiert vollständige technische Projektdaten", () => expect(validateContactPayload(payload).success).toBe(true));
  it("weist fehlende Einsatz- und Terminangaben ab", () => {
    expect(validateContactPayload({ ...payload, location: "" }).success).toBe(false);
    expect(validateContactPayload({ ...payload, timeframe: "" }).success).toBe(false);
  });
  it("weist ein ausgefülltes Honeypot-Feld ab", () => expect(validateContactPayload({ ...payload, website: "https://spam.example" }).success).toBe(false));
  it("weist zu schnell abgeschickte Anfragen ab", () => {
    const now = Date.now();
    expect(validateContactPayload({ ...payload, startedAt: now - (minimumFillTimeMs - 100) }, now).success).toBe(false);
    expect(validateContactPayload({ ...payload, startedAt: now + 5000 }, now).success).toBe(false);
  });
  it("liest den Origin des Versand-Endpunkts für die CSP aus", () => expect(contactEndpointOrigin()).toMatch(/^https:\/\//));
});
