import { Mail, MapPin, PhoneCall } from "lucide-react";
import { anfrageKontakt } from "@/lib/anfrage";
import * as ui from "./anfrage-ui";

/**
 * Seitenspalte des Anfrageformulars: Ansprechpartner, Direktkontakt,
 * Einsatzgebiet. Inhalte kommen aus siteConfig über lib/anfrage.ts.
 */
export function AnfrageTrustKarte() {
  return (
    <aside
      className="flex flex-col gap-6 rounded-2xl border border-line bg-surface-2 p-6 lg:sticky lg:top-24 lg:self-start"
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
      </div>

      <section aria-labelledby="anfrage-einsatzgebiet" className="border-t border-line pt-5">
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
