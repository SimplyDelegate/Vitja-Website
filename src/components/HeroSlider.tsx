"use client";

import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/content";

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = window.setInterval(() => setActive((index) => (index + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(interval);
  }, [paused, reducedMotion]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media" aria-live="off">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.src}
            className={`hero-image ${active === index ? "is-active" : ""}`}
            src={slide.src}
            alt={index === active ? slide.alt : ""}
            fill
            sizes="100vw"
            style={{ objectPosition: slide.focus }}
            preload={index === 0}
          />
        ))}
        <div className="hero-shade" />
      </div>

      <div className="shell hero-content">
        <p className="eyebrow eyebrow-light">Industrie · Schiffbau · Instandhaltung</p>
        <h1 id="hero-title">Technische Lösungen,<br />die im Betrieb bestehen.</h1>
        <p className="hero-copy">Triumph Technical Services koordiniert, repariert und integriert industrielle Systeme – mit klarer Projektverantwortung in Norddeutschland und bundesweit.</p>
        <div className="hero-actions">
          <Link className="button" href="#kontakt">Projekt besprechen</Link>
          <Link className="button button-ghost" href="#leistungen">Leistungen ansehen</Link>
        </div>
        <Link className="hero-proof-link" href="#qualifikationen">Qualifikationen und Nachweise ansehen <span aria-hidden="true">↘</span></Link>
      </div>

      <div className="shell hero-controls" aria-label="Hero-Bildsteuerung">
        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <button key={slide.src} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Bild ${index + 1} anzeigen`} aria-current={active === index ? "true" : undefined} />
          ))}
        </div>
        {!reducedMotion && (
          <button className="hero-pause" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Bildwechsel fortsetzen" : "Bildwechsel pausieren"}>
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
