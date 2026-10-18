import Link from "next/link";
import { Check } from "lucide-react";
import { Anfrageformular } from "@/components/anfrage/Anfrageformular";
import { HeroSlider } from "@/components/HeroSlider";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { VideoHighlight } from "@/components/VideoHighlight";
import { absoluteAssetUrl } from "@/lib/assets";
import { services, siteConfig } from "@/lib/content";
import { homeTitle, siteUrl } from "@/lib/seo";

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl("#unternehmen"),
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteUrl(),
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: siteConfig.address,
        areaServed: ["Norddeutschland", "Deutschland"],
        description: siteConfig.description,
        logo: absoluteAssetUrl("/brand/logo.svg", siteConfig.domain),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Technische Leistungen",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.short,
              url: siteUrl("#leistungen"),
              provider: { "@id": siteUrl("#unternehmen") }
            }
          }))
        }
      },
      {
        "@type": "WebSite",
        "@id": siteUrl("#website"),
        url: siteUrl(),
        name: siteConfig.name,
        inLanguage: "de-DE",
        publisher: { "@id": siteUrl("#unternehmen") }
      },
      {
        "@type": "WebPage",
        "@id": siteUrl("#webseite"),
        url: siteUrl(),
        name: homeTitle,
        description: siteConfig.description,
        isPartOf: { "@id": siteUrl("#website") },
        about: { "@id": siteUrl("#unternehmen") },
        inLanguage: "de-DE"
      }
    ]
  };

  return (
    <main>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <HeroSlider />

      <FeaturedProjects />

      <section className="section services-section" id="leistungen">
        <div className="shell services-heading reveal">
          <p className="eyebrow">Leistungsspektrum</p>
          <h2>Technische Leistungen.<br />{" "}Ein Ansprechpartner.</h2>
        </div>
        <div className="shell"><ServicesGrid /></div>
      </section>

      <section className="section project-section" id="galerie">
        <div className="shell">
          <div className="gallery-heading gallery-heading-standalone reveal">
            <div>
              <p className="eyebrow eyebrow-light">Projektgalerie</p>
              <h2>Einblicke in Arbeiten, an denen wir beteiligt waren.</h2>
            </div>
          </div>
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
              <li><Check aria-hidden="true" /> Reparatur und Instandhaltung</li>
              <li><Check aria-hidden="true" /> Einbau und Systemintegration</li>
            </ul>
            <Link className="button button-dark" href="#kontakt">Leistungen besprechen</Link>
          </div>
        </div>
      </section>

      {/* --anfrage-kopf = Platzbedarf des fixierten Headers (92px) plus Luft,
          identisch zum scroll-padding-top; Basis der Höhenrechnung im pult-Modus. */}
      <section className="section contact-section" id="kontakt" aria-labelledby="anfrage-titel" style={{ "--anfrage-kopf": "102px" } as React.CSSProperties}>
        <div className="shell reveal">
          <noscript>
            <style>{".anfrage form { display: none !important; } .anfrage > .grid { display: block; height: auto; min-height: 0; max-height: none; }"}</style>
            <p className="mb-6 rounded-xl border border-line bg-surface p-5 text-ink-2">
              Für das Anfrageformular ist JavaScript erforderlich. Sie erreichen uns direkt unter <a href={`tel:${siteConfig.phoneHref}`} className="font-semibold underline">{siteConfig.phone}</a> oder per <a href={`mailto:${siteConfig.email}`} className="font-semibold underline">E-Mail an {siteConfig.email}</a>.
            </p>
          </noscript>
          <Anfrageformular />
        </div>
      </section>
    </main>
  );
}
