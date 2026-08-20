import { ArrowRight, Mail, MapPin, PhoneCall, TriangleAlert } from "lucide-react";
import { anfrageKontakt, stoerfall } from "@/lib/anfrage";
import * as ui from "./anfrage-ui";

/**
 * Seitenspalte des Anfrageformulars: Ansprechpartner, Direktkontakt inkl.
 * Störfall-Shortcut, Einsatzgebiet. Inhalte kommen aus siteConfig über
 * lib/anfrage.ts. Im pult-Modus füllt die Karte die feste Rasterhöhe der
 * Spalte und verteilt ihre Blöcke, damit sie so hoch steht wie das Formular.
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
      className="flex min-w-0 shrink-0 flex-col gap-7 rounded-2xl border border-line bg-surface-2 p-6 sm:p-7 pult:min-h-full pult:justify-between pult:gap-6 pult:p-6"
      aria-labelledby="anfrage-ansprechpartner"
    >
      <div>
        <span className={ui.kicker}>Ihr Ansprechpartner</span>
        <h3 id="anfrage-ansprechpartner" className="mt-3 font-display text-[2rem] font-bold leading-none tracking-normal text-ink">
          {anfrageKontakt.ansprechpartner}
        </h3>
        <p className="mt-2 text-base font-bold text-accent">{anfrageKontakt.rolle}</p>

        <div className="mt-6">
          <p className="rounded-xl border border-gold/70 bg-gold/25 px-4 py-3.5 text-[1.05rem] font-extrabold leading-snug text-ink">
            Sie brauchen kein fertiges Leistungsverzeichnis.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">
            Schildern Sie, was ansteht. Fehlende Angaben zu Werkstoff, Maßen oder Terminen klären wir gemeinsam – telefonisch oder direkt an Ihrer Anlage.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5" aria-label="Direkter Kontakt">
        <a href={anfrageKontakt.telefonLink} className={ui.channel}>
          <span className={ui.channelIcon}><PhoneCall className="size-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <small className="block text-sm leading-tight text-mute">Telefon</small>
            <strong className="mt-0.5 block whitespace-nowrap text-[0.95rem] font-bold leading-snug text-ink xl:text-base">{anfrageKontakt.telefonAnzeige}</strong>
          </span>
        </a>

        <a href={`mailto:${anfrageKontakt.email}`} className={ui.channel}>
          <span className={ui.channelIcon}><Mail className="size-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <small className="block text-sm leading-tight text-mute">E-Mail</small>
            <strong className="mt-0.5 block text-[0.95rem] font-bold leading-snug text-ink [overflow-wrap:anywhere] xl:text-base">{anfrageKontakt.email}</strong>
          </span>
        </a>

        <a
          href={`?pfad=${stoerfall.id}#kontakt`}
          aria-current={stoerfallAktiv || undefined}
          onClick={(event) => { event.preventDefault(); onStoerfall(); }}
          className="flex items-center gap-3 rounded-xl border border-signal/35 bg-signal/[0.05] px-4 py-3.5 transition-colors hover:border-signal/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal aria-[current]:border-signal/60"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal" aria-hidden="true">
            <TriangleAlert className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <small className="block text-sm leading-tight text-mute">Störfall oder Anlagenstillstand</small>
            <strong className="mt-0.5 block text-[0.95rem] font-bold leading-snug text-ink xl:text-base">Kurzformular öffnen</strong>
          </span>
          <ArrowRight className="size-5 shrink-0 text-signal" aria-hidden="true" />
        </a>
      </div>

      {/* Im pult-Modus ausgeblendet: die Karte soll ihre Blöcke luftig über die
          Rasterhöhe verteilen, und das Einsatzgebiet steht bereits im Hero-Text. */}
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
