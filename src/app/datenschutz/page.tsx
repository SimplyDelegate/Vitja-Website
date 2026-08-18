import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = { title: "Datenschutz", description: "Datenschutzhinweise von Triumph Technical Services", alternates: { canonical: "/datenschutz" }, robots: siteConfig.isDraft ? { index: false, follow: false } : undefined };

export default function DatenschutzPage() {
  return (
    <main className="legal-main">
      <header className="legal-hero"><div className="shell"><p className="eyebrow">Rechtliche Angaben</p><h1>Datenschutz</h1></div></header>
      <div className="shell legal-content">
        {siteConfig.isDraft && <div className="legal-notice"><strong>Hinweis zur Vorschau:</strong> Verantwortliche Stelle, Hosting- und Versandkonfiguration werden vor Veröffentlichung final ergänzt und rechtlich geprüft.</div>}
        <h2>1. Verantwortliche Stelle</h2><p><strong>{siteConfig.legalName}</strong><br />Markenauftritt: {siteConfig.name}<br />{siteConfig.address}<br />Vertreten durch: {siteConfig.responsible}<br />E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><br />Telefon: {siteConfig.phone}</p>
        <h2>2. Bereitstellung der Website</h2><p>Beim Aufruf der Website verarbeitet der Hostinganbieter technisch erforderliche Verbindungsdaten, insbesondere IP-Adresse, Zeitpunkt, aufgerufene Ressource, übertragene Datenmenge und Browserinformationen. Dies ist für eine sichere und stabile Bereitstellung erforderlich. Die konkrete Hostingkonfiguration und Speicherdauer werden vor Veröffentlichung ergänzt.</p>
        <h2>3. Kontaktformular</h2><p>Wenn Sie das Kontaktformular nutzen, verarbeiten wir Ihre Angaben zur Bearbeitung und Beantwortung der Anfrage. Pflichtfelder sind Unternehmen und Name, mindestens eine ausgewählte Leistung, die Projektbeschreibung, Postleitzahl und Ausführungsort, der Zeitrahmen, ein Kontaktweg und die Datenschutzbestätigung.</p><p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vorvertraglichen oder vertraglichen Anfragen; in sonstigen Fällen Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an einer sachgerechten Kommunikation.</p>
        <h2>4. E-Mail-Versand</h2><p>Für die sichere Zustellung von Formularanfragen ist der Versanddienst Resend vorgesehen. Eine Übermittlung erfolgt erst nach Einrichtung einer verifizierten Unternehmensdomain und Abschluss der erforderlichen datenschutzrechtlichen Vereinbarungen. In der lokalen Vorschau werden keine Formulardaten versendet.</p>
        <h2>5. Cookies und Analyse</h2><p>Diese Website setzt keine Marketing-Cookies, Trackingdienste oder externe Webanalyse ein. Ein Einwilligungsbanner ist daher für den vorgesehenen Funktionsumfang nicht erforderlich.</p>
        <h2>6. Speicherdauer</h2><p>Personenbezogene Daten werden nur so lange gespeichert, wie dies zur Bearbeitung der Anfrage und zur Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich ist.</p>
        <h2>7. Ihre Rechte</h2><p>Sie haben im Rahmen der gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem können Sie sich bei einer zuständigen Datenschutzaufsichtsbehörde beschweren.</p>
        <h2>8. Stand und Prüfung</h2><p>Diese Datenschutzhinweise sind für die technische Vorschau vorbereitet. Vor Veröffentlichung werden die tatsächlichen Anbieter-, Vertrags- und Kontaktdaten ergänzt und rechtlich geprüft.</p>
      </div>
    </main>
  );
}
