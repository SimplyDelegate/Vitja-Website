import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Die Seite laeuft als statischer Export auf GitHub Pages, VERCEL_ENV gibt es
// dort nicht. Der Pages-Workflow setzt SITE_ENV, sobald die Freigabepruefung
// scharf geschaltet werden soll.
const isProduction = process.env.SITE_ENV === "production" || process.argv.includes("--force");

if (!isProduction) {
  console.log("Production release check skipped for local/preview build.");
  process.exit(0);
}

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_CONTACT_PHONE",
  "NEXT_PUBLIC_CONTACT_PHONE_HREF",
  "NEXT_PUBLIC_COMPANY_ADDRESS",
  "NEXT_PUBLIC_COMPANY_LEGAL_NAME",
  "NEXT_PUBLIC_COMPANY_REGISTER",
  "NEXT_PUBLIC_COMPANY_TAX_ID",
  "NEXT_PUBLIC_COMPANY_TAX_OFFICE",
  "NEXT_PUBLIC_COMPANY_BANK_NAME",
  "NEXT_PUBLIC_COMPANY_IBAN",
  "NEXT_PUBLIC_COMPANY_BIC",
  "NEXT_PUBLIC_COMPANY_RESPONSIBLE",
  "NEXT_PUBLIC_CONTACT_ACCESS_KEY",
  "LEGAL_REVIEW_CONFIRMED",
  "QUALIFICATION_REVIEW_CONFIRMED"
];

const missing = required.filter((name) => !process.env[name]?.trim());
const errors = [];
if (missing.length) errors.push(`Fehlende Variablen: ${missing.join(", ")}`);

const url = process.env.NEXT_PUBLIC_SITE_URL ?? "";
if (/preview|localhost|example|placeholder/i.test(url)) errors.push("NEXT_PUBLIC_SITE_URL enthält eine Vorschau- oder Platzhalterdomain.");
if (process.env.LEGAL_REVIEW_CONFIRMED !== "true") errors.push("LEGAL_REVIEW_CONFIRMED muss nach rechtlicher Prüfung auf true gesetzt werden.");
if (process.env.QUALIFICATION_REVIEW_CONFIRMED !== "true") errors.push("QUALIFICATION_REVIEW_CONFIRMED muss nach Prüfung von Rechtsträger, Qualifikationen und Geltungsbereichen auf true gesetzt werden.");

const qualifications = JSON.parse(readFileSync(resolve("src/data/qualifications.json"), "utf8"));
const evidence = JSON.parse(readFileSync(resolve("src/data/evidence-registry.json"), "utf8"));
const featuredProjectMetrics = JSON.parse(readFileSync(resolve("src/data/featured-project-metrics.json"), "utf8"));
const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
const publicQualifications = qualifications.filter((entry) => entry.publicVisibility === "summary");
if (!publicQualifications.length) errors.push("Mindestens ein fachlich geprüfter öffentlicher Qualifikationsnachweis fehlt.");

for (const qualification of publicQualifications) {
  const missingFields = ["standard", "scope", "issuer", "certificateNumber", "validUntil", "evidenceId"].filter((field) => !qualification[field]);
  if (qualification.status !== "verified") errors.push(`Qualifikation ${qualification.id ?? "ohne ID"} ist öffentlich, aber nicht als verified markiert.`);
  if (missingFields.length) errors.push(`Qualifikation ${qualification.id ?? "ohne ID"} ist unvollständig: ${missingFields.join(", ")}.`);
  if (qualification.validUntil && Date.parse(qualification.validUntil) < Date.now()) errors.push(`Qualifikation ${qualification.id} ist abgelaufen.`);
  const proof = evidenceById.get(qualification.evidenceId);
  if (!proof?.approved) errors.push(`Für Qualifikation ${qualification.id} fehlt ein freigegebener interner Beleg.`);
  if (proof?.legalHolder !== process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME) errors.push(`Der Rechtsträger des Belegs für ${qualification.id} stimmt nicht mit NEXT_PUBLIC_COMPANY_LEGAL_NAME überein.`);
}

for (const project of featuredProjectMetrics) {
  if (project.status !== "verified") errors.push(`Projektkennzahlen ${project.projectId ?? "ohne ID"} sind noch nicht fachlich bestätigt.`);
  if (!Array.isArray(project.items) || project.items.length !== 3) errors.push(`Projektkennzahlen ${project.projectId ?? "ohne ID"} müssen genau drei Werte enthalten.`);
  if (project.items?.some((item) => !Number.isFinite(item.value) || item.value < 0 || typeof item.prefix !== "string" || typeof item.suffix !== "string" || !item.label?.trim())) errors.push(`Projektkennzahlen ${project.projectId ?? "ohne ID"} enthalten unvollständige Werte.`);
}

if (errors.length) {
  console.error("Produktionsbuild blockiert:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Produktionsfreigabe-Konfiguration vollständig.");
