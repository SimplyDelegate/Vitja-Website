"use client";

import Link from "next/link";
import { ArrowUpRight, FileUp, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { services, siteConfig } from "@/lib/content";
import { maxAttachmentBytes, maxAttachmentCount } from "@/lib/contact";

type FormStatus = { type: "idle" | "pending" | "success" | "error"; message: string; mock?: boolean };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [filesLabel, setFilesLabel] = useState("Keine Dateien ausgewählt");
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  useEffect(() => {
    const selectService = (event: Event) => {
      setService((event as CustomEvent<string>).detail);
      window.setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("input[name='location']")?.focus(), 450);
    };
    window.addEventListener("tts:select-service", selectService);
    return () => window.removeEventListener("tts:select-service", selectService);
  }, []);

  function updateFiles(input: HTMLInputElement) {
    const files = Array.from(input.files ?? []);
    const size = files.reduce((sum, file) => sum + file.size, 0);
    if (files.length > maxAttachmentCount || size > maxAttachmentBytes) {
      input.value = "";
      setFilesLabel("Keine Dateien ausgewählt");
      setStatus({ type: "error", message: "Maximal 3 Dateien mit zusammen 10 MB sind möglich." });
      return;
    }
    setStatus({ type: "idle", message: "" });
    setFilesLabel(files.length ? files.map((file) => file.name).join(", ") : "Keine Dateien ausgewählt");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "pending", message: "Anfrage und Unterlagen werden geprüft …" });
    const form = new FormData(event.currentTarget);
    form.set("startedAt", String(startedAt));

    try {
      const response = await fetch("/api/contact", { method: "POST", body: form });
      const result = await response.json() as { ok?: boolean; message?: string; mock?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.message || "Die Anfrage konnte nicht versendet werden.");
      setStatus({ type: "success", message: result.message || "Vielen Dank für Ihre Anfrage.", mock: result.mock });
      if (!result.mock) {
        event.currentTarget.reset();
        setService("");
        setFilesLabel("Keine Dateien ausgewählt");
        setStartedAt(Date.now());
      }
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Die Anfrage konnte nicht versendet werden." });
    }
  }

  return (
    <div className="contact-layout">
      <div className="contact-intro">
        <p className="eyebrow eyebrow-light">Direkter Kontakt</p>
        <h2>Was können wir für Sie lösen?</h2>
        <p>Mit Einsatzort, Zeitraum und Anlagenzustand können wir Ihre Aufgabe schneller einordnen. Nach Sichtung erhalten Sie den sinnvollsten nächsten Schritt und gegebenenfalls eine gezielte Rückfrage.</p>
        <a className="phone-link" href={`tel:${siteConfig.phoneHref}`}><span>Lieber direkt sprechen?</span><strong>{siteConfig.phone}</strong><ArrowUpRight aria-hidden="true" /></a>
        {siteConfig.isDraft && <p className="preview-note"><strong>Vorschaumodus:</strong> Kontaktdaten und E-Mail-Versand werden vor der Veröffentlichung final konfiguriert.</p>}
      </div>

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate encType="multipart/form-data">
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
        <div className="form-grid">
          <label>Einsatzort / Region *<input name="location" maxLength={140} required placeholder="z. B. Hamburg" /></label>
          <label>Wunschzeitraum *<input name="timeframe" maxLength={140} required placeholder="z. B. KW 38 oder nach Abstimmung" /></label>
          <label>Dringlichkeit *
            <select name="urgency" defaultValue="" required><option value="" disabled>Bitte auswählen</option><option>Planbar</option><option>Kurzfristig</option><option>Stillstand / dringend</option><option>Noch offen</option></select>
          </label>
          <label>Anlagenzustand *
            <select name="operationalState" defaultValue="" required><option value="" disabled>Bitte auswählen</option><option>Anlage in Betrieb</option><option>Geplanter Stillstand</option><option>Anlage außer Betrieb</option><option>Noch unklar</option></select>
          </label>
        </div>
        <label>Aufgabe / Nachricht *<textarea name="message" rows={6} minLength={10} maxLength={3000} required placeholder="Was ist zu bearbeiten? Welche Werkstoffe, Abmessungen oder Vorgaben sind bekannt?" /></label>
        <label className="file-upload"><span><FileUp aria-hidden="true" /> Projektunterlagen (optional)</span><input type="file" name="attachments" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => updateFiles(event.currentTarget)} /><small>{filesLabel}</small><em>Maximal 3 Dateien, zusammen 10 MB. CAD- und sensible Betriebsunterlagen stimmen wir separat ab.</em></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className="privacy-check"><input type="checkbox" name="privacy" required /><span>Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben und optionalen Unterlagen zur Bearbeitung der Anfrage zu. *</span></label>
        <div className="form-submit-row">
          <button className="button" type="submit" disabled={status.type === "pending"}><Send aria-hidden="true" />{status.type === "pending" ? "Wird geprüft …" : "Projekt besprechen"}</button>
          <p className={`form-status is-${status.type}`} role="status" aria-live="polite">{status.message}</p>
        </div>
      </form>
    </div>
  );
}
