import Link from "next/link";
import { heroSlides } from "@/lib/content";
import { asset } from "@/lib/assets";

export function HeroSlider() {
  const heroSlide = heroSlides[0];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media" aria-live="off">
        {/* Art Direction: Mobil wird die Hochkantfassung desselben, dauerhaft
            sichtbaren Motivs geladen; Desktop erhält das Querformat. */}
        <picture>
          {heroSlide.srcMobile ? <source media="(max-width: 640px)" srcSet={asset(heroSlide.srcMobile)} /> : null}
          <img
            className="hero-image"
            src={asset(heroSlide.src)}
            alt={heroSlide.alt}
            style={{ objectPosition: heroSlide.focus }}
            fetchPriority="high"
          />
        </picture>
        <div className="hero-shade" />
      </div>

      <div className="shell hero-content">
        <p className="eyebrow eyebrow-light">Industrieisolierung · Rohrbau · Instandsetzung</p>
        <h1 id="hero-title">
          <span className="hero-title-line">Technische Lösungen,</span>
          <span className="hero-title-line">die im Betrieb bestehen.</span>
        </h1>
        <p className="hero-copy">Triumph Technical Services ist Ihr Partner für Industrieisolierung, Rohrbau, Instandsetzung und Schweißarbeiten – in Norddeutschland und bundesweit.</p>
        <div className="hero-actions">
          <Link className="button" href="#kontakt">Leistung besprechen</Link>
          <Link className="button button-ghost" href="#leistungen">Leistungen ansehen</Link>
        </div>
      </div>
    </section>
  );
}
