import { describe, expect, it } from "vitest";
import { hasAllowedSignature, safeAttachmentName, validateContactPayload } from "./contact";

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
  it("erkennt erlaubte Dateisignaturen", () => {
    expect(hasAllowedSignature(new TextEncoder().encode("%PDF-1.7"), "application/pdf")).toBe(true);
    expect(hasAllowedSignature(new Uint8Array([0xff, 0xd8, 0xff, 0x00]), "image/jpeg")).toBe(true);
    expect(hasAllowedSignature(new TextEncoder().encode("kein pdf"), "application/pdf")).toBe(false);
  });
  it("bereinigt Dateinamen", () => expect(safeAttachmentName("../plan\r\n.pdf")).not.toMatch(/[\\/\r\n]/));
});
