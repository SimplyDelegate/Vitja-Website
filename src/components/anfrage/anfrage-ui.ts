/**
 * Wiederkehrende Tailwind-Klassenketten des Anfrageformulars.
 *
 * Bewusst als Konstanten statt @apply: bleibt reines Tailwind und steht nur an
 * einer Stelle. Die Tokens (surface, ink, mute, line, accent, signal) sind in
 * tailwind.config.ts auf die Site-Palette gemappt.
 */

/** Kleines Kicker-Label über Panels und Karten (entspricht .eyebrow der Site) */
export const kicker = "font-body text-xs font-extrabold uppercase tracking-[0.14em] leading-snug text-mute";

/** Auswahlkarte (Radio oder Checkbox) */
export const choice = [
  "relative flex h-full min-h-14 cursor-pointer items-center gap-3 rounded-xl",
  "border border-line bg-surface-2 px-4 py-3 text-sm font-semibold leading-snug text-ink-2",
  "transition-colors duration-150",
  "hover:border-ink-2/40 hover:bg-surface",
  "has-[:checked]:border-accent has-[:checked]:bg-accent/[0.06] has-[:checked]:text-ink",
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
].join(" ");

/** Auswahlkarte im Störfall-Kontext */
export const choiceSignal = choice
  .replace("has-[:checked]:border-accent", "has-[:checked]:border-signal")
  .replace("has-[:checked]:bg-accent/[0.06]", "has-[:checked]:bg-signal/[0.07]")
  .replace("has-[:focus-visible]:outline-accent", "has-[:focus-visible]:outline-signal");

/** Der eigentliche Radio-/Checkbox-Input in einer Auswahlkarte */
export const choiceInput = "size-4 shrink-0 accent-accent";

/** Grid für Auswahlkarten */
export const choiceGrid = "grid gap-3 sm:grid-cols-2";
export const choiceGridThree = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

/** Fieldset einer Fragengruppe */
export const group = "block min-w-0 border-0 p-0 m-0 [&+&]:mt-7";

/** Legende einer Fragengruppe */
export const legend = "mb-3 w-full font-body text-[0.95rem] font-bold leading-tight text-ink";

/** Kleiner Zusatz in Legende oder Label ("optional") */
export const hint = "ml-1.5 font-body text-xs font-medium text-mute";

/** Label-Wrapper für Eingabefelder */
export const field = "flex min-w-0 flex-col gap-1.5";
export const fieldLabel = "text-sm font-semibold text-ink-2";

/** Eingabefelder */
export const input = [
  "min-h-[3rem] w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5",
  "text-[0.95rem] text-ink placeholder:text-mute/70",
  "transition-colors duration-150",
  "focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/25",
  "aria-[invalid=true]:border-signal aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-signal/20"
].join(" ");

export const textarea = `${input} min-h-[9.5rem] resize-y leading-relaxed`;

/** Feldraster */
export const fieldGrid = "grid gap-3 sm:grid-cols-2";
export const locationGrid = "grid gap-3 sm:grid-cols-[minmax(9rem,11rem)_minmax(0,1fr)]";
export const fieldWide = "sm:col-span-2";

/** Fehlermeldung unter einer Fragengruppe */
export const fehler = "mt-2 block text-sm font-semibold text-signal-dark";

/** Ruhige Informations- und Zustimmungsflächen im Fragenbereich */
export const infoBox = "mt-7 rounded-xl border border-line bg-surface-2 p-4 text-sm leading-relaxed text-mute";
export const consentBox = "mt-7 rounded-xl border border-line bg-surface-2 p-4";

/** Buttons */
export const btnBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
export const btnPrimary = `${btnBase} bg-gold text-carbon hover:bg-[#F4BD70] focus-visible:outline-accent disabled:opacity-60`;
export const btnSecondary = `${btnBase} border border-line bg-surface text-ink-2 hover:border-ink-2/40 hover:text-ink focus-visible:outline-accent`;
export const btnSignal = `${btnBase} bg-signal text-white hover:bg-signal-dark focus-visible:outline-signal disabled:opacity-60`;

/**
 * Aktionsleiste am Panelfuß. Bleibt im pult-Modus unten stehen; `data-mehr`
 * setzt die Logik, solange oberhalb noch Inhalt weiterscrollt — der zugehörige
 * Schatten steht als [data-mehr]-Regel in globals.css.
 */
export const stageActions = [
  "flex shrink-0 flex-wrap items-center justify-between gap-3",
  "border-t border-line bg-surface px-5 py-4 sm:px-8",
  "transition-shadow duration-200"
].join(" ");

/** Panelkopf — bleibt im pult-Modus stehen */
export const panelHead = "shrink-0 border-b border-line px-5 pb-5 pt-7 sm:px-8";
export const panelTitle = "font-display text-2xl font-bold leading-tight tracking-normal text-ink sm:text-3xl";
export const panelLead = "mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-mute";

/**
 * Fragenbereich eines Panels. Im pult-Modus der einzige Bereich, der scrollt —
 * Kopf und Aktionsleiste bleiben sichtbar, die Seite selbst steht still.
 */
export const panelBody = [
  "px-5 py-6 sm:px-8",
  "pult:min-h-0 pult:flex-1 pult:overflow-y-auto pult:overscroll-contain",
  "pult:focus-visible:outline pult:focus-visible:-outline-offset-2 pult:focus-visible:outline-accent"
].join(" ");

/** Stufen-/Störfallpanel: im pult-Modus Flex-Spalte auf voller Arbeitsflächenhöhe */
export const panel = "pult:flex pult:min-h-0 pult:flex-1 pult:flex-col";

/** Fieldset-Wrapper (disabled-Schaltung), muss die Flex-Kette durchreichen */
export const panelWrapper = "m-0 block min-w-0 border-0 p-0 pult:flex pult:min-h-0 pult:flex-1 pult:flex-col";

/** Kontaktkanal-Link (Trust-Karte) */
export const channel =
  "flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const channelIcon = "grid size-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent";
