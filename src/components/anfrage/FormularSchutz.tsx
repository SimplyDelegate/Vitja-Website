"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import { Ref, useImperativeHandle, useRef, useState } from "react";
import { anfrageKontakt } from "@/lib/anfrage";

export type FormularSchutzHandle = { token: () => string; reset: () => void };

/** Vor der Aktivierung wird keine Verbindung zu hCaptcha aufgebaut. */
export function FormularSchutz({ ref }: { ref: Ref<FormularSchutzHandle> }) {
  const captcha = useRef<HCaptcha>(null);
  const response = useRef("");
  const [aktiv, setAktiv] = useState(false);
  const [fehler, setFehler] = useState(false);

  useImperativeHandle(ref, () => ({
    token: () => response.current,
    reset: () => { response.current = ""; captcha.current?.resetCaptcha(); }
  }), []);

  return (
    <div className="min-w-0 shrink-0 rounded-xl border border-line bg-surface px-3.5 py-3 text-xs leading-relaxed text-mute">
      <p className="font-semibold text-ink-2">Spamschutz</p>
      {!aktiv ? <>
        <p className="mt-1">
          Mit „Spamschutz aktivieren“ willigen Sie ein, dass hCaptcha technische Daten zur Prüfung verarbeitet.
          Mehr dazu im <Link href="/datenschutz/#spamschutz" target="_blank" rel="noopener" className="font-semibold text-accent underline underline-offset-2">Datenschutz</Link>.
          Alternativ erreichen Sie uns per <a href={`mailto:${anfrageKontakt.email}`} className="font-semibold text-accent underline underline-offset-2">E-Mail</a> oder <a href={anfrageKontakt.telefonLink} className="font-semibold text-accent underline underline-offset-2">Telefon</a>.
        </p>
        <button type="button" onClick={() => setAktiv(true)} className="mt-2 min-h-11 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent">Spamschutz aktivieren</button>
      </> : <>
        <div className="mt-2">
          <HCaptcha ref={captcha} sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" reCaptchaCompat={false} languageOverride="de" size="compact"
            onVerify={(token) => { response.current = token; setFehler(false); }}
            onExpire={() => { response.current = ""; }} onChalExpired={() => { response.current = ""; }}
            onError={() => { response.current = ""; setFehler(true); }} />
        </div>
        {fehler && <p role="alert" className="mt-2 text-signal-dark">Der Spamschutz konnte nicht geladen werden. Bitte laden Sie die Seite erneut oder kontaktieren Sie uns per E-Mail oder Telefon.</p>}
        <button type="button" className="mt-2 min-h-11 font-semibold underline underline-offset-2" onClick={() => { response.current = ""; setAktiv(false); setFehler(false); }}>Spamschutz deaktivieren</button>
      </>}
    </div>
  );
}
