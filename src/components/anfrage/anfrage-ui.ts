/**
 * Wiederkehrende Tailwind-Klassenketten des Anfrageformulars.
 *
 * Bewusst als Konstanten statt @apply: bleibt reines Tailwind und steht nur an
 * einer Stelle. Die Tokens (surface, ink, mute, line, accent, signal) sind in
 * tailwind.config.ts auf die Site-Palette gemappt.
 */

/** Kleines Kicker-Label über Panels und Karten (entspricht .eyebrow der Site) */
export const kicker = "font-body text-[0.67rem] font-extrabold uppercase tracking-[0.14em] text-mute";

/** Auswahlkarte (Radio oder Checkbox) */
export const choice = [
  "relative flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-xl",
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
export const choiceGrid = "grid gap-2.5 sm:grid-cols-2";
export const choiceGridThree = "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3";

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
export const fieldWide = "sm:col-span-2";

/** Fehlermeldung unter einer Fragengruppe */
export const fehler = "mt-2 block text-sm font-semibold text-signal-dark";

/** Buttons */
export const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
export const btnPrimary = `${btnBase} bg-gold text-carbon hover:bg-[#F4BD70] focus-visible:outline-accent disabled:opacity-60`;
export const btnSecondary = `${btnBase} border border-line bg-surface text-ink-2 hover:border-ink-2/40 hover:text-ink focus-visible:outline-accent`;
export const btnSignal = `${btnBase} bg-signal text-white hover:bg-signal-dark focus-visible:outline-signal disabled:opacity-60`;

/** Aktionsleiste am Panelfuß */
export const stageActions =
  "flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-5 py-4 sm:px-8";

/** Panelkopf */
export const panelHead = "border-b border-line px-5 pb-5 pt-7 sm:px-8";
export const panelTitle = "font-display text-2xl font-bold leading-tight tracking-normal text-ink sm:text-3xl";
export const panelLead = "mt-2 max-w-[60ch] text-sm leading-relaxed text-mute";

/** Scrollbereich eines Panels */
export const panelBody = "px-5 py-6 sm:px-8";

/** Kontaktkanal-Link (Trust-Karte) */
export const channel =
  "flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const channelIcon = "grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent";
