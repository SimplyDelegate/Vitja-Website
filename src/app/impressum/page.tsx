import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = { title: "Impressum", description: "Impressum von Triumph Technical Services", alternates: { canonical: "/impressum" }, robots: siteConfig.isDraft ? { index: false, follow: false } : undefined };

export default function ImpressumPage() {
  return (
    <main className="legal-main">
      <header className="legal-hero"><div className="shell"><p className="eyebrow">Rechtliche Angaben</p><h1>Impressum</h1></div></header>
      <div className="shell legal-content">
        {siteConfig.isDraft && <div className="legal-notice"><strong>Hinweis zur Vorschau:</strong> Die Pflichtangaben sind noch nicht vollständig. Diese Seite darf erst nach Ergänzung und rechtlicher Prüfung veröffentlicht werden.</div>}
        <h2>Angaben gemäß § 5 DDG</h2>
        <p><strong>{siteConfig.legalName}</strong><br />Markenauftritt: {siteConfig.name}<br />{siteConfig.address}</p>
        <h2>Vertreten durch</h2><p>{siteConfig.responsible}</p>
        <h2>Kontakt</h2><p>Telefon: {siteConfig.phone}<br />E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
        <h2>Register- und Steuerangaben</h2><p>{siteConfig.register}<br />{siteConfig.taxId}</p>
        <h2>Verantwortlich für den Inhalt</h2><p>{siteConfig.responsible}<br />{siteConfig.address}</p>
        <h2>Haftungshinweise</h2><p>Die finalen Haftungs- und Streitbeilegungshinweise werden nach Vorliegen der vollständigen Unternehmensdaten rechtlich geprüft und vor Veröffentlichung ergänzt.</p>
      </div>
    </main>
  );
}
