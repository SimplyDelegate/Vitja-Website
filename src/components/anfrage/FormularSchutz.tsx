"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { anfrageKontakt } from "@/lib/anfrage";

export type FormularSchutzHandle = { token: () => string; reset: () => void };

/** Direkt sichtbar am Formular; außerhalb des sichtbaren Bereichs wird hCaptcha noch nicht geladen. */
export function FormularSchutz({ ref }: { ref: Ref<FormularSchutzHandle> }) {
  const container = useRef<HTMLDivElement>(null);
  const captcha = useRef<HCaptcha>(null);
  const response = useRef("");
  const sizeRef = useRef<"normal" | "compact">("compact");
  const [size, setSize] = useState<"normal" | "compact">("compact");
  const [sichtbar, setSichtbar] = useState(false);
  const [geladen, setGeladen] = useState(false);
  const [fehler, setFehler] = useState(false);
  const [abgelaufen, setAbgelaufen] = useState(false);
  const [versuch, setVersuch] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setSichtbar(true);
        observer.disconnect();
      }
    });
    observer.observe(element);
    const resize = new ResizeObserver(([entry]) => {
      const nextSize = entry.contentRect.width >= 304 ? "normal" : "compact";
      if (sizeRef.current === nextSize) return;
      sizeRef.current = nextSize;
      response.current = "";
      setGeladen(false);
      setAbgelaufen(false);
      setSize(nextSize);
    });
    resize.observe(element);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, []);

  useImperativeHandle(ref, () => ({
    token: () => response.current,
    reset: () => { response.current = ""; setAbgelaufen(false); captcha.current?.resetCaptcha(); }
  }), []);

  return (
    <div ref={container} className="min-w-0 shrink-0 rounded-xl border border-line bg-surface px-3.5 py-3 text-xs leading-relaxed text-mute" aria-label="Spamprüfung">
      <p className="font-semibold text-ink-2">Spamschutz</p>
      <div className={`relative mt-2 ${size === "normal" ? "min-h-20" : "min-h-36"}`}>
        {!geladen && !fehler && <p role="status" className="absolute inset-x-0 top-0">Spamprüfung wird geladen …</p>}
        {sichtbar && <HCaptcha key={`${size}-${versuch}`} ref={captcha} sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" reCaptchaCompat={false} languageOverride="de" size={size}
          onReady={() => { setGeladen(true); setFehler(false); }}
          onVerify={(token) => { response.current = token; setFehler(false); setAbgelaufen(false); }}
          onExpire={() => { response.current = ""; setAbgelaufen(true); }} onChalExpired={() => { response.current = ""; setAbgelaufen(true); }}
          onError={() => { response.current = ""; setFehler(true); }} />}
      </div>
      {abgelaufen && <p role="status" className="mt-2">Die Prüfung ist abgelaufen. Bitte bestätigen Sie erneut „Ich bin ein Mensch“.</p>}
      {fehler && <>
        <p role="alert" className="mt-2 text-signal-dark">Die Spamprüfung konnte nicht geladen werden. Ihre Eingaben bleiben erhalten.</p>
        <button type="button" className="action-button mt-2 min-h-11 rounded-lg border border-line px-3 py-2 font-semibold text-ink transition-colors hover:border-accent" onClick={() => { response.current = ""; setGeladen(false); setFehler(false); setAbgelaufen(false); setVersuch((bisher) => bisher + 1); }}>Spamprüfung erneut laden</button>
      </>}
      <p className="mt-2">
        hCaptcha schützt vor automatisierten Anfragen. <Link href="/datenschutz/#spamschutz" target="_blank" rel="noopener" className="font-semibold text-accent underline underline-offset-2">Datenschutzhinweise</Link>.
        Alternativ: <a href={`mailto:${anfrageKontakt.email}`} className="font-semibold text-accent underline underline-offset-2">E-Mail</a> oder <a href={anfrageKontakt.telefonLink} className="font-semibold text-accent underline underline-offset-2">Telefon</a>.
      </p>
    </div>
  );
}
