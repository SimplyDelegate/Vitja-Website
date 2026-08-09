"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, PhoneCall, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { contactAccessKey, contactEndpoint, validateContactPayload } from "@/lib/contact";
import { services, siteConfig } from "@/lib/content";

type FormStatus = { type: "idle" | "pending" | "success" | "error"; message: string };

const dispatchAvailable = Boolean(contactAccessKey);

function fieldsFrom(form: FormData, startedAt: number) {
  return {
    name: form.get("name"),
    company: form.get("company") ?? "",
    email: form.get("email"),
    phone: form.get("phone") ?? "",
    service: form.get("service"),
    message: form.get("message"),
    privacy: form.get("privacy") === "on" || form.get("privacy") === "true",
    website: form.get("website") ?? "",
    startedAt
  };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  useEffect(() => {
    const selectService = (event: Event) => {
      setService((event as CustomEvent<string>).detail);
      window.setTimeout(() => formRef.current?.querySelector<HTMLTextAreaElement>("textarea[name='message']")?.focus(), 450);
    };
    window.addEventListener("tts:select-service", selectService);
    return () => window.removeEventListener("tts:select-service", selectService);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const validation = validateContactPayload(fieldsFrom(form, startedAt));

    if (!validation.success) {
      setStatus({ type: "error", message: validation.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben." });
      return;
    }

    setStatus({ type: "pending", message: "Anfrage wird geprüft …" });
    form.delete("website");
    form.set("access_key", contactAccessKey);
    form.set("botcheck", "");
    form.set("from_name", validation.data.name);
    form.set("subject", `Leistungsanfrage: ${validation.data.service}`);

    try {
      const response = await fetch(contactEndpoint, { method: "POST", body: form });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message || "Die Anfrage konnte nicht versendet werden.");

      setStatus({ type: "success", message: "Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen." });
      formElement.reset();
      setService("");
      setStartedAt(Date.now());
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Die Anfrage konnte nicht versendet werden." });
    }
  }

  return (
    <div className="contact-layout">
      <div className="contact-intro">
        <p className="eyebrow">Direkter Kontakt</p>
        <h2>Sprechen wir über Ihre Aufgabe.</h2>
        <p>Schildern Sie uns kurz, worum es geht. Viktor Jakobi prüft Ihre Anfrage persönlich und meldet sich mit dem passenden nächsten Schritt.</p>
        <div className="contact-person-card">
          <div className="contact-person-heading">
            <span>Ihr Ansprechpartner</span>
            <strong>{siteConfig.contactPerson}</strong>
            <small>{siteConfig.contactRole}</small>
          </div>
          <div className="contact-person-links">
            <a className="contact-channel" href={`tel:${siteConfig.phoneHref}`}>
              <span className="contact-channel-icon"><PhoneCall aria-hidden="true" /></span>
              <span className="contact-channel-copy"><small>Telefon</small><strong>{siteConfig.phone}</strong></span>
              <ArrowUpRight className="contact-channel-arrow" aria-hidden="true" />
            </a>
            <a className="contact-channel" href={`mailto:${siteConfig.email}`}>
              <span className="contact-channel-icon"><Mail aria-hidden="true" /></span>
              <span className="contact-channel-copy"><small>E-Mail</small><strong>{siteConfig.email}</strong></span>
              <ArrowUpRight className="contact-channel-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {!dispatchAvailable ? (
        <div className="contact-form">
          <p><strong>Das Anfrageformular ist noch nicht freigeschaltet.</strong></p>
          <p>Bis dahin erreichen Sie uns direkt per E-Mail oder Telefon. Schildern Sie kurz Ihre Aufgabe und die gewünschte Leistung.</p>
          <p><a className="button" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Leistungsanfrage über die Website")}`}><Send aria-hidden="true" />Anfrage per E-Mail senden</a></p>
        </div>
      ) : (
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label>Name *<input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
            <label>Unternehmen<input name="company" autoComplete="organization" maxLength={120} /></label>
            <label>E-Mail *<input type="email" name="email" autoComplete="email" maxLength={160} required /></label>
            <label>Telefon<input type="tel" name="phone" autoComplete="tel" maxLength={60} /></label>
          </div>
          <label>Leistung *
            <select name="service" value={service} onChange={(event) => setService(event.target.value)} required>
              <option value="">Bitte auswählen</option>
              {services.map((item) => <option key={item.id} value={item.requestValue}>{item.title}</option>)}
              <option value="Qualifikations- / Präqualifikationsunterlagen">Qualifikations- / Präqualifikationsunterlagen</option>
              <option value="Sonstiges / Beratung">Sonstiges / Beratung</option>
            </select>
          </label>
          <label>Aufgabe / Nachricht *<textarea name="message" rows={5} minLength={10} maxLength={3000} required placeholder="Was ist zu bearbeiten? Welche Werkstoffe, Abmessungen oder Vorgaben sind bekannt?" /></label>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className="privacy-check"><input type="checkbox" name="privacy" required /><span>Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu. *</span></label>
          <div className="form-submit-row">
            <button className="button" type="submit" disabled={status.type === "pending"}><Send aria-hidden="true" />{status.type === "pending" ? "Wird geprüft …" : "Leistung besprechen"}</button>
            <p className={`form-status is-${status.type}`} role="status" aria-live="polite">{status.message}</p>
          </div>
        </form>
      )}
    </div>
  );
}
