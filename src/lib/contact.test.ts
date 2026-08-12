import { describe, expect, it } from "vitest";
import { contactEndpointOrigin, contactUploadsEnabled } from "./contact";

describe("Versand-Konfiguration", () => {
  it("liest den Origin des Versand-Endpunkts für die CSP aus", () => {
    expect(contactEndpointOrigin()).toMatch(/^https:\/\//);
  });

  it("hält Datei-Uploads ohne ausdrückliche Freischaltung deaktiviert", () => {
    expect(contactUploadsEnabled).toBe(false);
  });
});
