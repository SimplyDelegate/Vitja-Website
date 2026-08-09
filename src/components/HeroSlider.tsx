"use client";

import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/content";
import { asset } from "@/lib/assets";

const HERO_SLIDE_DURATION = 6000;

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);
  const timerStartedAtRef = useRef<number | null>(null);
  const remainingTimeRef = useRef(HERO_SLIDE_DURATION);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || heroSlides.length < 2) return;

    const duration = remainingTimeRef.current;
    const startedAt = performance.now();
    timerStartedAtRef.current = startedAt;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      timerStartedAtRef.current = null;
      remainingTimeRef.current = HERO_SLIDE_DURATION;
      setActive((index) => (index + 1) % heroSlides.length);
    }, duration);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;

      if (timerStartedAtRef.current === startedAt) {
        remainingTimeRef.current = Math.max(0, duration - (performance.now() - startedAt));
        timerStartedAtRef.current = null;
      }
    };
  }, [active, paused, reducedMotion]);

  const selectSlide = (index: number) => {
    if (index === active) return;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    timerStartedAtRef.current = null;
    remainingTimeRef.current = HERO_SLIDE_DURATION;
    setActive(index);
  };

  return (
    <section
      className={`hero${paused ? " is-paused" : ""}`}
      style={{ "--hero-slide-duration": `${HERO_SLIDE_DURATION}ms` } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div className="hero-media" aria-live="off">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.src}
            className={`hero-image ${active === index ? "is-active" : ""}`}
            src={asset(slide.src)}
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
        <h1 id="hero-title">
          <span className="hero-title-line">Technische Lösungen,</span>
          <span className="hero-title-line">die im Betrieb bestehen.</span>
        </h1>
        <p className="hero-copy">Triumph Technical Services ist Ihr Partner für Schweißarbeiten, Industrieisolierung, Rohrbau und Schiffsausbau – in Norddeutschland und bundesweit.</p>
        <div className="hero-actions">
          <Link className="button" href="#kontakt">Leistung besprechen</Link>
          <Link className="button button-ghost" href="#leistungen">Leistungen ansehen</Link>
        </div>
      </div>

      <div className="shell hero-controls" aria-label="Hero-Bildsteuerung">
        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <button key={slide.src} className={active === index ? "is-active" : ""} onClick={() => selectSlide(index)} aria-label={`Bild ${index + 1} anzeigen`} aria-current={active === index ? "true" : undefined} />
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
