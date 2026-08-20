"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { asset } from "@/lib/assets";
import { navItems, siteConfig } from "@/lib/content";
import { aktiveSektion, ankerId } from "@/lib/navigation";

/**
 * Der Abschnitt, in dem der Besucher gerade liest — für die Hervorhebung im
 * Header. Startwert null: im Hero (der hat keine id) und beim Serverrendern
 * ist kein Punkt aktiv, dadurch stimmen erster Server- und Client-Render überein.
 *
 * Der IntersectionObserver dient nur als Auslöser; die Auswahl trifft
 * aktiveSektion() aus lib/navigation.ts. Das bleibt auch am Seitenende
 * richtig, wo ein fein austarierter rootMargin danebenläge.
 */
function useAktiveSektion(ids: string[]): string | null {
  const [aktiv, setAktiv] = useState<string | null>(null);
  const schluessel = ids.join(",");

  useEffect(() => {
    const kennungen = schluessel.split(",");
    const abschnitte = kennungen
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!abschnitte.length) return;

    // Maß ist die Scroll-Polsterung von <html> (102/90/76px je Breakpoint):
    // genau dort landet ein Abschnitt nach einem Ankersprung, und genau dort
    // endet der fixierte Header. Die Headerhöhe allein wäre ein paar Pixel zu
    // knapp, ein direkt aufgerufenes /#galerie zählte dann als "noch nicht da".
    const grenze = () => {
      const polster = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      if (Number.isFinite(polster)) return polster + 4;
      return (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 92) + 14;
    };

    const bestimmen = () => setAktiv(aktiveSektion(
      abschnitte.map((abschnitt) => ({ id: abschnitt.id, top: abschnitt.getBoundingClientRect().top })),
      grenze()
    ));

    const observer = new IntersectionObserver(bestimmen, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    abschnitte.forEach((abschnitt) => observer.observe(abschnitt));

    let timer = 0;
    const beiResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(bestimmen, 150);
    };
    window.addEventListener("resize", beiResize);

    bestimmen();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", beiResize);
    };
  }, [schluessel]);

  return aktiv;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const ankerIds = useMemo(() => navItems.map((item) => ankerId(item.href)), []);
  const aktiv = useAktiveSektion(ankerIds);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link" aria-label="Triumph Technical Services – Startseite">
          <Image className="brand-desktop" src={asset("/brand/logo.svg")} alt="Triumph Technical Services" width={252} height={144} loading="eager" />
          <Image className="brand-mobile" src={asset("/brand/mark.svg")} alt="" width={42} height={42} loading="eager" />
          <span className="brand-mobile-name" aria-hidden="true">
            <span>Triumph</span>
            <span>Technical</span>
            <span>Services</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={ankerId(item.href) === aktiv ? "location" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="button button-small header-call" href={`tel:${siteConfig.phoneHref}`} aria-label={`Triumph Technical Services anrufen: ${siteConfig.phone}`}>
            <PhoneCall aria-hidden="true" /><span>Anrufen</span>
          </a>
          <Link className="button button-small header-primary" href="/#kontakt">Leistung besprechen</Link>
        </div>

        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Menü schließen" : "Menü öffnen"} onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile Navigation">
        <div className="shell mobile-nav-inner">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ankerId(item.href) === aktiv ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button" href="/#kontakt" onClick={() => setOpen(false)}>Leistung besprechen</Link>
        </div>
      </nav>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
