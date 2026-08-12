import { ArrowRight, Mail, MapPin, PhoneCall, TriangleAlert } from "lucide-react";
import { anfrageKontakt, stoerfall } from "@/lib/anfrage";
import * as ui from "./anfrage-ui";

/**
 * Seitenspalte des Anfrageformulars: Ansprechpartner, Direktkontakt inkl.
 * Störfall-Shortcut, Einsatzgebiet. Inhalte kommen aus siteConfig über
 * lib/anfrage.ts. Im pult-Modus kompakter, damit Überschrift und Karte
 * zusammen in die feste Rasterhöhe passen.
 */
export function AnfrageTrustKarte({
  onStoerfall,
  stoerfallAktiv
}: {
  /** Öffnet das Störfall-Panel im Formular (Shortcut liegt außerhalb des <form>). */
  onStoerfall: () => void;
  stoerfallAktiv: boolean;
}) {
  return (
    <aside
      className="flex min-w-0 shrink-0 flex-col gap-6 rounded-2xl border border-line bg-surface-2 p-6 pult:gap-5 pult:p-5"
      aria-labelledby="anfrage-ansprechpartner"
    >
      <div>
        <span className={ui.kicker}>Ihr Ansprechpartner</span>
        <h3 id="anfrage-ansprechpartner" className="mt-3 font-display text-2xl font-bold tracking-normal text-ink">
          {anfrageKontakt.ansprechpartner}
        </h3>
        <p className="mt-1 text-sm font-semibold text-accent">{anfrageKontakt.rolle}</p>

        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          <strong className="block font-semibold text-ink">Sie brauchen kein fertiges Leistungsverzeichnis.</strong>
          <span className="mt-1 block text-mute">
            Schildern Sie, was ansteht. Fehlende Angaben zu Werkstoff, Maßen oder Terminen klären wir gemeinsam – telefonisch oder direkt an Ihrer Anlage.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2" aria-label="Direkter Kontakt">
        <a href={anfrageKontakt.telefonLink} className={ui.channel}>
          <span className={ui.channelIcon}><PhoneCall className="size-[18px]" aria-hidden="true" /></span>
          <span className="min-w-0">
            <small className="block text-xs text-mute">Telefon</small>
            <strong className="block truncate text-sm font-bold text-ink">{anfrageKontakt.telefonAnzeige}</strong>
          </span>
        </a>

        <a href={`mailto:${anfrageKontakt.email}`} className={ui.channel}>
          <span className={ui.channelIcon}><Mail className="size-[18px]" aria-hidden="true" /></span>
          <span className="min-w-0">
            <small className="block text-xs text-mute">E-Mail</small>
            <strong className="block truncate text-sm font-bold text-ink">{anfrageKontakt.email}</strong>
          </span>
        </a>

        <a
          href={`?pfad=${stoerfall.id}#kontakt`}
          aria-current={stoerfallAktiv || undefined}
          onClick={(event) => { event.preventDefault(); onStoerfall(); }}
          className="flex items-center gap-3 rounded-xl border border-signal/35 bg-signal/[0.05] px-3.5 py-3 transition-colors hover:border-signal/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal aria-[current]:border-signal/60"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal" aria-hidden="true">
            <TriangleAlert className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <small className="block text-xs text-mute">Störfall oder Anlagenstillstand</small>
            <strong className="block truncate text-sm font-bold text-ink">Kurzformular öffnen</strong>
          </span>
          <ArrowRight className="size-4 shrink-0 text-signal" aria-hidden="true" />
        </a>
      </div>

      {/* Im pult-Modus ausgeblendet: Karte und Überschrift teilen sich die feste
          Rasterhöhe, und das Einsatzgebiet steht bereits im Hero-Text. */}
      <section aria-labelledby="anfrage-einsatzgebiet" className="border-t border-line pt-5 pult:hidden">
        <span id="anfrage-einsatzgebiet" className={ui.kicker}>
          <MapPin className="mr-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
          Einsatzgebiet
        </span>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-2">{anfrageKontakt.einsatzgebiet}</p>
        <small className="mt-1 block text-xs text-mute">{anfrageKontakt.einsatzgebietZusatz}</small>
      </section>
    </aside>
  );
}
