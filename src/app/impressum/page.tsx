import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Impressum | Triumph Technical Services", `Unternehmensangaben und Kontaktdaten zu Triumph Technical Services. Anbieter: ${siteConfig.legalName} in Geestland.`, "impressum/");

export default function ImpressumPage() {
  return (
    <main className="legal-main">
      <header className="legal-hero"><div className="shell"><p className="eyebrow">Rechtliche Angaben</p><h1>Impressum</h1></div></header>
      <div className="shell legal-content">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p><strong>{siteConfig.legalName}</strong><br />Markenauftritt: {siteConfig.name}<br />{siteConfig.address}</p>
        <h2>Vertreten durch</h2><p>{siteConfig.responsible}</p>
        <h2>Kontakt</h2><p>Telefon: {siteConfig.phone}<br />E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
        <h2>Handelsregister</h2><p>{siteConfig.registerCourt}<br />{siteConfig.register}</p>
        {siteConfig.vatId && <><h2>Umsatzsteuer-Identifikationsnummer</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {siteConfig.vatId}</p></>}
        {siteConfig.businessId && <><h2>Wirtschafts-Identifikationsnummer</h2><p>Wirtschafts-Identifikationsnummer gemäß § 139c Abgabenordnung: {siteConfig.businessId}</p></>}
        <h2>Verbraucherstreitbeilegung</h2><p>Wir sind nicht bereit, an freiwilligen Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        <h2>Urheberrecht und externe Links</h2><p>Texte, Gestaltung und Bilder dieser Website unterliegen den jeweils geltenden Schutzrechten. Eine Nutzung außerhalb gesetzlicher Erlaubnisse setzt die Zustimmung der jeweiligen Rechteinhaber voraus. Für Inhalte verlinkter externer Websites sind deren Betreiber verantwortlich. Wenn Sie einen rechtswidrigen Inhalt oder eine fehlerhafte Angabe entdecken, informieren Sie uns bitte über die oben genannten Kontaktdaten.</p>
        <h2 id="bildnachweis">Bildnachweis</h2>
        <p>Symbolbild zur Leistung „Blechvorrichtungen“: <a href="https://commons.wikimedia.org/wiki/File:Air_duct_pipes_at_Viborg_Katedralskole.jpg" target="_blank" rel="noopener noreferrer">„Air duct pipes at Viborg Katedralskole“</a> von <a href="https://commons.wikimedia.org/wiki/User:W.carter" target="_blank" rel="noopener noreferrer">W.carter / Wikimedia Commons</a>, vom Urheber weltweit als gemeinfrei freigegeben. Für die Webdarstellung verkleinert und in WebP umgewandelt.</p>
      </div>
    </main>
  );
}
