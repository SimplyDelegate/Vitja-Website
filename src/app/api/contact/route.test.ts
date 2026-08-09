import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));

import { POST } from "./route";

const validPayload = () => ({
  name: "Max Mustermann",
  company: "Muster Industrie GmbH",
  email: "max@example.de",
  phone: "+49 123 456",
  service: "Rohrbau & Reparaturen",
  location: "Hamburg",
  timeframe: "KW 38",
  urgency: "Planbar",
  operationalState: "Geplanter Stillstand",
  message: "Wir benötigen eine Reparatur an einer bestehenden Rohrleitung.",
  privacy: true,
  website: "",
  startedAt: Date.now() - 3000
});

function requestFor(payload: Record<string, unknown>, files: File[] = []) {
  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) form.set(key, value === true ? "on" : String(value));
  for (const file of files) form.append("attachments", file);
  return new Request("http://localhost/api/contact", { method: "POST", body: form });
}

const validPdf = () => new File([new TextEncoder().encode("%PDF-1.7\nproject")], "projekt.pdf", { type: "application/pdf" });

describe("POST /api/contact", () => {
  beforeEach(() => { vi.unstubAllEnvs(); sendMock.mockReset(); });
  afterEach(() => vi.unstubAllEnvs());

  it("validiert eine vollständige Anfrage im lokalen Mock-Modus", async () => {
    const response = await POST(requestFor(validPayload(), [validPdf()]));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, mock: true });
  });

  it("weist ungültige E-Mail-Adressen und unvollständige Projektdaten ab", async () => {
    expect((await POST(requestFor({ ...validPayload(), email: "nicht-gueltig" }))).status).toBe(400);
    expect((await POST(requestFor({ ...validPayload(), location: "" }))).status).toBe(400);
    expect((await POST(requestFor({ ...validPayload(), operationalState: "irgendwas" }))).status).toBe(400);
  });

  it("weist Honeypot und zu schnelles Ausfüllen ab", async () => {
    expect((await POST(requestFor({ ...validPayload(), website: "spam" }))).status).toBe(400);
    expect((await POST(requestFor({ ...validPayload(), startedAt: Date.now() }))).status).toBe(400);
  });

  it("prüft Anzahl, Typ und Dateisignatur der Anhänge", async () => {
    const invalidSignature = new File(["kein pdf"], "projekt.pdf", { type: "application/pdf" });
    expect((await POST(requestFor(validPayload(), [invalidSignature]))).status).toBe(400);
    const invalidType = new File(["text"], "projekt.txt", { type: "text/plain" });
    expect((await POST(requestFor(validPayload(), [invalidType]))).status).toBe(400);
    expect((await POST(requestFor(validPayload(), [validPdf(), validPdf(), validPdf(), validPdf()]))).status).toBe(400);
  });

  it("täuscht in Produktion ohne Mail-Konfiguration keinen Erfolg vor", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const response = await POST(requestFor(validPayload()));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false });
  });

  it("meldet Fehler des Versanddienstes", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_VERIFIED_DOMAIN", "example.de");
    vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.de");
    vi.stubEnv("CONTACT_TO_EMAIL", "kontakt@example.de");
    sendMock.mockResolvedValue({ data: null, error: { message: "rejected" } });
    expect((await POST(requestFor(validPayload()))).status).toBe(502);
  });

  it("versendet Projektdaten und geprüfte Anhänge", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_VERIFIED_DOMAIN", "example.de");
    vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.de");
    vi.stubEnv("CONTACT_TO_EMAIL", "kontakt@example.de");
    sendMock.mockResolvedValue({ data: { id: "mail_123" }, error: null });
    const response = await POST(requestFor(validPayload(), [validPdf()]));
    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining("Einsatzort: Hamburg"),
      attachments: [expect.objectContaining({ filename: "projekt.pdf", contentType: "application/pdf" })]
    }));
  });
});
