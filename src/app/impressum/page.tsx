import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Impressum | Triumph Technical Services", "Unternehmensangaben, Kontaktdaten und rechtliche Informationen zu Triumph Technical Services, einem Markenauftritt der Triumphbaugesellschaft UG in Geestland.", "impressum/");

export default function ImpressumPage() {
  return (
    <main className="legal-main">
      <header className="legal-hero"><div className="shell"><p className="eyebrow">Rechtliche Angaben</p><h1>Impressum</h1></div></header>
      <div className="shell legal-content">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p><strong>{siteConfig.legalName}</strong><br />Markenauftritt: {siteConfig.name}<br />{siteConfig.address}</p>
        <h2>Vertreten durch</h2><p>{siteConfig.responsible}</p>
        <h2>Kontakt</h2><p>Telefon: {siteConfig.phone}<br />E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
        <h2>Register- und Steuerangaben</h2><p>{siteConfig.register}<br />{siteConfig.taxId}<br />{siteConfig.taxOffice}</p>
        <h2>Bankverbindung</h2><p>{siteConfig.bankName}<br />IBAN: {siteConfig.iban}<br />BIC: {siteConfig.bic}</p>
        <h2>Verantwortlich für den Inhalt</h2><p>{siteConfig.responsible}<br />{siteConfig.address}</p>
        <h2>Haftungshinweise</h2><p>Die finalen Haftungs- und Streitbeilegungshinweise werden nach Vorliegen der vollständigen Unternehmensdaten rechtlich geprüft und vor Veröffentlichung ergänzt.</p>
        <h2 id="bildnachweis">Bildnachweis</h2>
        <p>Symbolbild zur Leistung „Blechvorrichtungen“: <a href="https://commons.wikimedia.org/wiki/File:Air_duct_pipes_at_Viborg_Katedralskole.jpg" target="_blank" rel="noopener noreferrer">„Air duct pipes at Viborg Katedralskole“</a> von <a href="https://commons.wikimedia.org/wiki/User:W.carter" target="_blank" rel="noopener noreferrer">W.carter / Wikimedia Commons</a>, vom Urheber weltweit als gemeinfrei freigegeben. Für die Webdarstellung verkleinert und in WebP umgewandelt.</p>
      </div>
    </main>
  );
}
