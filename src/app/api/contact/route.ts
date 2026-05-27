import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/content";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = payload?.name?.trim() ?? "";
  const email = payload?.email?.trim() ?? "";
  const company = payload?.company?.trim() ?? "";
  const message = payload?.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Bitte Name, E-Mail und Nachricht ausfuellen." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Bitte eine gueltige E-Mail-Adresse eingeben." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

  if (!apiKey) {
    console.info("Mock contact request", { name, email, company, message });
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Vitja Website <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Neue Anfrage von ${name}`,
    text: [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      company ? `Unternehmen: ${company}` : null,
      "",
      message
    ]
      .filter(Boolean)
      .join("\n")
  });

  return NextResponse.json({ ok: true, mode: "resend" });
}
