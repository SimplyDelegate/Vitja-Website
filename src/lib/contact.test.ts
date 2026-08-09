import { describe, expect, it } from "vitest";
import { contactEndpointOrigin, minimumFillTimeMs, validateContactPayload } from "./contact";

const payload = {
  name: "Max Mustermann", company: "", email: "max@example.de", phone: "", service: "GFK",
  message: "Beschreibung des geplanten Einsatzes.", privacy: true, website: "", startedAt: Date.now() - 3000
};

describe("Kontaktvalidierung", () => {
  it("akzeptiert eine vollständige kompakte Anfrage", () => expect(validateContactPayload(payload).success).toBe(true));

  it("akzeptiert freiwillige Unternehmens- und Telefonnummern", () => {
    expect(validateContactPayload({ ...payload, company: "Muster Industrie GmbH", phone: "+49 40 123456" }).success).toBe(true);
  });

  it("weist fehlende Pflichtfelder und ungültige E-Mail-Adressen ab", () => {
    expect(validateContactPayload({ ...payload, name: "" }).success).toBe(false);
    expect(validateContactPayload({ ...payload, email: "nicht-gueltig" }).success).toBe(false);
    expect(validateContactPayload({ ...payload, service: "" }).success).toBe(false);
    expect(validateContactPayload({ ...payload, message: "zu kurz" }).success).toBe(false);
    expect(validateContactPayload({ ...payload, privacy: false }).success).toBe(false);
  });

  it("weist ein ausgefülltes Honeypot-Feld ab", () => expect(validateContactPayload({ ...payload, website: "https://spam.example" }).success).toBe(false));

  it("weist zu schnell abgeschickte Anfragen ab", () => {
    const now = Date.now();
    expect(validateContactPayload({ ...payload, startedAt: now - (minimumFillTimeMs - 100) }, now).success).toBe(false);
    expect(validateContactPayload({ ...payload, startedAt: now + 5000 }, now).success).toBe(false);
  });

  it("liest den Origin des Versand-Endpunkts für die CSP aus", () => expect(contactEndpointOrigin()).toMatch(/^https:\/\//));
});
