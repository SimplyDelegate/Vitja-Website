import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  allowedAttachmentTypes,
  hasAllowedSignature,
  maxAttachmentBytes,
  maxAttachmentCount,
  safeAttachmentName,
  validateContactPayload
} from "@/lib/contact";

export const runtime = "nodejs";

type ValidatedAttachment = { filename: string; contentType: string; content: Buffer };

function mailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  const verifiedDomain = process.env.RESEND_VERIFIED_DOMAIN;
  const fromDomain = from?.split("@")[1]?.toLowerCase();

  return { apiKey, from, to, verifiedDomain, valid: Boolean(apiKey && from && to && verifiedDomain && fromDomain === verifiedDomain?.toLowerCase()) };
}

function fieldsFrom(form: FormData) {
  return {
    name: form.get("name"),
    company: form.get("company") ?? "",
    email: form.get("email"),
    phone: form.get("phone") ?? "",
    service: form.get("service"),
    location: form.get("location"),
    timeframe: form.get("timeframe"),
    urgency: form.get("urgency"),
    operationalState: form.get("operationalState"),
    message: form.get("message"),
    privacy: form.get("privacy") === "on" || form.get("privacy") === "true",
    website: form.get("website") ?? "",
    startedAt: form.get("startedAt")
  };
}

async function validateAttachments(form: FormData): Promise<{ ok: true; files: ValidatedAttachment[] } | { ok: false; message: string }> {
  const files = form.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > maxAttachmentCount) return { ok: false, message: `Bitte laden Sie maximal ${maxAttachmentCount} Dateien hoch.` };
  if (files.reduce((sum, file) => sum + file.size, 0) > maxAttachmentBytes) return { ok: false, message: "Die Projektunterlagen dürfen zusammen maximal 10 MB groß sein." };

  const validated: ValidatedAttachment[] = [];
  for (const file of files) {
    if (!allowedAttachmentTypes.includes(file.type as (typeof allowedAttachmentTypes)[number])) {
      return { ok: false, message: "Erlaubt sind PDF-, JPG-, PNG- und WebP-Dateien." };
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasAllowedSignature(bytes, file.type)) return { ok: false, message: `Die Datei „${safeAttachmentName(file.name)}“ entspricht nicht dem angegebenen Dateityp.` };
    validated.push({ filename: safeAttachmentName(file.name), contentType: file.type, content: Buffer.from(bytes) });
  }
  return { ok: true, files: validated };
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Die Anfrage konnte nicht gelesen werden." }, { status: 400 });
  }

  const validated = validateContactPayload(fieldsFrom(form));
  if (!validated.success) {
    return NextResponse.json({ ok: false, message: validated.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Eingaben." }, { status: 400 });
  }

  const attachments = await validateAttachments(form);
  if (!attachments.ok) return NextResponse.json({ ok: false, message: attachments.message }, { status: 400 });

  const config = mailConfiguration();
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!config.valid) {
    if (isProduction) return NextResponse.json({ ok: false, message: "Das Formular ist derzeit nicht verfügbar. Bitte kontaktieren Sie uns telefonisch." }, { status: 503 });
    return NextResponse.json({ ok: true, mock: true, message: "Vorschau: Die Anfrage und Projektunterlagen wurden geprüft, aber nicht versendet." });
  }

  const data = validated.data;
  const text = [
    "Neue Projektanfrage über die Website", "",
    `Name: ${data.name}`,
    `Unternehmen: ${data.company || "–"}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone || "–"}`,
    `Leistung: ${data.service}`,
    `Einsatzort: ${data.location}`,
    `Zeitraum: ${data.timeframe}`,
    `Dringlichkeit: ${data.urgency}`,
    `Anlagenzustand: ${data.operationalState}`,
    `Anhänge: ${attachments.files.length || "keine"}`, "",
    "Nachricht:", data.message
  ].join("\n");

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from!,
      to: [config.to!],
      replyTo: data.email,
      subject: `Projektanfrage: ${data.service}`,
      text,
      attachments: attachments.files
    });
    if (result.error) throw new Error("Resend rejected the request");
    return NextResponse.json({ ok: true, message: "Vielen Dank. Ihre Anfrage wurde erfolgreich übermittelt." });
  } catch {
    return NextResponse.json({ ok: false, message: "Die Anfrage konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an." }, { status: 502 });
  }
}
