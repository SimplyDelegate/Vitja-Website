"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  anfrageKontakt,
  baueZusammenfassung,
  findePfad,
  pfade,
  pfadeOhneProjektfragen,
  pruefeKontaktweg,
  pruefeUpload,
  stoerfall,
  upload,
  wurdeZuSchnellAusgefuellt
} from "@/lib/anfrage";
import { contactAccessKey, contactEndpoint, contactUploadsEnabled } from "@/lib/contact";
import { AnfrageTrustKarte } from "./AnfrageTrustKarte";
import * as ui from "./anfrage-ui";

/**
 * Anfrageformular – dreistufiger Assistent mit eigenem Störfallpfad.
 *
 * Alle Stufen bleiben gerendert (Werte gehen beim Blättern nicht verloren);
 * unsichtbare Bereiche werden über hidden + disabled von der FormData
 * ausgeschlossen. Inhalte und Prüffunktionen: src/lib/anfrage.ts.
 */

const STUFEN_LABELS = ["Leistung wählen", "Projekt beschreiben", "Kontaktdaten"];

const FEHLER_REIHENFOLGE = [
  "hauptpfad", "beschreibung", "plz", "ausfuehrungsort", "zeitrahmen",
  "firma", "name", "kontaktweg", "datenschutz",
  "a_bereich", "a_betrieb", "a_beschreibung", "a_plz", "a_firma", "a_name", "a_telefon", "a_datenschutz"
] as const;

type Fehler = Partial<Record<(typeof FEHLER_REIHENFOLGE)[number], string>>;
type UploadAnzeige = { text: string; fehler: boolean; anzahl: number };

const uploadStart: UploadAnzeige = { text: "Noch keine Datei ausgewählt", fehler: false, anzahl: 0 };

function sanftScrollen(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// true sobald die Seite hydriert ist, false im statischen Export.
const keinAbo = () => () => {};
function useHydriert() {
  return useSyncExternalStore(keinAbo, () => true, () => false);
}

/**
 * Im pult-Modus scrollt nur der Fragenbereich. Diese Funktion bestimmt nach
 * Panelwechseln, Größenänderungen und beim Scrollen, ob unterhalb noch Inhalt
 * liegt (Schatten auf der Aktionsleiste) und ob der Bereich per Tastatur
 * erreichbar sein muss (WCAG 2.1.1). Bewusst imperativ statt React-State:
 * die Attribute stehen nicht im JSX, React lässt sie unangetastet.
 */
function ueberlaufPruefen(koerper: HTMLElement) {
  const bereich = koerper.closest("section");
  const leiste = bereich?.querySelector<HTMLElement>("[data-panel-actions]");
  const scrollbar = koerper.scrollHeight - koerper.clientHeight > 4;
  const weiterUnten = scrollbar && koerper.scrollHeight - koerper.scrollTop - koerper.clientHeight > 8;

  if (scrollbar) {
    koerper.setAttribute("tabindex", "0");
    koerper.setAttribute("role", "group");
    koerper.setAttribute("aria-label", "Fragen zu diesem Schritt");
  } else {
    koerper.removeAttribute("tabindex");
    koerper.removeAttribute("role");
    koerper.removeAttribute("aria-label");
  }

  if (leiste) leiste.toggleAttribute("data-mehr", weiterUnten);
}

/**
 * Das gerade sichtbare Panel (Stufe oder Störfall). Bewusst nicht per
 * "section:not([hidden]) …"-Selektor: der matcht auch über Vorfahren
 * außerhalb des Formulars (die Kontakt-Sektion ist selbst ein <section>).
 */
function sichtbaresPanel(form: HTMLFormElement | null): HTMLElement | null {
  if (!form) return null;
  return Array.from(form.querySelectorAll<HTMLElement>("section")).find((panel) => !panel.hidden) ?? null;
}

function sichtbarerKoerper(form: HTMLFormElement | null) {
  return sichtbaresPanel(form)?.querySelector<HTMLElement>("[data-panel-body]") ?? null;
}

/**
 * Fragengruppe: hidden + disabled halten unsichtbare Gruppen aus Fokusreihenfolge
 * und FormData heraus. Muss auf Modulebene stehen, sonst remountet React die
 * Gruppe bei jedem Render und unkontrollierte Eingaben verlieren ihren Wert.
 */
function Gruppe({
  id,
  route,
  sichtbar = true,
  fehlerText,
  children
}: {
  id?: string;
  route?: string;
  sichtbar?: boolean;
  fehlerText?: string;
  children: ReactNode;
}) {
  return (
    <fieldset id={id} data-route={route} className={ui.group} hidden={!sichtbar} disabled={!sichtbar}>
      {children}
      {fehlerText && <p className={ui.fehler}>{fehlerText}</p>}
    </fieldset>
  );
}

// Vollständige Klassenketten je Farbe, damit Tailwind sie statisch findet.
const uploadStil = {
  accent: {
    rahmen: "block cursor-pointer rounded-xl border border-dashed border-line bg-surface px-4 py-5 text-center transition-colors hover:border-accent/50 focus-within:border-accent",
    text: "block text-sm font-bold text-accent"
  },
  signal: {
    rahmen: "block cursor-pointer rounded-xl border border-dashed border-line bg-surface px-4 py-5 text-center transition-colors hover:border-signal/50 focus-within:border-signal",
    text: "block text-sm font-bold text-signal-dark"
  }
} as const;

export function Anfrageformular() {
  const formRef = useRef<HTMLFormElement>(null);
  const wurzelRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const erfolgRef = useRef<HTMLElement>(null);
  const fokusGewuenscht = useRef(false);
  const startedAt = useRef(Number.MAX_SAFE_INTEGER);

  const [stufe, setStufe] = useState(1);
  const [pfad, setPfad] = useState("");
  const [akut, setAkut] = useState(false);
  const [erfolg, setErfolg] = useState(false);
  const [sendet, setSendet] = useState(false);
  const jsBereit = useHydriert();
  const [statusMeldung, setStatusMeldung] = useState("");
  const [fehler, setFehler] = useState<Fehler>({});
  const [zeitrahmen, setZeitrahmen] = useState("");
  const [uploads, setUploads] = useState<Record<"anfrage" | "stoerfall", UploadAnzeige>>({
    anfrage: uploadStart,
    stoerfall: uploadStart
  });
  const [zusammenfassung, setZusammenfassung] = useState<Array<[string, string]>>([]);

  const aktuellerPfad = pfade.find((p) => p.id === pfad);
  const projektfragen = !pfadeOhneProjektfragen.has(pfad);

  /* ------------------------------------------------------------- Start & CTAs */

  // Deeplinks (?pfad=...) lassen sich nur nach der Hydration anwenden: ein
  // useState-Initializer liefe schon beim statischen Prerender und erzeugte
  // einen Hydration-Mismatch.
  useEffect(() => {
    startedAt.current = Date.now();
    const ziel = findePfad(new URLSearchParams(window.location.search).get("pfad"));
    if (ziel === stoerfall.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Übernahme des URL-Zustands
      setAkut(true);
    } else if (ziel) {
      setPfad(ziel);
      setStufe(2);
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const ziel = findePfad((event as CustomEvent<string>).detail);
      if (!ziel) return;
      setErfolg(false);
      if (ziel === stoerfall.id) {
        setAkut(true);
      } else {
        setAkut(false);
        setPfad(ziel);
        setStufe(2);
      }
      fokusGewuenscht.current = true;
    };
    window.addEventListener("tts:select-service", handler);
    return () => window.removeEventListener("tts:select-service", handler);
  }, []);

  /* ------------------------------------------------- Aufräumen bei Pfadwechsel */

  // Nicht mehr passende Pfadfragen leeren, damit beim Zurückwechseln keine
  // veralteten Antworten stehen bleiben (gesendet würden sie ohnehin nicht).
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.querySelectorAll<HTMLElement>("[data-route]").forEach((element) => {
      const routen = (element.dataset.route ?? "").split(/\s+/).filter(Boolean);
      if (pfad && routen.includes(pfad)) return;
      element.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea").forEach((feld) => {
        if (feld instanceof HTMLInputElement && (feld.type === "radio" || feld.type === "checkbox")) feld.checked = false;
        else feld.value = "";
      });
    });
  }, [pfad]);

  useEffect(() => {
    const form = formRef.current;
    if (!form || zeitrahmen === "stillstand") return;
    const termin = form.querySelector<HTMLInputElement>("input[name='termin']");
    if (termin) termin.value = "";
  }, [zeitrahmen]);

  /* ---------------------------------------------------- Fragenbereich messen */

  // Panelwechsel: Fragenbereich startet oben, Überlauf neu bestimmen.
  useEffect(() => {
    const koerper = sichtbarerKoerper(formRef.current);
    if (!koerper) return;
    koerper.scrollTop = 0;
    ueberlaufPruefen(koerper);
  }, [stufe, akut, erfolg]);

  // Höhenänderungen im Panel (Fehlermeldungen, Pfadfragen, Terminfeld, Status).
  useEffect(() => {
    const koerper = sichtbarerKoerper(formRef.current);
    if (koerper) ueberlaufPruefen(koerper);
  }, [fehler, pfad, zeitrahmen, statusMeldung]);

  useEffect(() => {
    let timer = 0;
    const beiResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const koerper = sichtbarerKoerper(formRef.current);
        if (koerper) ueberlaufPruefen(koerper);
      }, 150);
    };
    window.addEventListener("resize", beiResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", beiResize);
    };
  }, []);

  /* ------------------------------------------------------------------- Fokus */

  // Seite nur bewegen, wenn das Formular nicht vollständig im Bild ist — im
  // pult-Modus steht es ohnehin, ein Sprung dorthin wäre nur Unruhe.
  function seiteZumFormular() {
    const kasten = formRef.current?.getBoundingClientRect();
    if (!kasten) return;
    if (kasten.top < 0 || kasten.bottom > window.innerHeight) {
      formRef.current?.scrollIntoView({ behavior: sanftScrollen(), block: "start" });
    }
  }

  useEffect(() => {
    if (!fokusGewuenscht.current) return;
    fokusGewuenscht.current = false;
    seiteZumFormular();
    sichtbaresPanel(formRef.current)?.querySelector<HTMLElement>("h4")?.focus({ preventScroll: true });
  }, [stufe, akut]);

  useEffect(() => {
    if (!erfolg) return;
    const kasten = erfolgRef.current?.getBoundingClientRect();
    if (kasten && (kasten.top < 0 || kasten.bottom > window.innerHeight)) {
      erfolgRef.current?.scrollIntoView({ behavior: sanftScrollen(), block: "start" });
    }
    erfolgRef.current?.focus({ preventScroll: true });
  }, [erfolg]);

  useEffect(() => {
    if (statusMeldung) statusRef.current?.focus();
  }, [statusMeldung]);

  /* -------------------------------------------------------------- Validierung */

  function leseWerte(): Record<string, string> {
    const form = formRef.current;
    if (!form) return {};
    const werte: Record<string, string> = {};
    new FormData(form).forEach((wert, name) => {
      if (typeof wert === "string" && !(name in werte)) werte[name] = wert;
    });
    return werte;
  }

  function pruefeStufe(nummer: number, werte: Record<string, string>): Fehler {
    const neu: Fehler = {};
    if (nummer === 1 && !pfad) neu.hauptpfad = "Bitte wählen Sie eine Leistung.";
    if (nummer === 2) {
      if (!werte.beschreibung?.trim()) neu.beschreibung = "Bitte beschreiben Sie Ihr Vorhaben kurz.";
      if (projektfragen) {
        if (!werte.plz?.trim()) neu.plz = "Bitte geben Sie die Postleitzahl an.";
        if (!werte.ausfuehrungsort) neu.ausfuehrungsort = "Bitte wählen Sie, wo gearbeitet werden soll.";
        if (!werte.zeitrahmen) neu.zeitrahmen = "Bitte wählen Sie einen Zeitrahmen.";
      }
    }
    if (nummer === 3) {
      if (!werte.firma?.trim()) neu.firma = "Bitte geben Sie Ihr Unternehmen an.";
      if (!werte.name?.trim()) neu.name = "Bitte geben Sie Ihren Namen an.";
      const kontaktweg = pruefeKontaktweg(werte.email ?? "", werte.telefon ?? "");
      if (kontaktweg) neu.kontaktweg = kontaktweg;
      if (werte.datenschutz !== "1") neu.datenschutz = "Ohne Ihre Zustimmung dürfen wir die Anfrage nicht bearbeiten.";
    }
    return neu;
  }

  function pruefeStoerfall(werte: Record<string, string>): Fehler {
    const neu: Fehler = {};
    if (!werte.stoerfall_bereich) neu.a_bereich = "Bitte wählen Sie, was betroffen ist.";
    if (!werte.stoerfall_betrieb) neu.a_betrieb = "Bitte geben Sie an, wie stark der Betrieb betroffen ist.";
    if (!werte.beschreibung?.trim()) neu.a_beschreibung = "Bitte beschreiben Sie den Schaden kurz.";
    if (!werte.plz?.trim()) neu.a_plz = "Bitte geben Sie die Postleitzahl an.";
    if (!werte.firma?.trim()) neu.a_firma = "Bitte geben Sie Ihr Unternehmen an.";
    if (!werte.name?.trim()) neu.a_name = "Bitte geben Sie Ihren Namen an.";
    if (!werte.telefon?.trim()) neu.a_telefon = "Bitte geben Sie eine Nummer an, unter der wir Sie sofort erreichen.";
    if (werte.datenschutz !== "1") neu.a_datenschutz = "Ohne Ihre Zustimmung dürfen wir die Meldung nicht bearbeiten.";
    return neu;
  }

  function zeigeFehler(neu: Fehler): boolean {
    setFehler(neu);
    const erster = FEHLER_REIHENFOLGE.find((schluessel) => neu[schluessel]);
    if (!erster) return false;
    const gruppe = document.getElementById(`gruppe-${erster}`);
    gruppe?.scrollIntoView({ behavior: sanftScrollen(), block: "center" });
    gruppe?.querySelector<HTMLElement>("input:not([type='hidden']), select, textarea")?.focus({ preventScroll: true });
    return true;
  }

  function loescheFehler(...schluessel: Array<keyof Fehler>) {
    setFehler((bisher) => {
      if (!schluessel.some((s) => bisher[s])) return bisher;
      const neu = { ...bisher };
      schluessel.forEach((s) => delete neu[s]);
      return neu;
    });
  }

  /* --------------------------------------------------------------- Navigation */

  function weiter(ziel: number) {
    if (zeigeFehler(pruefeStufe(stufe, leseWerte()))) return;
    fokusGewuenscht.current = true;
    setStufe(ziel);
  }

  function zurueck(ziel: number) {
    fokusGewuenscht.current = true;
    setStufe(ziel);
  }

  function zeigeStoerfall() {
    fokusGewuenscht.current = true;
    setFehler({});
    setAkut(true);
  }

  function zurueckZuStandard() {
    fokusGewuenscht.current = true;
    setFehler({});
    setAkut(false);
    setStufe(1);
  }

  /* ------------------------------------------------------------------ Uploads */

  function handleUpload(schluessel: "anfrage" | "stoerfall") {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const feld = event.currentTarget;
      const dateien = Array.from(feld.files ?? []);
      const meldung = pruefeUpload(dateien);
      if (meldung) {
        feld.value = "";
        setUploads((bisher) => ({ ...bisher, [schluessel]: { text: meldung, fehler: true, anzahl: 0 } }));
        return;
      }
      setUploads((bisher) => ({
        ...bisher,
        [schluessel]: {
          text: dateien.length ? dateien.map((datei) => datei.name).join(", ") : uploadStart.text,
          fehler: false,
          anzahl: dateien.length
        }
      }));
    };
  }

  /* ------------------------------------------------- Exklusive Auswahlkarten */

  function exklusivAuswahl(event: FormEvent<HTMLDivElement>) {
    const ziel = event.target as HTMLInputElement;
    if (ziel.type !== "checkbox" || !ziel.checked) return;
    const felder = event.currentTarget.querySelectorAll<HTMLInputElement>(`input[name="${ziel.name}"]`);
    felder.forEach((feld) => {
      if (feld === ziel) return;
      if (ziel.dataset.exklusiv !== undefined) feld.checked = false;
      else if (feld.dataset.exklusiv !== undefined) feld.checked = false;
    });
  }

  /* ------------------------------------------------------------------ Versand */

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendet) return;

    // Enter in einem Feld der Stufen 1–2 blättert weiter statt abzusenden.
    if (!akut && stufe < 3) {
      weiter(stufe + 1);
      return;
    }

    const werte = leseWerte();
    if (zeigeFehler(akut ? pruefeStoerfall(werte) : pruefeStufe(3, werte))) return;

    // Honeypot: stille Ablage, Bestätigung ohne Versand.
    if (werte.website?.trim()) {
      setZusammenfassung(baueZusammenfassung({ akut, pfad, werte }));
      setErfolg(true);
      return;
    }

    if (wurdeZuSchnellAusgefuellt(startedAt.current)) {
      setStatusMeldung("Die Anfrage wurde ungewöhnlich schnell ausgefüllt. Bitte prüfen Sie Ihre Angaben und senden Sie erneut.");
      return;
    }

    if (!contactAccessKey) {
      setStatusMeldung(`Der direkte Versand ist noch nicht freigeschaltet. Bitte nutzen Sie Telefon (${anfrageKontakt.telefonAnzeige}) oder E-Mail (${anfrageKontakt.email}).`);
      return;
    }

    const form = event.currentTarget;
    const daten = new FormData(form);
    daten.delete("website");
    daten.set("pfad_aktiv", akut ? stoerfall.id : pfad);
    daten.set("access_key", contactAccessKey);
    daten.set("botcheck", "");
    daten.set("from_name", werte.name ?? "");
    daten.set("subject", akut ? "Störfallmeldung über das Anfrageformular" : `Anfrage: ${aktuellerPfad?.label ?? "Allgemein"}`);

    // Leere Datei-Slots entfernen; echte Anhänge unter dem von Web3Forms
    // erwarteten Feldnamen anhängen.
    const anhaenge = daten.getAll("unterlagen[]").filter((eintrag): eintrag is File => eintrag instanceof File && eintrag.size > 0);
    daten.delete("unterlagen[]");
    anhaenge.forEach((datei) => daten.append("attachment", datei));

    setSendet(true);
    setStatusMeldung("");
    try {
      const antwort = await fetch(contactEndpoint, { method: "POST", body: daten, headers: { Accept: "application/json" } });
      const ergebnis = (await antwort.json()) as { success?: boolean; message?: string };
      if (!antwort.ok || !ergebnis.success) throw new Error(ergebnis.message || String(antwort.status));
      setZusammenfassung(baueZusammenfassung({ akut, pfad, werte }));
      setErfolg(true);
    } catch {
      setStatusMeldung("Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
    } finally {
      setSendet(false);
    }
  }

  /* ------------------------------------------------------------------- Markup */

  const pflichtStern = <span className="text-signal" aria-hidden="true"> *</span>;

  const uploadFeld = (schluessel: "anfrage" | "stoerfall", farbe: "accent" | "signal") => (
    <label className={uploadStil[farbe].rahmen}>
      <input
        type="file"
        name="unterlagen[]"
        className="sr-only"
        accept={upload.akzeptiert}
        multiple
        aria-describedby={`upload-hinweis-${schluessel}`}
        onChange={handleUpload(schluessel)}
      />
      <strong className={uploadStil[farbe].text}>Dateien auswählen</strong>
      <small id={`upload-hinweis-${schluessel}`} className="mt-1 block text-xs text-mute">{upload.hinweis}</small>
      <em className={`mt-2 block text-xs font-semibold not-italic ${uploads[schluessel].fehler ? "text-signal-dark" : "text-ink-2"}`}>
        {uploads[schluessel].text}
      </em>
    </label>
  );

  return (
    <div ref={wurzelRef} className="anfrage">
      <div className="grid gap-7 lg:grid-cols-[minmax(290px,330px)_minmax(0,1fr)] pult:h-[calc(100svh-var(--anfrage-kopf,102px)-5rem)] pult:max-h-[54rem]">
        {/* Linke Spalte: Ansprache und Ansprechpartner */}
        <div className="flex min-w-0 flex-col gap-6 pult:min-h-0 pult:overflow-y-auto pult:pr-1">
          <header className="max-w-[46ch] shrink-0">
            <p className="eyebrow">Anfrage</p>
            <h2 id="anfrage-titel" className="text-4xl sm:text-5xl pult:text-3xl">Sagen Sie uns, was ansteht.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-2 pult:mt-3 pult:text-sm">
              Drei Schritte, dann liegt Ihre Anfrage bei uns auf dem Tisch. Bei einem Störfall gehen Sie besser direkt ans Telefon.
            </p>
          </header>

          <AnfrageTrustKarte onStoerfall={zeigeStoerfall} stoerfallAktiv={akut} />
        </div>

        <div className="flex min-w-0 flex-col pult:min-h-0">
          {/* ---------- Bestätigung nach dem Absenden ---------- */}
          {erfolg && (
            <section
              ref={erfolgRef}
              tabIndex={-1}
              className="rounded-2xl border border-line bg-surface p-8 shadow-soft sm:p-12 pult:max-h-full pult:overflow-y-auto"
              aria-labelledby="anfrage-erfolg-titel"
            >
              <span className="grid size-11 place-items-center rounded-full bg-accent/10 text-lg font-bold text-accent" aria-hidden="true">✓</span>
              <span className={`mt-5 block ${ui.kicker}`}>Anfrage übermittelt</span>
              <h3 id="anfrage-erfolg-titel" className="mt-2 font-display text-3xl font-bold tracking-normal text-ink">
                Ihre Anfrage ist eingegangen.
              </h3>
              <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-2">
                Wir sehen uns Ihre Angaben an und melden uns mit Rückfragen oder einem Terminvorschlag. Bei dringenden Ergänzungen erreichen Sie uns direkt.
              </p>

              {zusammenfassung.length > 0 && (
                <dl className="mt-7 grid gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                  {zusammenfassung.map(([bezeichnung, inhalt]) => (
                    <div key={bezeichnung} className="contents">
                      <dt className="text-sm font-semibold text-mute">{bezeichnung}</dt>
                      <dd className="m-0 text-sm font-semibold text-ink">{inhalt}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <a href={anfrageKontakt.telefonLink} className={`${ui.btnSecondary} justify-start`}>
                  <span className="text-mute">Telefonisch ergänzen</span>
                  <strong className="text-ink">{anfrageKontakt.telefonAnzeige}</strong>
                </a>
                <a href={`mailto:${anfrageKontakt.email}?subject=Erg%C3%A4nzung%20zu%20meiner%20Anfrage`} className={`${ui.btnSecondary} justify-start`}>
                  <span className="text-mute">Unterlagen nachreichen</span>
                  <strong className="text-ink">{anfrageKontakt.email}</strong>
                </a>
              </div>

              <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-mute">
                Mit der Anfrage ist noch kein Auftrag zustande gekommen. Umfang, Termin und Konditionen stimmen wir vorher persönlich mit Ihnen ab.
              </p>
            </section>
          )}

          {/* ---------- Formular ---------- */}
          {/* Kein action-Attribut: die CSP erlaubt form-action nur auf 'self',
              der Versand läuft ausschließlich über fetch (connect-src). */}
          <form ref={formRef} className="flex min-w-0 flex-col pult:min-h-0 pult:flex-1" method="post" encType="multipart/form-data" noValidate hidden={erfolg} onSubmit={absenden}>
            <input type="hidden" name="js_enabled" value={jsBereit ? "1" : "0"} />
            <input type="hidden" name="pfad_aktiv" value={akut ? stoerfall.id : pfad} />

            <div
              ref={statusRef}
              role="alert"
              aria-live="polite"
              tabIndex={-1}
              hidden={!statusMeldung}
              className="mb-4 shrink-0 rounded-xl border border-signal/40 bg-signal/[0.06] px-4 py-3 text-sm font-semibold text-signal-dark"
            >
              {statusMeldung}
            </div>

            {/* Fortschritt */}
            <div
              hidden={akut || !jsBereit}
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={stufe}
              aria-valuetext={`Schritt ${stufe} von 3: ${STUFEN_LABELS[stufe - 1]}`}
              aria-label="Fortschritt Ihrer Anfrage"
              className="mb-4 shrink-0 rounded-xl border border-line bg-surface-2 px-4 py-3.5"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-mute">Schritt {stufe} von 3</span>
                <strong className="text-sm font-bold text-ink">{STUFEN_LABELS[stufe - 1]}</strong>
                <span className="ml-auto text-xs font-semibold text-mute">{Math.round((stufe / 3) * 100)}&nbsp;%</span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={`h-1.5 rounded-full ${n <= stufe ? "bg-accent" : "bg-line"}`} />
                ))}
              </div>
              <p className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-mute">
                <span>Leistung: <strong className="font-semibold text-ink-2">{aktuellerPfad?.label ?? "noch nicht gewählt"}</strong></span>
                <span>Mit <span className="text-signal" aria-hidden="true">*</span> markierte Felder brauchen wir.</span>
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft pult:flex pult:min-h-0 pult:flex-1 pult:flex-col">
              <fieldset className={ui.panelWrapper} hidden={akut} disabled={akut}>
                {/* ================= Stufe 1 ================= */}
                <section hidden={akut || stufe !== 1} className={ui.panel} aria-labelledby="anfrage-stufe-1">
                  <div className={ui.panelHead}>
                    <h4 id="anfrage-stufe-1" tabIndex={-1} className={ui.panelTitle}>Worum geht es?</h4>
                    <p className={ui.panelLead}>
                      Wählen Sie die Leistung, die Ihrem Vorhaben am nächsten kommt. Danach fragen wir nur noch, was dafür wirklich zählt.
                    </p>
                  </div>
                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <Gruppe id="gruppe-hauptpfad" fehlerText={fehler.hauptpfad}>
                      <legend className={ui.legend}>
                        Leistung{pflichtStern}
                        <span className="sr-only">Pflichtfeld</span>
                      </legend>
                      <div className={ui.choiceGrid}>
                        {pfade.map((p) => (
                          <label key={p.id} className={ui.choice}>
                            <input
                              type="radio"
                              name="hauptpfad"
                              value={p.id}
                              className={ui.choiceInput}
                              checked={pfad === p.id}
                              onChange={() => { setPfad(p.id); loescheFehler("hauptpfad"); }}
                            />
                            <span className="min-w-0">
                              <strong className="block text-ink">{p.label}</strong>
                              <small className="mt-0.5 block text-xs font-medium text-mute">{p.hinweis}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    </Gruppe>
                  </div>
                  <div className={ui.stageActions} data-panel-actions>
                    <span />
                    <button type="button" className={ui.btnPrimary} onClick={() => weiter(2)}>
                      Weiter zum Projekt <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </section>

                {/* ================= Stufe 2 ================= */}
                <section hidden={akut || stufe !== 2} className={ui.panel} aria-labelledby="anfrage-stufe-2">
                  <div className={ui.panelHead}>
                    <h4 id="anfrage-stufe-2" tabIndex={-1} className={ui.panelTitle}>
                      {aktuellerPfad?.stufe2.titel ?? "Was sollten wir über das Vorhaben wissen?"}
                    </h4>
                    <p className={ui.panelLead}>
                      {aktuellerPfad?.stufe2.hinweis ?? "Ein kurzer Überblick reicht. Details klären wir anschließend im Gespräch."}
                    </p>
                  </div>

                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <Gruppe id="gruppe-beschreibung" fehlerText={fehler.beschreibung}>
                      <label className={ui.field}>
                        <span className={ui.fieldLabel}>
                          {aktuellerPfad?.beschreibungLabel ?? "Beschreiben Sie Ihr Vorhaben"}{pflichtStern}
                        </span>
                        <textarea
                          name="beschreibung"
                          rows={4}
                          maxLength={3000}
                          className={ui.textarea}
                          placeholder="Ein paar Sätze zur Ausgangslage und zum gewünschten Ergebnis."
                          aria-invalid={fehler.beschreibung ? true : undefined}
                          onChange={() => loescheFehler("beschreibung")}
                        />
                      </label>
                      <p className="mt-2 text-xs text-mute">
                        Fehlende Maße, Werkstoffe oder Normen sind kein Hindernis – das klären wir gemeinsam.
                      </p>
                    </Gruppe>

                    <Gruppe id="gruppe-plz" sichtbar={projektfragen} fehlerText={fehler.plz}>
                      <legend className={ui.legend}>Einsatzort</legend>
                      <div className={ui.fieldGrid}>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Postleitzahl{pflichtStern}</span>
                          <input
                            type="text"
                            name="plz"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            maxLength={10}
                            className={`${ui.input} sm:max-w-[11rem]`}
                            aria-invalid={fehler.plz ? true : undefined}
                            onChange={() => loescheFehler("plz")}
                          />
                        </label>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Ort oder Werk <span className={ui.hint}>optional</span></span>
                          <input type="text" name="ort" autoComplete="address-level2" maxLength={120} className={ui.input} />
                        </label>
                      </div>
                    </Gruppe>

                    <Gruppe id="gruppe-ausfuehrungsort" sichtbar={projektfragen} fehlerText={fehler.ausfuehrungsort}>
                      <legend className={ui.legend}>Wo wird gearbeitet?{pflichtStern}</legend>
                      <div className={ui.choiceGridThree} onChange={() => loescheFehler("ausfuehrungsort")}>
                        <label className={ui.choice}><input type="radio" name="ausfuehrungsort" value="vor_ort" className={ui.choiceInput} /><span>Bei Ihnen vor Ort</span></label>
                        <label className={ui.choice}><input type="radio" name="ausfuehrungsort" value="werkstatt" className={ui.choiceInput} /><span>In unserer Fertigung</span></label>
                        <label className={ui.choice}><input type="radio" name="ausfuehrungsort" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                      </div>
                    </Gruppe>

                    {/* ---- Pfadspezifische Fragen ---- */}
                    <Gruppe sichtbar={pfad === "rohrbau"} route="rohrbau">
                        <legend className={ui.legend}>Werkstoff der Leitung <span className={ui.hint}>mehrere möglich</span></legend>
                        <div className={ui.choiceGridThree} onChange={exklusivAuswahl}>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="stahl" className={ui.choiceInput} /><span>Stahl</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="edelstahl" className={ui.choiceInput} /><span>Edelstahl</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="gfk" className={ui.choiceInput} /><span>GFK</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="pe_pp" className={ui.choiceInput} /><span>PE / PP</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="guss" className={ui.choiceInput} /><span>Guss</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="unbekannt" data-exklusiv="" className={ui.choiceInput} /><span>Noch unklar</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "rohrbau"} route="rohrbau">
                        <legend className={ui.legend}>Umfang</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="umfang" value="neubau" className={ui.choiceInput} /><span>Neubau einer Leitung</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="umbau" className={ui.choiceInput} /><span>Umbau oder Erweiterung</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="reparatur" className={ui.choiceInput} /><span>Reparatur am Bestand</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "stahlbau"} route="stahlbau">
                        <legend className={ui.legend}>Umfang</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="umfang" value="neukonstruktion" className={ui.choiceInput} /><span>Neue Konstruktion</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="reparatur" className={ui.choiceInput} /><span>Reparatur am Bestand</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="wartung" className={ui.choiceInput} /><span>Wiederkehrende Wartung</span></label>
                          <label className={ui.choice}><input type="radio" name="umfang" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "anlageninstandsetzung" || pfad === "systemintegration"} route="anlageninstandsetzung systemintegration">
                        <legend className={ui.legend}>Zustand der Anlage</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="anlagenzustand" value="in_betrieb" className={ui.choiceInput} /><span>Läuft, Eingriff nur im Betrieb möglich</span></label>
                          <label className={ui.choice}><input type="radio" name="anlagenzustand" value="stillstand_geplant" className={ui.choiceInput} /><span>Stillstand ist geplant</span></label>
                          <label className={ui.choice}><input type="radio" name="anlagenzustand" value="ausser_betrieb" className={ui.choiceInput} /><span>Steht bereits still</span></label>
                          <label className={ui.choice}><input type="radio" name="anlagenzustand" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "schweissarbeiten"} route="schweissarbeiten">
                        <legend className={ui.legend}>Werkstoff <span className={ui.hint}>mehrere möglich</span></legend>
                        <div className={ui.choiceGridThree} onChange={exklusivAuswahl}>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="stahl" className={ui.choiceInput} /><span>Stahl</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="edelstahl" className={ui.choiceInput} /><span>Edelstahl</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="aluminium" className={ui.choiceInput} /><span>Aluminium</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="sonder" className={ui.choiceInput} /><span>Sonderwerkstoff</span></label>
                          <label className={ui.choice}><input type="checkbox" name="werkstoff[]" value="unbekannt" data-exklusiv="" className={ui.choiceInput} /><span>Noch unklar</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "schweissarbeiten"} route="schweissarbeiten">
                        <legend className={ui.legend}>Dokumentation und Prüfung</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="dokumentation" value="gefordert" className={ui.choiceInput} /><span>Prüfzeugnisse und Doku gefordert</span></label>
                          <label className={ui.choice}><input type="radio" name="dokumentation" value="nicht_gefordert" className={ui.choiceInput} /><span>Nicht gefordert</span></label>
                          <label className={ui.choice}><input type="radio" name="dokumentation" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "blechherstellung"} route="blechherstellung">
                        <legend className={ui.legend}>Vorlage</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="vorlage" value="cad" className={ui.choiceInput} /><span>CAD-Datei (DXF, DWG, STEP)</span></label>
                          <label className={ui.choice}><input type="radio" name="vorlage" value="zeichnung" className={ui.choiceInput} /><span>Zeichnung oder Skizze</span></label>
                          <label className={ui.choice}><input type="radio" name="vorlage" value="muster" className={ui.choiceInput} /><span>Muster vorhanden</span></label>
                          <label className={ui.choice}><input type="radio" name="vorlage" value="keine" className={ui.choiceInput} /><span>Noch nichts davon</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "blechherstellung"} route="blechherstellung">
                        <legend className={ui.legend}>Stückzahl</legend>
                        <div className={ui.choiceGridThree}>
                          <label className={ui.choice}><input type="radio" name="stueckzahl" value="einzelteil" className={ui.choiceInput} /><span>Einzelteil</span></label>
                          <label className={ui.choice}><input type="radio" name="stueckzahl" value="kleinserie" className={ui.choiceInput} /><span>Kleinserie</span></label>
                          <label className={ui.choice}><input type="radio" name="stueckzahl" value="serie" className={ui.choiceInput} /><span>Serie</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "gfk"} route="gfk">
                        <legend className={ui.legend}>Art der Arbeit</legend>
                        <div className={ui.choiceGrid}>
                          <label className={ui.choice}><input type="radio" name="gfk_art" value="instandsetzung" className={ui.choiceInput} /><span>Instandsetzung an Bauteilen</span></label>
                          <label className={ui.choice}><input type="radio" name="gfk_art" value="systembau" className={ui.choiceInput} /><span>Rohr- oder Systembau</span></label>
                          <label className={ui.choice}><input type="radio" name="gfk_art" value="beides" className={ui.choiceInput} /><span>Beides</span></label>
                          <label className={ui.choice}><input type="radio" name="gfk_art" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "gfk"} route="gfk">
                        <legend className={ui.legend}>Medium und Beanspruchung <span className={ui.hint}>optional</span></legend>
                        <label className={ui.field}>
                          <input type="text" name="medium" maxLength={200} className={ui.input} placeholder="z. B. Abwasser, 40 °C, drucklos" />
                        </label>
                    </Gruppe>

                    <Gruppe sichtbar={pfad === "systemintegration"} route="systemintegration">
                        <legend className={ui.legend}>Art des Einbaus</legend>
                        <div className={ui.choiceGridThree}>
                          <label className={ui.choice}><input type="radio" name="einbau_art" value="neuanlage" className={ui.choiceInput} /><span>Neuanlage</span></label>
                          <label className={ui.choice}><input type="radio" name="einbau_art" value="nachruestung" className={ui.choiceInput} /><span>Nachrüstung im Bestand</span></label>
                          <label className={ui.choice}><input type="radio" name="einbau_art" value="offen" className={ui.choiceInput} /><span>Noch offen</span></label>
                        </div>
                    </Gruppe>

                    <Gruppe id="gruppe-zeitrahmen" sichtbar={projektfragen} fehlerText={fehler.zeitrahmen}>
                      <legend className={ui.legend}>Zeitrahmen{pflichtStern}</legend>
                      <div
                        className={ui.choiceGrid}
                        onChange={(event) => {
                          const ziel = event.target as HTMLInputElement;
                          if (ziel.name === "zeitrahmen") { setZeitrahmen(ziel.value); loescheFehler("zeitrahmen"); }
                        }}
                      >
                        <label className={ui.choice}><input type="radio" name="zeitrahmen" value="sofort" className={ui.choiceInput} /><span>So schnell wie möglich</span></label>
                        <label className={ui.choice}><input type="radio" name="zeitrahmen" value="wochen" className={ui.choiceInput} /><span>In den nächsten Wochen</span></label>
                        <label className={ui.choice}><input type="radio" name="zeitrahmen" value="stillstand" className={ui.choiceInput} /><span>Zum geplanten Stillstand</span></label>
                        <label className={ui.choice}><input type="radio" name="zeitrahmen" value="planung" className={ui.choiceInput} /><span>Noch in der Planung</span></label>
                      </div>
                      <label className={`${ui.field} mt-3`} hidden={zeitrahmen !== "stillstand"}>
                        <span className={ui.fieldLabel}>Stillstands- oder Revisionsfenster <span className={ui.hint}>optional</span></span>
                        <input type="text" name="termin" maxLength={120} className={ui.input} disabled={zeitrahmen !== "stillstand"} placeholder="z. B. KW 38, 22.–26. September" />
                      </label>
                    </Gruppe>

                    {/* ---- Optionale Ergänzungen ---- */}
                    <details className="group mt-7 rounded-xl border border-line bg-surface-2 open:bg-surface" hidden={!projektfragen}>
                      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-bold text-ink">
                            Unterlagen und Rahmenbedingungen <span className={ui.hint}>optional</span>
                          </strong>
                          <small className="block text-xs text-mute">
                            {uploads.anfrage.anzahl > 0
                              ? `${uploads.anfrage.anzahl} Datei${uploads.anfrage.anzahl === 1 ? "" : "en"} ausgewählt`
                              : contactUploadsEnabled ? "Zeichnungen, Fotos, Zugangsregeln" : "Zugangsregeln und Anforderungen"}
                          </small>
                        </span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-mute transition-transform group-open:rotate-180" aria-hidden="true">
                          <path d="m7 9 5 5 5-5" />
                        </svg>
                      </summary>

                      <div className="border-t border-line px-4 pb-5 pt-4">
                        {contactUploadsEnabled && (
                          <Gruppe sichtbar={projektfragen}>
                            <legend className={ui.legend}>Zeichnungen, Isometrien oder Fotos</legend>
                            {uploadFeld("anfrage", "accent")}
                          </Gruppe>
                        )}

                        <Gruppe sichtbar={projektfragen}>
                          <legend className={ui.legend}>Was auf Ihrem Gelände gilt <span className={ui.hint}>mehrere möglich</span></legend>
                          <div className={ui.choiceGrid} onChange={exklusivAuswahl}>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="unterweisung" className={ui.choiceInput} /><span>Sicherheitsunterweisung nötig</span></label>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="ex_bereich" className={ui.choiceInput} /><span>Ex-Bereich</span></label>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="lebensmittel" className={ui.choiceInput} /><span>Lebensmittel- oder Reinbereich</span></label>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="schicht" className={ui.choiceInput} /><span>Arbeit in Schicht oder am Wochenende</span></label>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="zertifikate" className={ui.choiceInput} /><span>Normen oder Zertifikate gefordert</span></label>
                            <label className={ui.choice}><input type="checkbox" name="rahmen[]" value="keine" data-exklusiv="" className={ui.choiceInput} /><span>Nichts davon</span></label>
                          </div>
                        </Gruppe>
                      </div>
                    </details>
                  </div>

                  <div className={ui.stageActions} data-panel-actions>
                    <button type="button" className={ui.btnSecondary} onClick={() => zurueck(1)}>Zurück</button>
                    <button type="button" className={ui.btnPrimary} onClick={() => weiter(3)}>
                      Weiter zum Kontakt <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </section>

                {/* ================= Stufe 3 ================= */}
                <section hidden={akut || stufe !== 3} className={ui.panel} aria-labelledby="anfrage-stufe-3">
                  <div className={ui.panelHead}>
                    <h4 id="anfrage-stufe-3" tabIndex={-1} className={ui.panelTitle}>Wie erreichen wir Sie?</h4>
                    <p className={ui.panelLead}>
                      Firma, Name und ein Kontaktweg genügen. Rückfragen kommen direkt von der Person, die Ihr Vorhaben bearbeitet.
                    </p>
                  </div>

                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <fieldset className={ui.group} id="gruppe-firma">
                      <legend className={ui.legend}>Ihre Angaben</legend>
                      <div className={ui.fieldGrid}>
                        <label className={`${ui.field} ${ui.fieldWide}`}>
                          <span className={ui.fieldLabel}>Unternehmen{pflichtStern}</span>
                          <input type="text" name="firma" autoComplete="organization" maxLength={160} className={ui.input} aria-invalid={fehler.firma ? true : undefined} onChange={() => loescheFehler("firma")} />
                          {fehler.firma && <span className={ui.fehler}>{fehler.firma}</span>}
                        </label>
                        <label className={ui.field} id="gruppe-name">
                          <span className={ui.fieldLabel}>Ihr Name{pflichtStern}</span>
                          <input type="text" name="name" autoComplete="name" maxLength={160} className={ui.input} aria-invalid={fehler.name ? true : undefined} onChange={() => loescheFehler("name")} />
                          {fehler.name && <span className={ui.fehler}>{fehler.name}</span>}
                        </label>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Funktion oder Abteilung <span className={ui.hint}>optional</span></span>
                          <input type="text" name="funktion" autoComplete="organization-title" maxLength={160} className={ui.input} />
                        </label>
                      </div>
                    </fieldset>

                    <Gruppe id="gruppe-kontaktweg" fehlerText={fehler.kontaktweg}>
                      <legend className={ui.legend}>
                        Kontaktweg{pflichtStern}
                        <span className={ui.hint}>eines von beiden genügt</span>
                      </legend>
                      <div className={ui.fieldGrid}>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>E-Mail</span>
                          <input type="email" name="email" autoComplete="email" maxLength={190} className={ui.input} aria-invalid={fehler.kontaktweg ? true : undefined} onChange={() => loescheFehler("kontaktweg")} />
                        </label>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Telefon</span>
                          <input type="tel" name="telefon" autoComplete="tel" inputMode="tel" maxLength={50} className={ui.input} aria-invalid={fehler.kontaktweg ? true : undefined} onChange={() => loescheFehler("kontaktweg")} />
                        </label>
                      </div>
                    </Gruppe>

                    <fieldset className={ui.group}>
                      <legend className={ui.legend}>Wie möchten Sie am liebsten hören? <span className={ui.hint}>optional</span></legend>
                      <label className={ui.field}>
                        <select name="kontaktpraeferenz" className={ui.input} defaultValue="">
                          <option value="">Keine Präferenz</option>
                          <option value="telefon">Telefonisch</option>
                          <option value="email">Per E-Mail</option>
                        </select>
                      </label>
                    </fieldset>

                    <p className="mt-7 rounded-xl bg-surface-2 px-4 py-3.5 text-sm leading-relaxed text-mute">
                      Mit dem Absenden entsteht noch kein Auftrag. Wir prüfen Ihre Angaben und melden uns mit Rückfragen oder einem Terminvorschlag.
                    </p>

                    <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4" id="gruppe-datenschutz">
                      <span className={ui.kicker}>Datenschutz</span>
                      <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
                        <input type="checkbox" name="datenschutz" value="1" className={`${ui.choiceInput} mt-0.5`} onChange={() => loescheFehler("datenschutz")} />
                        <span>
                          Ich habe die <Link href="/datenschutz" className="font-semibold text-accent underline underline-offset-2" target="_blank" rel="noopener">Datenschutzerklärung</Link>{" "}
                          gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Anfrage zu.{pflichtStern}
                        </span>
                      </label>
                      {fehler.datenschutz && <p className={ui.fehler}>{fehler.datenschutz}</p>}
                      <details className="mt-3 text-sm text-mute">
                        <summary className="cursor-pointer font-semibold text-ink-2">Hinweis zur Datenverarbeitung</summary>
                        <p className="mt-2 leading-relaxed">
                          Verantwortlich ist {anfrageKontakt.verantwortlich}. Ihre Angaben werden ausschließlich zur Bearbeitung der Anfrage verwendet.
                          Sie können Ihre Einwilligung jederzeit per E-Mail an{" "}
                          <a href={`mailto:${anfrageKontakt.email}`} className="font-semibold text-accent underline underline-offset-2">{anfrageKontakt.email}</a>{" "}
                          widerrufen.
                        </p>
                      </details>
                    </div>

                    <label className="absolute left-[-9999px] top-auto size-px overflow-hidden" aria-hidden="true">
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className={ui.stageActions} data-panel-actions>
                    <button type="button" className={ui.btnSecondary} onClick={() => zurueck(2)}>Zurück</button>
                    <button type="submit" className={ui.btnPrimary} disabled={sendet}>
                      {sendet ? "Wird gesendet …" : (aktuellerPfad?.submitLabel ?? "Anfrage senden")} <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </section>
              </fieldset>

              {/* ================= Störfallpfad ================= */}
              <section hidden={!akut} className={ui.panel} aria-labelledby="anfrage-stoerfall">
                <fieldset className={ui.panelWrapper} disabled={!akut}>
                  <div className={`${ui.panelHead} border-signal/25 bg-signal/[0.05]`}>
                    <button type="button" className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-mute underline underline-offset-4 hover:text-ink" onClick={zurueckZuStandard}>
                      ← Kein Störfall, zurück zur normalen Anfrage
                    </button>
                    <h4 id="anfrage-stoerfall" tabIndex={-1} className={ui.panelTitle}>Störfall melden</h4>
                    <p className={ui.panelLead}>
                      Wenn es eilt, rufen Sie an: <a href={anfrageKontakt.telefonLink} className="font-bold text-signal-dark underline underline-offset-2">{anfrageKontakt.telefonAnzeige}</a>.
                      Das Formular ist der schriftliche Weg – wir brauchen nur das Nötigste.
                    </p>
                  </div>

                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <Gruppe id="gruppe-a_bereich" fehlerText={fehler.a_bereich}>
                      <legend className={ui.legend}>Was ist betroffen?{pflichtStern}</legend>
                      <div className={ui.choiceGrid} onChange={() => loescheFehler("a_bereich")}>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_bereich" value="rohrleitung" className={ui.choiceInput} /><span>Rohrleitung oder Behälter</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_bereich" value="stahlbau" className={ui.choiceInput} /><span>Stahlkonstruktion</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_bereich" value="anlage" className={ui.choiceInput} /><span>Anlagenkomponente</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_bereich" value="gfk" className={ui.choiceInput} /><span>GFK-Bauteil</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_bereich" value="unklar" className={ui.choiceInput} /><span>Noch unklar</span></label>
                      </div>
                    </Gruppe>

                    <Gruppe id="gruppe-a_betrieb" fehlerText={fehler.a_betrieb}>
                      <legend className={ui.legend}>Wie stark ist der Betrieb betroffen?{pflichtStern}</legend>
                      <div className={ui.choiceGridThree} onChange={() => loescheFehler("a_betrieb")}>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_betrieb" value="stillstand" className={ui.choiceInput} /><span>Produktion steht</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_betrieb" value="eingeschraenkt" className={ui.choiceInput} /><span>Eingeschränkter Betrieb</span></label>
                        <label className={ui.choiceSignal}><input type="radio" name="stoerfall_betrieb" value="laeuft" className={ui.choiceInput} /><span>Läuft noch</span></label>
                      </div>
                    </Gruppe>

                    <Gruppe id="gruppe-a_beschreibung" fehlerText={fehler.a_beschreibung}>
                      <label className={ui.field}>
                        <span className={ui.fieldLabel}>Was ist passiert?{pflichtStern}</span>
                        <textarea name="beschreibung" rows={3} maxLength={3000} className={ui.textarea} placeholder="Schadensbild, betroffenes Medium und aktuelle Situation." aria-invalid={fehler.a_beschreibung ? true : undefined} onChange={() => loescheFehler("a_beschreibung")} />
                      </label>
                    </Gruppe>

                    <Gruppe id="gruppe-a_plz" fehlerText={fehler.a_plz}>
                      <legend className={ui.legend}>Standort</legend>
                      <div className={ui.fieldGrid}>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Postleitzahl{pflichtStern}</span>
                          <input type="text" name="plz" inputMode="numeric" autoComplete="postal-code" maxLength={10} className={`${ui.input} sm:max-w-[11rem]`} aria-invalid={fehler.a_plz ? true : undefined} onChange={() => loescheFehler("a_plz")} />
                        </label>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Ort oder Werk <span className={ui.hint}>optional</span></span>
                          <input type="text" name="ort" autoComplete="address-level2" maxLength={120} className={ui.input} />
                        </label>
                      </div>
                    </Gruppe>

                    {contactUploadsEnabled && (
                      <Gruppe>
                        <legend className={ui.legend}>Fotos der Schadensstelle <span className={ui.hint}>optional</span></legend>
                        {uploadFeld("stoerfall", "signal")}
                      </Gruppe>
                    )}

                    <Gruppe>
                      <legend className={ui.legend}>Kontakt</legend>
                      <div className={ui.fieldGrid}>
                        <label className={ui.field} id="gruppe-a_firma">
                          <span className={ui.fieldLabel}>Unternehmen{pflichtStern}</span>
                          <input type="text" name="firma" autoComplete="organization" maxLength={160} className={ui.input} aria-invalid={fehler.a_firma ? true : undefined} onChange={() => loescheFehler("a_firma")} />
                          {fehler.a_firma && <span className={ui.fehler}>{fehler.a_firma}</span>}
                        </label>
                        <label className={ui.field} id="gruppe-a_name">
                          <span className={ui.fieldLabel}>Ihr Name{pflichtStern}</span>
                          <input type="text" name="name" autoComplete="name" maxLength={160} className={ui.input} aria-invalid={fehler.a_name ? true : undefined} onChange={() => loescheFehler("a_name")} />
                          {fehler.a_name && <span className={ui.fehler}>{fehler.a_name}</span>}
                        </label>
                        <label className={`${ui.field} ${ui.fieldWide}`} id="gruppe-a_telefon">
                          <span className={ui.fieldLabel}>Telefon für Rückruf{pflichtStern}</span>
                          <input type="tel" name="telefon" autoComplete="tel" inputMode="tel" maxLength={50} className={ui.input} aria-invalid={fehler.a_telefon ? true : undefined} onChange={() => loescheFehler("a_telefon")} />
                          {fehler.a_telefon && <span className={ui.fehler}>{fehler.a_telefon}</span>}
                        </label>
                      </div>
                    </Gruppe>

                    <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4" id="gruppe-a_datenschutz">
                      <span className={ui.kicker}>Datenschutz</span>
                      <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
                        <input type="checkbox" name="datenschutz" value="1" className={`${ui.choiceInput} mt-0.5`} onChange={() => loescheFehler("a_datenschutz")} />
                        <span>
                          Ich habe die <Link href="/datenschutz" className="font-semibold text-accent underline underline-offset-2" target="_blank" rel="noopener">Datenschutzerklärung</Link>{" "}
                          gelesen und stimme der Verarbeitung meiner Angaben zu.{pflichtStern}
                        </span>
                      </label>
                      {fehler.a_datenschutz && <p className={ui.fehler}>{fehler.a_datenschutz}</p>}
                    </div>
                  </div>

                  <div className={ui.stageActions} data-panel-actions>
                    <button type="button" className={ui.btnSecondary} onClick={zurueckZuStandard}>Anderes Anliegen</button>
                    <button type="submit" className={ui.btnSignal} disabled={sendet}>
                      {sendet ? "Wird gesendet …" : stoerfall.submitLabel} <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </fieldset>
              </section>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
