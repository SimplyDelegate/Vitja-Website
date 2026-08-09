import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Check, ClipboardCheck, FileSearch, ShieldCheck, UserRoundCheck } from "lucide-react";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactForm } from "@/components/ContactForm";
import { HeroSlider } from "@/components/HeroSlider";
import { ProjectGallery } from "@/components/ProjectGallery";
import { QualificationsSection } from "@/components/QualificationsSection";
import { RiskReduction } from "@/components/RiskReduction";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { VideoHighlight } from "@/components/VideoHighlight";
import { faqItems, processSteps, siteConfig } from "@/lib/content";
import { asset } from "@/lib/assets";

const trustItems = [
  { text: "Qualifikation passend zu Werkstoff, Verfahren und Einsatz", icon: ShieldCheck },
  { text: "Projektbezogene Nachweise mit klarem Geltungsbereich", icon: FileSearch },
  { text: "Klare Verantwortung von Abstimmung bis Übergabe", icon: UserRoundCheck },
  { text: "Integration in Betriebs- und Freigabeprozesse", icon: ClipboardCheck }
];

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
    logo: `${siteConfig.domain}/brand/logo.svg`
  };

  return (
    <main>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <HeroSlider />

      <section className="trust-strip" aria-label="Grundsätze der Zusammenarbeit">
        <div className="shell trust-grid reveal">
          {trustItems.map(({ text, icon: Icon }) => <div key={text}><Icon aria-hidden="true" /><span>{text}</span></div>)}
        </div>
      </section>

      <section className="section position-section">
        <div className="shell split-intro reveal">
          <div>
            <p className="eyebrow">Ein Projekt. Klare Verantwortung.</p>
            <h2>Technische Leistungen.<br />Ein Ansprechpartner.</h2>
          </div>
          <div className="intro-copy">
            <p>Wenn Termine eng, Einbauräume anspruchsvoll und Schnittstellen zahlreich sind, zählt ein kontrollierter Projektablauf. Triumph Technical Services koordiniert technische Gewerke mit klaren Freigaben und Zuständigkeiten.</p>
            <p>Sie erhalten einen festen Ansprechpartner – von der Auftragsklärung bis zur geordneten Dokumentationsübergabe.</p>
            <Link className="text-link" href="#vorgehen">So gehen wir vor <ArrowDownRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <RiskReduction />

      <section className="section services-section" id="leistungen">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">Leistungsspektrum</p><h2>Ausführung, die zusammenpasst.</h2></div>
            <p>Neun Leistungsfelder für Reparatur, projektbezogene Fertigung, Montage und Integration – mit Auftragsklärung, passenden Nachweisen und vereinbartem Übergabeumfang.</p>
          </div>
          <ServicesGrid />
        </div>
      </section>

      <QualificationsSection />

      <section className="section project-section" id="projekte">
        <div className="shell">
          <div className="section-heading section-heading-light reveal">
            <div><p className="eyebrow eyebrow-light">Einblicke in die Ausführung</p><h2>Aufgabe. Vorgehen. Ergebnis.</h2></div>
            <p>Anonymisierte Projekteinblicke zeigen nicht nur Bilder, sondern auch Randbedingungen, Ausführungslogik und Qualitätssicherung – ohne vertrauliche Kunden- oder Standortdaten.</p>
          </div>
          <CaseStudies />
          <div className="gallery-heading reveal"><p className="eyebrow eyebrow-light">Weitere Projektaufnahmen</p><h3>Echte Einblicke aus Fertigung, Reparatur und Montage.</h3></div>
          <ProjectGallery />
        </div>
      </section>

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
            <Link className="button button-dark" href="#kontakt">GFK-Projekt besprechen</Link>
          </div>
        </div>
      </section>

      <section className="section process-section" id="vorgehen">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">Unser Vorgehen</p><h2>Von der Aufgabe zur belastbaren Lösung.</h2></div>
            <p>Klare Schritte schaffen Transparenz, reduzieren Reibungsverluste und halten Entscheidungen nachvollziehbar.</p>
          </div>
          <ol className="process-grid reveal">
            {processSteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p><div className="process-proof"><strong>{step.checkpoint}</strong><small>{step.output}</small></div></li>)}
          </ol>
        </div>
      </section>

      <section className="section company-section" id="unternehmen">
        <div className="shell company-grid reveal">
          <div className="company-image">
            <Image src={asset("/media/projects/systemeinbau-armaturen.webp")} alt="Integriertes Rohrleitungssystem mit Armaturen" fill sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="company-mark"><Image src={asset("/brand/mark.svg")} alt="" width={70} height={70} /></div>
          </div>
          <div className="company-copy">
            <p className="eyebrow eyebrow-light">Triumph Technical Services</p>
            <h2>Pragmatisch in der Lösung. Verbindlich in der Ausführung.</h2>
            <p>Wir übernehmen technische Aufgaben als Werk- und Projektleistung mit klarer Ergebnisverantwortung. Qualifikationen, Ausführungspartner und Dokumentationsumfang werden passend zum Auftrag geprüft und abgestimmt.</p>
            <div className="company-points">
              <div><span>01</span><p><strong>Projektverantwortung</strong>Ein Ansprechpartner bündelt Abstimmungen, Termine und Schnittstellen.</p></div>
              <div><span>02</span><p><strong>Nachweisführung</strong>Qualifikationen und Dokumente werden auf den tatsächlichen Auftrag bezogen.</p></div>
              <div><span>03</span><p><strong>Arbeiten im Bestand</strong>Vorgehen und Schutzmaßnahmen werden auf Anlage, Zugang und Betrieb abgestimmt.</p></div>
            </div>
            {siteConfig.isDraft && <p className="company-draft-note">Der vollständige Rechtsträger und die verantwortlichen Personen werden vor Veröffentlichung mit den Nachweisen abgeglichen.</p>}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell faq-grid reveal">
          <div><p className="eyebrow">Häufige Fragen</p><h2>Was Auftraggeber vorab wissen möchten.</h2></div>
          <div className="faq-list">
            {faqItems.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="kontakt"><div className="shell reveal"><ContactForm /></div></section>
    </main>
  );
}
