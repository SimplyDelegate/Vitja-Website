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

// Die Seite wird statisch ausgeliefert und hat keinen eigenen Server. Der
// Formularversand laeuft deshalb ueber einen externen Dienst; der Access-Key ist
// bei diesen Diensten oeffentlich und darf im Client-Bundle stehen.
export const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "https://api.web3forms.com/submit";
export const contactAccessKey = process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY ?? "";

export function contactEndpointOrigin() {
  try {
    return new URL(contactEndpoint).origin;
  } catch {
    return "";
  }
}
