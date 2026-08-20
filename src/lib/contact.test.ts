import { describe, expect, it, vi } from "vitest";
import { contactAccessKey, contactEndpointOrigin, contactUploadsEnabled, sendeFormular } from "./contact";

describe("Versand-Konfiguration", () => {
  it("liest den Origin des Versand-Endpunkts für die CSP aus", () => {
    expect(contactEndpointOrigin()).toMatch(/^https:\/\//);
  });

  it("hält Datei-Uploads ohne ausdrückliche Freischaltung deaktiviert", () => {
    expect(contactUploadsEnabled).toBe(false);
  });
});

describe("Versandschleuse", () => {
  it("meldet ohne Access-Key 'gesperrt' und rührt das Netz nicht an", async () => {
    // Ohne Freischaltung darf kein fetch stattfinden — sonst liefe die Anfrage
    // ins Leere und der Nutzer bekäme eine Fehlermeldung statt des Hinweises.
    expect(contactAccessKey).toBe("");
    const daten = new FormData();
    const netz = vi.fn();
    vi.stubGlobal("fetch", netz);
    try {
      await expect(sendeFormular(daten, "Betreff", "Absender")).resolves.toBe("gesperrt");
      expect(netz).not.toHaveBeenCalled();
      expect(daten.get("access_key")).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
