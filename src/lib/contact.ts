import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(100),
  company: z.string().trim().max(120).default(""),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(160),
  phone: z.string().trim().max(60).default(""),
  service: z.string().trim().min(1, "Bitte wählen Sie eine Leistung.").max(140),
  location: z.string().trim().min(2, "Bitte geben Sie den Einsatzort oder die Region an.").max(140),
  timeframe: z.string().trim().min(2, "Bitte nennen Sie den gewünschten Zeitraum.").max(140),
  urgency: z.enum(["Planbar", "Kurzfristig", "Stillstand / dringend", "Noch offen"], { error: "Bitte wählen Sie die Dringlichkeit." }),
  operationalState: z.enum(["Anlage in Betrieb", "Geplanter Stillstand", "Anlage außer Betrieb", "Noch unklar"], { error: "Bitte wählen Sie den Anlagenzustand." }),
  message: z.string().trim().min(10, "Bitte beschreiben Sie Ihr Anliegen in mindestens 10 Zeichen.").max(3000),
  privacy: z.literal(true, { error: "Bitte stimmen Sie der Datenschutzerklärung zu." }),
  website: z.string().max(0, "Ungültige Anfrage.").default(""),
  startedAt: z.coerce.number().int().positive()
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const minimumFillTimeMs = 1800;
export const maxAttachmentCount = 3;
export const maxAttachmentBytes = 10 * 1024 * 1024;
export const allowedAttachmentTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;

export function validateContactPayload(input: unknown, now = Date.now()) {
  const result = contactSchema.safeParse(input);
  if (!result.success) return result;

  if (now - result.data.startedAt < minimumFillTimeMs || result.data.startedAt > now) {
    return {
      success: false as const,
      error: new z.ZodError([{ code: "custom", path: ["startedAt"], message: "Die Anfrage wurde zu schnell ausgefüllt." }])
    };
  }

  return result;
}

export function hasAllowedSignature(bytes: Uint8Array, type: string) {
  if (type === "application/pdf") return bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  if (type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (type === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export function safeAttachmentName(name: string) {
  return name.normalize("NFKC").replace(/[\\/\r\n\0]/g, "-").replace(/[^a-zA-Z0-9äöüÄÖÜß._ -]/g, "-").slice(0, 120) || "projektunterlage";
}
