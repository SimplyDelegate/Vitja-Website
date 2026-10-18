import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Ausschließlich Prozess-Fixtures: diese Freigaben werden weder gespeichert
// noch als tatsächlich erfolgte Zustellungs- oder Betreiberprüfung ausgegeben.
const fixture = {
  SITE_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://triumphtechnicalservices.de",
  NEXT_PUBLIC_SITE_INDEXING: "true",
  NEXT_PUBLIC_CONTACT_EMAIL: "test@example.com",
  NEXT_PUBLIC_CONTACT_PHONE: "+49 123456789",
  NEXT_PUBLIC_CONTACT_PHONE_HREF: "+49123456789",
  NEXT_PUBLIC_COMPANY_ADDRESS: "Teststraße 1, 12345 Teststadt",
  NEXT_PUBLIC_COMPANY_LEGAL_NAME: "Testgesellschaft UG (haftungsbeschränkt)",
  NEXT_PUBLIC_COMPANY_REGISTER: "HRB 12345",
  NEXT_PUBLIC_COMPANY_REGISTER_COURT: "Amtsgericht Teststadt",
  NEXT_PUBLIC_COMPANY_RESPONSIBLE: "Testgeschäftsführung",
  NEXT_PUBLIC_CONTACT_ACCESS_KEY: "test-key",
  LEGAL_REVIEW_CONFIRMED: "true",
  FORM_DELIVERY_CONFIRMED: "true",
  SPAM_PROTECTION_CONFIRMED: "true"
};

function pruefen(abweichung: Record<string, string> = {}) {
  return spawnSync(process.execPath, [resolve("scripts/check-production.mjs")], {
    env: { ...process.env, ...fixture, ...abweichung }, encoding: "utf8"
  });
}

describe("Freigabe der Hauptdomain", () => {
  it("akzeptiert eine vollständige Konfiguration ohne erfundene Qualifikationen oder Steuer-/Bankpflichtangaben", () => {
    expect(pruefen().status).toBe(0);
  });

  it.each(["FORM_DELIVERY_CONFIRMED", "SPAM_PROTECTION_CONFIRMED", "LEGAL_REVIEW_CONFIRMED"])("blockiert ohne bestätigte Prüfung: %s", (name) => {
    const result = pruefen({ [name]: "false" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(name);
  });

  it("blockiert eine Vorschauadresse trotz gesetzter Freigaben", () => {
    const result = pruefen({ NEXT_PUBLIC_SITE_URL: "https://vitja-website.pages.dev" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Vorschau-");
  });
});
