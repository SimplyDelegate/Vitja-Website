"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { KurzFehler, pruefeKurznachricht, versandGesperrtMeldung, wurdeZuSchnellAusgefuellt } from "@/lib/anfrage";
import { leseFormularWerte, sendeFormular, versandFreigeschaltet } from "@/lib/contact";
import * as ui from "./anfrage-ui";

/**
 * Kurznachricht in der Ansprechpartner-Karte: drei Felder und die Zustimmung,
 * mehr nicht. Wer es ausführlich mag, nutzt das Detailformular daneben.
 *
 * Bewusst ein eigenes <form>: verschachteln ließe es sich ohnehin nicht, und
 * getrennte Formulare halten die gleichnamigen Felder (firma, email,
 * datenschutz) beider Seiten auseinander. Prüfregeln und Versand liegen in
 * src/lib, damit sie ohne Browser testbar bleiben.
 */

const BETREFF = "Kurznachricht über das Kontaktformular";

/** Reihenfolge, in der ein Fehler den Fokus bekommt – entspricht der Feldfolge. */
const FEHLER_REIHENFOLGE = ["firma", "email", "nachricht", "datenschutz"] as const;

export function Kurznachricht() {
  const formRef = useRef<HTMLFormElement>(null);
  const bestaetigungRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Number.MAX_SAFE_INTEGER);

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

    setSendet(true);
    setStatusMeldung("");
    const ergebnis = await sendeFormular(daten, BETREFF, werte.firma ?? "");
    setSendet(false);

    if (ergebnis === "gesendet") {
      setGesendet(true);
      return;
    }
    setStatusMeldung(ergebnis === "gesperrt"
      ? versandGesperrtMeldung
      : "Die Nachricht konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
  }

  const pflichtStern = <span className="text-signal" aria-hidden="true"> *</span>;

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
      className="flex min-w-0 flex-col gap-3.5 pult:min-h-0 pult:flex-1"
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

      <label className={`${ui.field} pult:min-h-0 pult:flex-1`}>
        <span className={ui.fieldLabel}>Ihre Nachricht{pflichtStern}</span>
        <textarea
          name="nachricht"
          // rows bestimmt nur die natürliche Höhe: mobil deckelt ohnehin
          // min-h-[9.5rem] aus ui.textarea, im pult-Modus wächst das Feld per
          // flex-1 in die Restfläche der Karte.
          rows={2}
          maxLength={3000}
          className={`${ui.textareaAufKarte} pult:min-h-[4rem] pult:flex-1`}
          placeholder="Worum geht es? Ein paar Sätze reichen."
          aria-invalid={fehler.nachricht ? true : undefined}
          aria-describedby={fehler.nachricht ? "kurz-fehler-nachricht" : undefined}
          onChange={() => loescheFehler("nachricht")}
        />
        {fehler.nachricht && <span id="kurz-fehler-nachricht" className={ui.fehlerKlein}>{fehler.nachricht}</span>}
      </label>

      <div className="shrink-0">
        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-2">
          <input
            type="checkbox"
            name="datenschutz"
            value="1"
            className={`${ui.choiceInput} mt-0.5`}
            aria-invalid={fehler.datenschutz ? true : undefined}
            aria-describedby={fehler.datenschutz ? "kurz-fehler-datenschutz" : undefined}
            onChange={() => loescheFehler("datenschutz")}
          />
          <span>
            Ich habe die <Link href="/datenschutz" className="font-semibold text-accent underline underline-offset-2" target="_blank" rel="noopener">Datenschutzerklärung</Link>{" "}
            gelesen und stimme der Verarbeitung meiner Angaben zu.{pflichtStern}
          </span>
        </label>
        {fehler.datenschutz && <p id="kurz-fehler-datenschutz" className={ui.fehlerKlein}>{fehler.datenschutz}</p>}
      </div>

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
    </form>
  );
}
