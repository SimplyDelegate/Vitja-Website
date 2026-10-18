import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contactEndpointOrigin, contactUploadsEnabled } from "./contact";

describe("Versand-Konfiguration", () => {
  it("liest den Origin des Versand-Endpunkts für die CSP aus", () => {
    expect(contactEndpointOrigin()).toMatch(/^https:\/\//);
  });

  it("hält Datei-Uploads ohne ausdrückliche Freischaltung deaktiviert", () => {
    expect(contactUploadsEnabled).toBe(false);
  });
});

describe("Formularübermittlung mit konfiguriertem Dienst", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ACCESS_KEY", "test-key");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  function testDaten() {
    const daten = new FormData();
    daten.set("h-captcha-response", "test-token");
    daten.set("telefon", "+49 123 456789");
    daten.set("email", "");
    return daten;
  }

  it("sendet ohne bestätigte Spamprüfung nichts", async () => {
    const netz = vi.fn();
    vi.stubGlobal("fetch", netz);
    const { sendeFormular: senden } = await import("./contact");
    await expect(senden(new FormData(), "Test", "Test")).resolves.toBe("pruefung");
    expect(netz).not.toHaveBeenCalled();
  });

  it("übermittelt Token, Betreff und telefonischen Kontakt ohne leeres E-Mail-Feld", async () => {
    const netz = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", netz);
    const { sendeFormular: senden } = await import("./contact");
    const daten = testDaten();
    await expect(senden(daten, "Störfall", "Testfirma")).resolves.toBe("gesendet");
    expect(daten.get("email")).toBeNull();
    expect(daten.get("telefon")).toBe("+49 123 456789");
    expect(daten.get("h-captcha-response")).toBe("test-token");
    expect(daten.get("access_key")).toBe("test-key");
    expect(daten.get("subject")).toBe("Störfall");
    expect(netz).toHaveBeenCalledWith("https://api.web3forms.com/submit", expect.objectContaining({ method: "POST", body: daten, signal: expect.any(AbortSignal) }));
  });

  it("erhält mehrere Leistungen und Projektdetails beim Versand einer ausführlichen Anfrage", async () => {
    const netz = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", netz);
    const { sendeFormular: senden } = await import("./contact");
    const daten = testDaten();
    daten.append("leistungen[]", "industrieisolierung");
    daten.append("leistungen[]", "rohrbau");
    daten.set("beschreibung", "Isolierung und Rohrleitungen zum geplanten Stillstand anpassen.");
    daten.set("zeitrahmen", "stillstand");
    daten.set("termin", "KW 48");
    daten.set("firma", "Testunternehmen");
    daten.set("name", "Testkontakt");
    await expect(senden(daten, "Anfrage: Industrieisolierung, Rohrleitungsbau", "Testkontakt")).resolves.toBe("gesendet");
    const gesendet = netz.mock.calls[0][1].body as FormData;
    expect(gesendet.getAll("leistungen[]")).toEqual(["industrieisolierung", "rohrbau"]);
    expect(gesendet.get("beschreibung")).toContain("Stillstand");
    expect(gesendet.get("termin")).toBe("KW 48");
    expect(gesendet.get("firma")).toBe("Testunternehmen");
    expect(gesendet.get("name")).toBe("Testkontakt");
    expect(gesendet.has("datenschutz")).toBe(false);
  });

  it.each([
    [200, { success: false }],
    [400, { success: true }],
    [200, { success: "true" }]
  ])("zeigt bei einer abgelehnten oder ungültigen Antwort keinen Erfolg (%s, %j)", async (status, body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));
    const { sendeFormular: senden } = await import("./contact");
    await expect(senden(testDaten(), "Test", "Test")).resolves.toBe("fehler");
  });

  it("fängt ungültiges JSON und Netzwerkausfälle ab", async () => {
    const netz = vi.fn().mockResolvedValueOnce(new Response("not json")).mockRejectedValueOnce(new TypeError("offline"));
    vi.stubGlobal("fetch", netz);
    const { sendeFormular: senden } = await import("./contact");
    await expect(senden(testDaten(), "Test", "Test")).resolves.toBe("fehler");
    await expect(senden(testDaten(), "Test", "Test")).resolves.toBe("fehler");
  });

  it("beendet eine hängende Übermittlung nach 20 Sekunden", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    })));
    const { sendeFormular: senden } = await import("./contact");
    const ergebnis = senden(testDaten(), "Test", "Test");
    await vi.advanceTimersByTimeAsync(20_000);
    await expect(ergebnis).resolves.toBe("fehler");
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("Versandschleuse", () => {
  it("meldet ohne Access-Key 'gesperrt' und rührt das Netz nicht an", async () => {
    // Ohne Freischaltung darf kein fetch stattfinden — sonst liefe die Anfrage
    // ins Leere und der Nutzer bekäme eine Fehlermeldung statt des Hinweises.
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ACCESS_KEY", "");
    const { contactAccessKey, sendeFormular } = await import("./contact");
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
      vi.unstubAllEnvs();
    }
  });
});
