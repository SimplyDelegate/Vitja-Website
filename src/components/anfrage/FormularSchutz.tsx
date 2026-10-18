"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Check, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Ref, useId, useImperativeHandle, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { siteConfig } from "@/lib/content";

const einwilligungsVersion = "2026-10-19";

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
  const hinweisId = useId();
  const captcha = useRef<HCaptcha>(null);
  const response = useRef("");
  const pruefungAngefordert = useRef(false);
  const [aktiviert, setAktiviert] = useState(false);
  const [status, setStatus] = useState<Pruefstatus>("bereit");
  const [versuch, setVersuch] = useState(0);
  const [einwilligungAm, setEinwilligungAm] = useState("");

  useImperativeHandle(ref, () => ({
    token: () => response.current,
    reset: () => { pruefungAngefordert.current = false; response.current = ""; captcha.current?.resetCaptcha(); setStatus("bereit"); }
  }), []);

  function pruefen() {
    if (response.current || status === "laedt" || status === "prueft") return;
    if (!einwilligungAm) setEinwilligungAm(new Date().toISOString());
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

  function widerrufen() {
    response.current = "";
    pruefungAngefordert.current = false;
    // Ein neuer Seitenkontext beendet auch das bereits geladene Drittskript.
    // Die Einwilligung wird nicht in Cookies oder Browser-Speichern gemerkt.
    window.location.reload();
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
      <p id={hinweisId} className="mb-3 text-xs leading-relaxed text-mute">
        Mit Klick auf „Ich bin ein Mensch“ willigen Sie in die hCaptcha-Prüfung (USA) mit Gerätezugriffen ein. Freiwillig und jederzeit widerrufbar. Alternativ: <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-2 hover:text-accent">E-Mail</a> oder <a href={`tel:${siteConfig.phoneHref}`} className="underline underline-offset-2 hover:text-accent">Telefon</a>. <Link href="/datenschutz/#spamschutz" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-accent">Details</Link>
      </p>
      <div className="captcha-control" data-verified={bestaetigt || undefined}>
        <button type="button" role="checkbox" aria-checked={bestaetigt} aria-busy={wartet} onClick={pruefen}
          disabled={wartet || bestaetigt} aria-describedby={hinweisId} className="captcha-trigger">
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
      {aktiviert && <>
        <input type="hidden" name="hcaptcha_einwilligung_version" value={einwilligungsVersion} />
        <input type="hidden" name="hcaptcha_einwilligung_am" value={einwilligungAm} />
        <button type="button" onClick={widerrufen} className="mt-2 text-left text-xs leading-relaxed text-mute underline underline-offset-2 hover:text-accent">Einwilligung widerrufen und Seite neu laden (Eingaben werden verworfen)</button>
      </>}
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
