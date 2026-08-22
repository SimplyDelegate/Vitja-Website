import { ArrowRight, PhoneCall, TriangleAlert } from "lucide-react";
import { anfrageKontakt, stoerfall } from "@/lib/anfrage";
import { Kurznachricht } from "./Kurznachricht";
import * as ui from "./anfrage-ui";

/**
 * Seitenspalte des Anfrageformulars: Ansprechpartner, Kurznachricht, Störfall-
 * Shortcut und der direkte Anruf. Der kurze Weg für alle, denen das
 * dreistufige Formular daneben zu viel ist.
 *
 * Im pult-Modus füllt die Karte die feste Rasterhöhe der Spalte; das
 * Nachrichtenfeld nimmt dabei die Restfläche ein, alles andere bleibt stehen.
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
      className="flex min-w-0 shrink-0 flex-col gap-5 rounded-2xl border border-line bg-surface-2 p-6 sm:p-7 pult:min-h-full pult:gap-4 pult:p-6"
      aria-labelledby="anfrage-ansprechpartner"
    >
      <div className="shrink-0">
        <span className={ui.kicker}>Ihr Ansprechpartner</span>
        <h3 id="anfrage-ansprechpartner" className="mt-1.5 font-display text-2xl font-bold leading-none tracking-normal text-ink">
          {anfrageKontakt.ansprechpartner}
        </h3>
        <p className="mt-1 text-[0.9rem] font-bold text-accent">{anfrageKontakt.rolle}</p>
      </div>

      <Kurznachricht />

      <div className="flex shrink-0 flex-col gap-2.5">
        <a
          href={`?pfad=${stoerfall.id}#kontakt`}
          aria-current={stoerfallAktiv || undefined}
          onClick={(event) => { event.preventDefault(); onStoerfall(); }}
          className="flex items-center gap-3 rounded-xl border border-signal/35 bg-signal/[0.05] px-4 py-3 transition-colors hover:border-signal/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal aria-[current]:border-signal/60"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal" aria-hidden="true">
            <TriangleAlert className="size-[1.15rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <small className="block text-xs leading-tight text-mute">Störfall oder Anlagenstillstand</small>
            <strong className="mt-0.5 block text-[0.9rem] font-bold leading-snug text-ink">Kurzformular öffnen</strong>
          </span>
          <ArrowRight className="size-4 shrink-0 text-signal" aria-hidden="true" />
        </a>

        {/* Der direkte Weg – bewusst dunkel statt signalfarben, damit er sich
            weder mit dem Störfall darüber noch mit dem Senden-Button beißt. */}
        <div className="border-t border-line pt-2.5">
          <a href={anfrageKontakt.telefonLink} className={ui.callButton}>
            <PhoneCall className="size-[1.15rem] shrink-0" aria-hidden="true" />
            <span className="min-w-0 text-left">
              <strong className="block whitespace-nowrap text-[0.95rem] font-bold leading-tight">{anfrageKontakt.telefonAnzeige}</strong>
              <small className="mt-0.5 block text-xs font-semibold leading-tight text-white/70">Direkt anrufen</small>
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}
