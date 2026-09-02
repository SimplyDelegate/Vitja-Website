import { ArrowRight, PhoneCall, TriangleAlert } from "lucide-react";
import { anfrageKontakt, stoerfall } from "@/lib/anfrage";
import { Kurznachricht } from "./Kurznachricht";
import * as ui from "./anfrage-ui";

/**
 * Seitenspalte des Anfrageformulars: Ansprechpartner, Kurznachricht, der
 * direkte Anruf und darunter der Störfall-Shortcut. Der kurze Weg für alle,
 * denen das dreistufige Formular daneben zu viel ist.
 *
 * Im pult-Modus füllt die Karte die feste Rasterhöhe der Spalte; die Felder
 * behalten ihre Höhe, der Kontaktblock sitzt am Kartenboden und die Restfläche
 * wird zur Luft dazwischen.
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

      {/* Beide Kontaktwege als ein Block, vom Formular durch die Linie
          abgesetzt. Im pult-Modus schiebt mt-auto ihn an den Kartenboden. */}
      <div className="flex shrink-0 flex-col gap-2.5 border-t border-line pt-2.5 pult:mt-auto">
        {/* Der direkte Weg – bewusst dunkel statt signalfarben, damit er sich
            weder mit dem Störfall darunter noch mit dem Senden-Button beißt. */}
        <a href={anfrageKontakt.telefonLink} className={ui.callButton}>
          <PhoneCall className="size-[1.15rem] shrink-0" aria-hidden="true" />
          {/* Die Aufforderung steht nur für Screenreader – sichtbar trägt der
              Button die Nummer, das Icon sagt den Rest. */}
          <span className="sr-only">Direkt anrufen: </span>
          {anfrageKontakt.telefonAnzeige}
        </a>

        <a
          href={`?pfad=${stoerfall.id}#kontakt`}
          aria-current={stoerfallAktiv || undefined}
          onClick={(event) => { event.preventDefault(); onStoerfall(); }}
          className={ui.btnSignalLeise}
        >
          <TriangleAlert className="size-[1.15rem] shrink-0 text-signal" aria-hidden="true" />
          Störfall melden
          <ArrowRight className="size-4 shrink-0 text-signal" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
