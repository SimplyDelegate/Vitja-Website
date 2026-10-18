"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { KurzFehler, pruefeKurznachricht, versandGesperrtMeldung, wurdeZuSchnellAusgefuellt } from "@/lib/anfrage";
import { leseFormularWerte, sendeFormular, spamPruefungMeldung, versandFreigeschaltet } from "@/lib/contact";
import { FormularDatenschutz, FormularSchutz, FormularSchutzHandle } from "./FormularSchutz";
import * as ui from "./anfrage-ui";

/**
 * Kurznachricht: drei Felder und eine Spamprüfung. Wer es ausführlich mag,
 * nutzt das Detailformular daneben.
 *
 * Bewusst ein eigenes <form>: verschachteln ließe es sich ohnehin nicht, und
 * getrennte Formulare halten die gleichnamigen Felder (firma, email)
 * beider Seiten auseinander. Prüfregeln und Versand liegen in
 * src/lib, damit sie ohne Browser testbar bleiben.
 */

const BETREFF = "Kurznachricht über das Kontaktformular";

/** Reihenfolge, in der ein Fehler den Fokus bekommt – entspricht der Feldfolge. */
const FEHLER_REIHENFOLGE = ["firma", "email", "nachricht"] as const;

export function Kurznachricht() {
  const formRef = useRef<HTMLFormElement>(null);
  const bestaetigungRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Number.MAX_SAFE_INTEGER);
  const schutzRef = useRef<FormularSchutzHandle>(null);

  const [fehler, setFehler] = useState<KurzFehler>({});
  const [statusMeldung, setStatusMeldung] = useState("");
  const [sendet, setSendet] = useState(false);
  const [gesendet, setGesendet] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (gesendet) bestaetigungRef.current?.focus({ preventScroll: true });
  }, [gesendet]);

  function zeigeFehler(neu: KurzFehler): boolean {
    setFehler(neu);
    const erster = FEHLER_REIHENFOLGE.find((schluessel) => neu[schluessel]);
    if (!erster) return false;
    formRef.current?.querySelector<HTMLElement>(`[name="${erster}"]`)?.focus();
    return true;
  }

  function loescheFehler(schluessel: keyof KurzFehler) {
    setFehler((bisher) => {
      if (!bisher[schluessel]) return bisher;
      const neu = { ...bisher };
      delete neu[schluessel];
      return neu;
    });
  }

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendet) return;

    const werte = leseFormularWerte(event.currentTarget);
    if (zeigeFehler(pruefeKurznachricht(werte))) return;

    // Honeypot: stille Ablage, Bestätigung ohne Versand.
    if (werte.website?.trim()) {
      setGesendet(true);
      return;
    }

    if (wurdeZuSchnellAusgefuellt(startedAt.current)) {
      setStatusMeldung("Die Nachricht wurde ungewöhnlich schnell ausgefüllt. Bitte prüfen Sie Ihre Angaben und senden Sie erneut.");
      return;
    }

    // Vor dem Sendezustand prüfen: ohne Freischaltung soll kein „Wird
    // gesendet …" aufblitzen, der Hinweis steht sofort.
    if (!versandFreigeschaltet) {
      setStatusMeldung(versandGesperrtMeldung);
      return;
    }

    const daten = new FormData(event.currentTarget);
    daten.delete("website");
    const token = schutzRef.current?.token();
    if (!token) {
      setStatusMeldung(spamPruefungMeldung);
      return;
    }
    daten.set("h-captcha-response", token);

    setSendet(true);
    setStatusMeldung("");
    const ergebnis = await sendeFormular(daten, BETREFF, werte.firma ?? "");
    schutzRef.current?.reset();
    setSendet(false);

    if (ergebnis === "gesendet") {
      setGesendet(true);
      return;
    }
    setStatusMeldung(ergebnis === "gesperrt"
      ? versandGesperrtMeldung
      : ergebnis === "pruefung" ? spamPruefungMeldung
      : "Die Übermittlung konnte nicht bestätigt werden. Ihre Angaben bleiben erhalten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per E-Mail oder Telefon.");
  }

  const pflichtStern = <span className="text-signal" aria-hidden="true">{"\u00a0*"}</span>;

  if (gesendet) {
    return (
      <div
        ref={bestaetigungRef}
        tabIndex={-1}
        role="status"
        className="flex min-w-0 flex-col justify-center rounded-xl border border-line bg-surface px-5 py-6 pult:min-h-0 pult:flex-1"
      >
        <span className="grid size-9 place-items-center rounded-full bg-accent/10 text-base font-bold text-accent" aria-hidden="true">✓</span>
        <strong className="mt-3 block font-display text-xl font-bold leading-tight tracking-normal text-ink">
          Ihre Nachricht ist raus.
        </strong>
        <span className="mt-2 block text-sm leading-relaxed text-mute">
          Wir melden uns zeitnah bei Ihnen. Wenn es eilig ist, rufen Sie uns direkt an.
        </span>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="quick-contact-form flex min-w-0 flex-col gap-3.5 pult:min-h-0 pult:flex-1 pult:overflow-y-auto pult:overscroll-contain"
      method="post"
      noValidate
      aria-label="Kurznachricht schreiben"
      onSubmit={absenden}
    >
      {/* Honeypot – für Menschen unsichtbar, für Bots verlockend. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

      <label className={`${ui.field} shrink-0`}>
        <span className={ui.fieldLabel}>Unternehmen / Ansprechperson{pflichtStern}</span>
        <input
          type="text"
          name="firma"
          autoComplete="organization"
          maxLength={160}
          className={ui.inputAufKarte}
          aria-invalid={fehler.firma ? true : undefined}
          aria-describedby={fehler.firma ? "kurz-fehler-firma" : undefined}
          onChange={() => loescheFehler("firma")}
        />
        {fehler.firma && <span id="kurz-fehler-firma" className={ui.fehlerKlein}>{fehler.firma}</span>}
      </label>

      <label className={`${ui.field} shrink-0`}>
        <span className={ui.fieldLabel}>E-Mail{pflichtStern}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          maxLength={160}
          className={ui.inputAufKarte}
          aria-invalid={fehler.email ? true : undefined}
          aria-describedby={fehler.email ? "kurz-fehler-email" : undefined}
          onChange={() => loescheFehler("email")}
        />
        {fehler.email && <span id="kurz-fehler-email" className={ui.fehlerKlein}>{fehler.email}</span>}
      </label>

      <label className={`${ui.field} shrink-0`}>
        <span className={ui.fieldLabel}>Ihre Nachricht{pflichtStern}</span>
        <textarea
          name="nachricht"
          // Deckt sich mit den 6rem aus ui.textareaAufKarte – doppelte
          // Feldhöhe, auf jedem Bildschirm gleich. Wer mehr Platz braucht,
          // zieht das Feld per resize-y auf.
          rows={3}
          maxLength={3000}
          className={ui.textareaAufKarte}
          placeholder="Worum geht es? Ein paar Sätze reichen."
          aria-invalid={fehler.nachricht ? true : undefined}
          aria-describedby={fehler.nachricht ? "kurz-fehler-nachricht" : undefined}
          onChange={() => loescheFehler("nachricht")}
        />
        {fehler.nachricht && <span id="kurz-fehler-nachricht" className={ui.fehlerKlein}>{fehler.nachricht}</span>}
      </label>

      {versandFreigeschaltet && <FormularSchutz ref={schutzRef} />}

      <div
        role="alert"
        aria-live="polite"
        hidden={!statusMeldung}
        className="shrink-0 rounded-xl border border-signal/40 bg-signal/[0.06] px-3.5 py-2.5 text-xs font-semibold leading-relaxed text-signal-dark"
      >
        {statusMeldung}
      </div>

      <button type="submit" className={`${ui.btnPrimary} w-full shrink-0`} disabled={sendet}>
        {sendet ? "Wird gesendet …" : "Nachricht senden"} <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      <FormularDatenschutz />
    </form>
  );
}
