import Link from "next/link";
import { Check } from "lucide-react";
import { Anfrageformular } from "@/components/anfrage/Anfrageformular";
import { HeroSlider } from "@/components/HeroSlider";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { VideoHighlight } from "@/components/VideoHighlight";
import { asset } from "@/lib/assets";
import { siteConfig } from "@/lib/content";

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.domain,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: ["Norddeutschland", "Deutschland"],
    description: siteConfig.description,
    logo: `${siteConfig.domain}${asset("/brand/logo.svg")}`
  };

  return (
    <main>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <HeroSlider />

      <section className="section highlight-section">
        <div className="shell highlight-grid reveal">
          <div className="highlight-media"><VideoHighlight /><span>GFK · Rohr- & Systembau</span></div>
          <div className="highlight-copy">
            <p className="eyebrow">Werkstoffkompetenz GFK</p>
            <h2>Passgenau gefertigt. Sauber verbunden.</h2>
            <p>GFK-Systeme stellen besondere Anforderungen an Vorbereitung, Verbindung und Reparatur. Wir fertigen Rohrbaugruppen, integrieren sie in bestehende Systeme und setzen beschädigte Komponenten projektbezogen instand.</p>
            <ul>
              <li><Check aria-hidden="true" /> GFK-Rohr- und Formteile</li>
              <li><Check aria-hidden="true" /> Reparatur und Instandsetzung</li>
              <li><Check aria-hidden="true" /> Einbau und Systemintegration</li>
            </ul>
            <Link className="button button-dark" href="#kontakt">Leistung besprechen</Link>
          </div>
        </div>
      </section>

      <section className="section services-section" id="leistungen">
        <div className="services-intro-card reveal">
          <div className="shell section-heading section-heading-light services-intro-content">
            <div><p className="eyebrow eyebrow-light">Leistungsspektrum</p><h2>Technische Leistungen.<br />{" "}Ein Ansprechpartner.</h2></div>
            <p>Wenn Termine eng, Einbauräume anspruchsvoll und Schnittstellen zahlreich sind, zählt ein kontrollierter Projektablauf. Triumph Technical Services bündelt neun Leistungsfelder für Reparatur, projektbezogene Fertigung, Montage und Integration – mit einem festen Ansprechpartner von der Auftragsklärung bis zur dokumentierten Übergabe.</p>
          </div>
        </div>
        <div className="shell"><ServicesGrid /></div>
      </section>

      <section className="section project-section" id="projekte">
        <div className="shell">
          <div className="gallery-heading gallery-heading-standalone reveal"><h3>Echte Einblicke aus Fertigung, Reparatur und Montage.</h3></div>
          <ProjectGallery />
        </div>
      </section>

      <section className="section contact-section" id="kontakt" aria-labelledby="anfrage-titel"><div className="shell reveal"><Anfrageformular /></div></section>
    </main>
  );
}
