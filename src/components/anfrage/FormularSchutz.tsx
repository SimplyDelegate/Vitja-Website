"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Check, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Ref, useImperativeHandle, useRef, useState } from "react";
import { asset } from "@/lib/assets";

export type FormularSchutzHandle = { token: () => string; reset: () => void };
type Pruefstatus = "laedt" | "bereit" | "prueft" | "bestaetigt" | "abgelaufen" | "fehler";

const beschriftung: Record<Pruefstatus, string> = {
  laedt: "Prüfung wird geladen …",
  bereit: "Ich bin ein Mensch",
  prueft: "Wird geprüft …",
  bestaetigt: "Prüfung bestätigt",
  abgelaufen: "Bitte erneut bestätigen",
  fehler: "Prüfung erneut laden"
};

/** Eigener Auslöser in Feldbreite, verbunden mit der offiziellen Invisible-API.
 * Ein Häkchen erscheint ausschließlich nach erfolgreicher hCaptcha-Prüfung. */
export function FormularSchutz({ ref }: { ref: Ref<FormularSchutzHandle> }) {
  const captcha = useRef<HCaptcha>(null);
  const response = useRef("");
  const pruefungAngefordert = useRef(false);
  const [aktiviert, setAktiviert] = useState(false);
  const [status, setStatus] = useState<Pruefstatus>("bereit");
  const [versuch, setVersuch] = useState(0);

  useImperativeHandle(ref, () => ({
    token: () => response.current,
    reset: () => { pruefungAngefordert.current = false; response.current = ""; captcha.current?.resetCaptcha(); setStatus("bereit"); }
  }), []);

  function pruefen() {
    if (response.current || status === "laedt" || status === "prueft") return;
    pruefungAngefordert.current = true;
    if (status === "fehler" || !captcha.current?.isReady()) {
      response.current = "";
      setStatus("laedt");
      setAktiviert(true);
      setVersuch((bisher) => bisher + 1);
      return;
    }
    startePruefung();
  }

  function startePruefung() {
    pruefungAngefordert.current = false;
    const instanz = captcha.current;
    if (!instanz?.isReady()) {
      setStatus("fehler");
      return;
    }
    setStatus("prueft");
    try {
      instanz.execute();
    } catch {
      response.current = "";
      setStatus("fehler");
    }
  }

  const bestaetigt = status === "bestaetigt";
  const wartet = status === "laedt" || status === "prueft";

  return (
    <div className="min-w-0 shrink-0" aria-label="Spamprüfung">
      <div className="captcha-control" data-verified={bestaetigt || undefined}>
        <button type="button" role="checkbox" aria-checked={bestaetigt} aria-busy={wartet} onClick={pruefen}
          disabled={wartet || bestaetigt} className="captcha-trigger">
          <span className="captcha-label">
            <span className="captcha-checkmark" aria-hidden="true">
              {bestaetigt ? <Check /> : wartet ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : null}
            </span>
            <span aria-live="polite">{beschriftung[status]}</span>
          </span>
        </button>
        <div className="captcha-provider">
          <a href="https://www.hcaptcha.com/" target="_blank" rel="noopener noreferrer" className="captcha-brand" aria-label="Geschützt durch hCaptcha">
            <Image src={asset("/brand/hcaptcha.svg")} width={24} height={24} alt="" />
            <span>hCaptcha</span>
          </a>
          <span>
            <a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer">Bedingungen</a>
            <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutz</a>
          </span>
        </div>
      </div>
      {status === "fehler" && <p role="alert" className="mt-2 text-xs leading-relaxed text-signal-dark">Die Prüfung konnte nicht geladen werden. Bitte versuchen Sie es erneut. Ihre Eingaben bleiben erhalten.</p>}
      {aktiviert && <HCaptcha key={versuch} ref={captcha} sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" reCaptchaCompat={false} sentry={false} languageOverride="de" size="invisible"
        onReady={() => { if (pruefungAngefordert.current) startePruefung(); else setStatus("bereit"); }}
        onVerify={(token) => { response.current = token; setStatus("bestaetigt"); }}
        onExpire={() => { response.current = ""; setStatus("abgelaufen"); }}
        onChalExpired={() => { response.current = ""; setStatus("abgelaufen"); }}
        onClose={() => { setStatus((bisher) => bisher === "prueft" ? "bereit" : bisher); }}
        onError={() => { response.current = ""; setStatus("fehler"); }} />}
    </div>
  );
}

export function FormularDatenschutz({ className = "" }: { className?: string }) {
  return <p className={`shrink-0 text-xs leading-relaxed text-mute ${className}`}>
    <Link href="/datenschutz/" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-accent">Datenschutzhinweise</Link>
  </p>;
}
