"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  anfrageKontakt,
  baueZusammenfassung,
  findePfad,
  pfade,
  pruefeKontaktweg,
  pruefeUpload,
  stoerfall,
  upload,
  versandGesperrtMeldung,
  wurdeZuSchnellAusgefuellt
} from "@/lib/anfrage";
import { contactUploadsEnabled, leseFormularWerte, sendeFormular, versandFreigeschaltet } from "@/lib/contact";
import { AnfrageTrustKarte } from "./AnfrageTrustKarte";
import * as ui from "./anfrage-ui";

/**
 * Anfrageformular – dreistufiger Assistent mit eigenem Störfallpfad.
 *
 * Alle Stufen bleiben gerendert (Werte gehen beim Blättern nicht verloren);
 * unsichtbare Bereiche werden über hidden + disabled von der FormData
 * ausgeschlossen. Inhalte und Prüffunktionen: src/lib/anfrage.ts.
 */

const STUFEN_LABELS = ["Leistungen wählen", "Projekt beschreiben", "Kontaktdaten"];

const FEHLER_REIHENFOLGE = [
  "leistungen",
  "firma", "name", "kontaktweg", "datenschutz",
  "a_betrieb", "a_beschreibung", "a_plz", "a_firma", "a_name", "a_telefon", "a_datenschutz"
] as const;

type Fehler = Partial<Record<(typeof FEHLER_REIHENFOLGE)[number], string>>;
type UploadAnzeige = { text: string; fehler: boolean; anzahl: number };

const uploadStart: UploadAnzeige = { text: "Noch keine Datei ausgewählt", fehler: false, anzahl: 0 };

/** Dauer des Verwehens in ms — identisch zur Transition in ui.schleier. */
const SCHLEIER_DAUER = 600;

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
  sichtbar = true,
  fehlerText,
  children
}: {
  id?: string;
  sichtbar?: boolean;
  fehlerText?: string;
  children: ReactNode;
}) {
  return (
    <fieldset id={id} className={ui.group} hidden={!sichtbar} disabled={!sichtbar}>
      {children}
      {fehlerText && <p className={ui.fehler}>{fehlerText}</p>}
    </fieldset>
  );
}

// Vollständige Klassenketten je Farbe, damit Tailwind sie statisch findet.
const uploadStil = {
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
  const [ausgewaehltePfade, setAusgewaehltePfade] = useState<string[]>([]);
  const [akut, setAkut] = useState(false);
  // Der Schleier deckt die rechte Spalte ab, bis der Kunde ihn bewusst löst.
  const [schleier, setSchleier] = useState<"zu" | "weht" | "offen">("zu");
  const [erfolg, setErfolg] = useState(false);
  const [sendet, setSendet] = useState(false);
  const jsBereit = useHydriert();
  const [statusMeldung, setStatusMeldung] = useState("");
  const [fehler, setFehler] = useState<Fehler>({});
  const [zeitrahmen, setZeitrahmen] = useState("");
  const [stoerfallUpload, setStoerfallUpload] = useState<UploadAnzeige>(uploadStart);
  const [zusammenfassung, setZusammenfassung] = useState<Array<[string, string]>>([]);

  // Ohne JavaScript gibt es keinen Schleier: das Formular bleibt im statischen
  // Export vollständig bedienbar (wie schon die Fortschrittsleiste).
  const schleierAktiv = jsBereit && schleier !== "offen";
  // Gesperrt nur bis zum Klick — während des Verwehens ist das Formular schon
  // bedienbar (der Schleier lässt Zeiger durch) und kann den Fokus annehmen.
  const formularGesperrt = jsBereit && schleier === "zu";

  const ausgewaehlteLeistungen = pfade.filter((pfad) => ausgewaehltePfade.includes(pfad.id));
  const leistungsanzeige = ausgewaehlteLeistungen.length
    ? ausgewaehlteLeistungen.map((pfad) => pfad.label).join(", ")
    : "noch keine gewählt";

  /* ------------------------------------------------------------- Start & CTAs */

  // Deeplinks (?pfad=...) lassen sich nur nach der Hydration anwenden: ein
  // useState-Initializer liefe schon beim statischen Prerender und erzeugte
  // einen Hydration-Mismatch.
  useEffect(() => {
    startedAt.current = Date.now();
    const ziel = findePfad(new URLSearchParams(window.location.search).get("pfad"));
    if (!ziel) return;
    // Wer mit Absicht kommt, braucht den Schleier gar nicht erst zu sehen.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Übernahme des URL-Zustands
    setSchleier("offen");
    if (ziel === stoerfall.id) {
      setAkut(true);
    } else {
      setAusgewaehltePfade([ziel]);
      setStufe(2);
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const ziel = findePfad((event as CustomEvent<string>).detail);
      if (!ziel) return;
      setErfolg(false);
      schleierLoesen();
      if (ziel === stoerfall.id) {
        setAkut(true);
      } else {
        setAkut(false);
        setAusgewaehltePfade([ziel]);
        setStufe(2);
      }
      fokusGewuenscht.current = true;
    };
    window.addEventListener("tts:select-service", handler);
    return () => window.removeEventListener("tts:select-service", handler);
  }, []);

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
  }, [fehler, ausgewaehltePfade, zeitrahmen, statusMeldung]);

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

  // Der Fokus wandert erst hier ins Formular: im Klickmoment ist es noch inert.
  // Auf schmalen Bildschirmen war der Schleier höher als das Bild — dann holt
  // seiteZumFormular() den Formularkopf zurück ins Blickfeld (im pult-Modus
  // steht das Formular ohnehin komplett, dort bewegt sich nichts).
  useEffect(() => {
    if (schleier !== "weht") return;
    seiteZumFormular();
    sichtbaresPanel(formRef.current)?.querySelector<HTMLElement>("h4")?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => setSchleier("offen"), SCHLEIER_DAUER);
    return () => window.clearTimeout(timer);
  }, [schleier]);

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

  const leseWerte = () => leseFormularWerte(formRef.current);

  function pruefeStufe(nummer: number, werte: Record<string, string>): Fehler {
    const neu: Fehler = {};
    if (nummer === 1 && ausgewaehltePfade.length === 0) neu.leistungen = "Bitte wählen Sie mindestens eine Leistung.";
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
    schleierLoesen();
    setAkut(true);
  }

  /** Startet das Verwehen; der Effekt unten beendet es nach SCHLEIER_DAUER. */
  function schleierLoesen() {
    setSchleier((bisher) => (bisher === "zu" ? "weht" : bisher));
  }

  function zurueckZuStandard() {
    fokusGewuenscht.current = true;
    setFehler({});
    setAkut(false);
    setStufe(1);
  }

  function leistungUmschalten(id: string, ausgewaehlt: boolean) {
    setAusgewaehltePfade((bisher) => {
      if (ausgewaehlt) return bisher.includes(id) ? bisher : [...bisher, id];
      return bisher.filter((pfad) => pfad !== id);
    });
    loescheFehler("leistungen");
  }

  /* ------------------------------------------------------------------ Uploads */

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const feld = event.currentTarget;
    const dateien = Array.from(feld.files ?? []);
    const meldung = pruefeUpload(dateien);
    if (meldung) {
      feld.value = "";
      setStoerfallUpload({ text: meldung, fehler: true, anzahl: 0 });
      return;
    }
    setStoerfallUpload({
      text: dateien.length ? dateien.map((datei) => datei.name).join(", ") : uploadStart.text,
      fehler: false,
      anzahl: dateien.length
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
      setZusammenfassung(baueZusammenfassung({ akut, pfade: ausgewaehltePfade, werte }));
      setErfolg(true);
      return;
    }

    if (wurdeZuSchnellAusgefuellt(startedAt.current)) {
      setStatusMeldung("Die Anfrage wurde ungewöhnlich schnell ausgefüllt. Bitte prüfen Sie Ihre Angaben und senden Sie erneut.");
      return;
    }

    // Vor dem Sendezustand prüfen: ohne Freischaltung soll kein "Wird
    // gesendet …" aufblitzen, der Hinweis steht sofort.
    if (!versandFreigeschaltet) {
      setStatusMeldung(versandGesperrtMeldung);
      return;
    }

    const form = event.currentTarget;
    const daten = new FormData(form);
    daten.delete("website");
    daten.set("pfad_aktiv", akut ? stoerfall.id : ausgewaehltePfade.join(", "));

    // Leere Datei-Slots entfernen; echte Anhänge unter dem von Web3Forms
    // erwarteten Feldnamen anhängen.
    const anhaenge = daten.getAll("unterlagen[]").filter((eintrag): eintrag is File => eintrag instanceof File && eintrag.size > 0);
    daten.delete("unterlagen[]");
    anhaenge.forEach((datei) => daten.append("attachment", datei));

    setSendet(true);
    setStatusMeldung("");
    const betreff = akut ? "Störfallmeldung über das Anfrageformular" : `Anfrage: ${leistungsanzeige}`;
    const ergebnis = await sendeFormular(daten, betreff, werte.name ?? "");
    setSendet(false);

    if (ergebnis === "gesendet") {
      setZusammenfassung(baueZusammenfassung({ akut, pfade: ausgewaehltePfade, werte }));
      setErfolg(true);
      return;
    }
    setStatusMeldung(ergebnis === "gesperrt"
      ? versandGesperrtMeldung
      : "Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
  }

  /* ------------------------------------------------------------------- Markup */

  const pflichtStern = <span className="text-signal" aria-hidden="true"> *</span>;

  const uploadFeld = (
    <label className={uploadStil.signal.rahmen}>
      <input
        type="file"
        name="unterlagen[]"
        className="sr-only"
        accept={upload.akzeptiert}
        multiple
        aria-describedby="upload-hinweis-stoerfall"
        onChange={handleUpload}
      />
      <strong className={uploadStil.signal.text}>Dateien auswählen</strong>
      <small id="upload-hinweis-stoerfall" className="mt-1 block text-xs text-mute">{upload.hinweis}</small>
      <em className={`mt-2 block text-xs font-semibold not-italic ${stoerfallUpload.fehler ? "text-signal-dark" : "text-ink-2"}`}>
        {stoerfallUpload.text}
      </em>
    </label>
  );

  return (
    <div ref={wurzelRef} className="anfrage">
      <div className="grid gap-7 lg:grid-cols-[minmax(350px,390px)_minmax(0,1fr)] xl:grid-cols-[minmax(390px,430px)_minmax(0,1fr)] pult:h-[calc(100svh-var(--anfrage-kopf,102px)-5rem)] pult:max-h-[54rem]">
        {/* Linke Spalte: Ansprechpartner und Direktkontakt. Die Überschrift
            steht nur noch für Screenreader da — die Sektion in page.tsx nennt
            sich über aria-labelledby danach, sichtbar wäre sie Ballast. */}
        <div className="flex min-w-0 flex-col pult:min-h-0 pult:overflow-y-auto pult:pr-1">
          <h2 id="anfrage-titel" className="sr-only">Sagen Sie uns, was ansteht.</h2>
          <AnfrageTrustKarte onStoerfall={zeigeStoerfall} stoerfallAktiv={akut} />
        </div>

        <div className="relative flex min-w-0 flex-col pult:min-h-0">
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
          <form ref={formRef} className="flex min-w-0 flex-col pult:min-h-0 pult:flex-1" method="post" encType="multipart/form-data" noValidate hidden={erfolg} inert={formularGesperrt} onSubmit={absenden}>
            <input type="hidden" name="js_enabled" value={jsBereit ? "1" : "0"} />
            <input type="hidden" name="pfad_aktiv" value={akut ? stoerfall.id : ausgewaehltePfade.join(", ")} />

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
                <span>Leistungen: <strong className="font-semibold text-ink-2">{leistungsanzeige}</strong></span>
                {stufe === 2
                  ? <span>Alle Angaben in diesem Schritt sind optional.</span>
                  : <span>Mit <span className="text-signal" aria-hidden="true">*</span> markierte Felder brauchen wir.</span>}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft pult:flex pult:min-h-0 pult:flex-1 pult:flex-col">
              <fieldset className={ui.panelWrapper} hidden={akut} disabled={akut}>
                {/* ================= Stufe 1 ================= */}
                <section hidden={akut || stufe !== 1} className={ui.panel} aria-labelledby="anfrage-stufe-1">
                  <div className={ui.panelHead}>
                    <h4 id="anfrage-stufe-1" tabIndex={-1} className={ui.panelTitle}>Worum geht es?</h4>
                    <p className={ui.panelLead}>
                      Wählen Sie eine oder mehrere Leistungen. Danach folgen nur noch allgemeine Angaben zu Ihrem Vorhaben.
                    </p>
                  </div>
                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <Gruppe id="gruppe-leistungen" fehlerText={fehler.leistungen}>
                      <legend className={ui.legend}>
                        Leistungen{pflichtStern}
                        <span className={ui.hint}>mehrere möglich</span>
                        <span className="sr-only">Pflichtfeld</span>
                      </legend>
                      <div className={ui.choiceGrid}>
                        {pfade.map((p) => (
                          <label key={p.id} className={ui.choice}>
                            <input
                              type="checkbox"
                              name="leistungen[]"
                              value={p.id}
                              className={ui.choiceInput}
                              checked={ausgewaehltePfade.includes(p.id)}
                              onChange={(event) => leistungUmschalten(p.id, event.currentTarget.checked)}
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
                      Weiter zu den Angaben <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </section>

                {/* ================= Stufe 2 ================= */}
                <section hidden={akut || stufe !== 2} className={ui.panel} aria-labelledby="anfrage-stufe-2">
                  <div className={ui.panelHead}>
                    <h4 id="anfrage-stufe-2" tabIndex={-1} className={ui.panelTitle}>Was sollten wir über das Vorhaben wissen?</h4>
                    <p className={ui.panelLead}>
                      Ein kurzer Überblick reicht. Fehlende technische Details klären wir anschließend gemeinsam.
                    </p>
                  </div>

                  <div className={ui.panelBody} data-panel-body onScroll={(event) => ueberlaufPruefen(event.currentTarget)}>
                    <Gruppe>
                      <label className={ui.field}>
                        <span className={ui.fieldLabel}>Beschreiben Sie Ihr Vorhaben <span className={ui.hint}>optional</span></span>
                        <textarea
                          name="beschreibung"
                          rows={4}
                          maxLength={3000}
                          className={ui.textarea}
                          placeholder="Ein paar Sätze zur Ausgangslage und zum gewünschten Ergebnis."
                        />
                      </label>
                      <p className="mt-2 text-xs text-mute">
                        Fehlende Maße, Werkstoffe oder Normen sind kein Hindernis – das klären wir gemeinsam.
                      </p>
                    </Gruppe>

                    <Gruppe>
                      <legend className={ui.legend}>Einsatzort <span className={ui.hint}>optional</span></legend>
                      <div className={ui.locationGrid}>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Postleitzahl</span>
                          <input
                            type="text"
                            name="plz"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            maxLength={10}
                            className={ui.input}
                          />
                        </label>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Ort oder Werk</span>
                          <input type="text" name="ort" autoComplete="address-level2" maxLength={120} className={ui.input} />
                        </label>
                      </div>
                    </Gruppe>

                    <Gruppe>
                      <legend className={ui.legend}>Zeitrahmen <span className={ui.hint}>optional</span></legend>
                      <div
                        className={ui.choiceGrid}
                        onChange={(event) => {
                          const ziel = event.target as HTMLInputElement;
                          if (ziel.name === "zeitrahmen") setZeitrahmen(ziel.value);
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

                    <p className={ui.infoBox}>
                      Mit dem Absenden entsteht noch kein Auftrag. Wir prüfen Ihre Angaben und melden uns mit Rückfragen oder einem Terminvorschlag.
                    </p>

                    <div className={ui.consentBox} id="gruppe-datenschutz">
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
                      {sendet ? "Wird gesendet …" : "Anfrage senden"} <ArrowRight className="size-4" aria-hidden="true" />
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
                      <div className={ui.locationGrid}>
                        <label className={ui.field}>
                          <span className={ui.fieldLabel}>Postleitzahl{pflichtStern}</span>
                          <input type="text" name="plz" inputMode="numeric" autoComplete="postal-code" maxLength={10} className={ui.input} aria-invalid={fehler.a_plz ? true : undefined} onChange={() => loescheFehler("a_plz")} />
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
                        {uploadFeld}
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

                    <div className={ui.consentBox} id="gruppe-a_datenschutz">
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

          {/* ---------- Schleier ---------- */}
          {/* Liegt über Fortschritt und Panel, außerhalb des <form> (kein
              Einfluss auf FormData). Das Formular darunter bleibt gerendert:
              die Höhenmessung läuft weiter und beim Aufdecken springt nichts. */}
          {schleierAktiv && (
            <div className={`${ui.schleier} ${schleier === "weht" ? ui.schleierWeht : ""}`}>
              <div className={ui.schleierInhalt}>
                <div className="max-w-[32ch] text-center">
                  <p className="font-display text-3xl font-bold leading-tight tracking-normal text-carbon sm:text-4xl">
                    Wollen Sie uns mehr Details geben?
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-carbon/80">
                    Ein paar Angaben zu Ihrem Vorhaben – Sie brauchen kein fertiges Leistungsverzeichnis.
                  </p>
                  <button type="button" className={`${ui.btnDark} mt-7`} onClick={schleierLoesen}>
                    Ja, gerne <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
