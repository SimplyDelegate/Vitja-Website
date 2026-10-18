import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Datenschutz | Triumph Technical Services", "Informationen zu Hosting, Kontaktformularen, Spamschutz und Ihren Datenschutzrechten bei Triumph Technical Services.", "datenschutz/");

export default function DatenschutzPage() {
  return (
    <main className="legal-main">
      <header className="legal-hero"><div className="shell"><p className="eyebrow">Rechtliche Angaben</p><h1>Datenschutz</h1></div></header>
      <div className="shell legal-content">
        <p>Hier erfahren Sie, welche personenbezogenen Daten bei der Nutzung dieser Website verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte Sie haben.</p>

        <h2>1. Verantwortlicher</h2>
        <p><strong>{siteConfig.legalName}</strong><br />Website: {siteConfig.name}<br />{siteConfig.address}<br />Vertreten durch: {siteConfig.responsible}<br />E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><br />Telefon: <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phone}</a></p>

        <h2>2. Hosting und sichere Bereitstellung</h2>
        <p>Diese Website wird über Cloudflare Pages bereitgestellt. Anbieter ist Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA. Beim Abruf verarbeitet Cloudflare insbesondere Ihre IP-Adresse, Zeitpunkt und Ziel des Zugriffs, Browser- und Geräteinformationen sowie technische Sicherheitsdaten. Dies dient der Auslieferung der Website, der Fehlererkennung und dem Schutz vor Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der sichere und zuverlässige Betrieb der Website.</p>
        <p>Cloudflare kann Daten auch außerhalb der EU bzw. des EWR verarbeiten. Für entsprechende Übermittlungen sieht Cloudflare insbesondere die EU-Standardvertragsklauseln vor. Informationen zu Verarbeitung, Aufbewahrung und vertraglichen Schutzmaßnahmen finden Sie in der <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Cloudflare</a> und im <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noopener noreferrer">Auftragsverarbeitungsvertrag</a>. Wir betreiben keine eigene dauerhafte Speicherung von Website-Zugriffsprotokollen.</p>

        <h2>3. Kontakt per Formular, E-Mail oder Telefon</h2>
        <p>Wir verarbeiten Ihre Kontakt- und Unternehmensangaben sowie den Inhalt Ihrer Nachricht, um Ihr Anliegen zu bearbeiten, Rückfragen zu klären und gegebenenfalls ein Angebot vorzubereiten. Die Kurznachricht benötigt Unternehmen oder Ansprechperson, E-Mail-Adresse und Nachricht. Im ausführlichen Formular benötigen wir Unternehmen, Namen, eine gewählte Leistung und mindestens einen Kontaktweg. Bei einer Störfallmeldung kommen Schadensbeschreibung, Betriebszustand, Postleitzahl und Rückrufnummer hinzu. Weitere Projekt-, Orts- und Terminangaben sind freiwillig. Bitte übermitteln Sie keine besonders sensiblen Daten, die für die Anfrage nicht erforderlich sind.</p>
        <p>Bei Anfragen zur Anbahnung oder Durchführung eines Vertrags ist Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage. Bei sonstigen Nachrichten ist es Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist die sachgerechte Bearbeitung Ihrer Kontaktaufnahme. Ohne die erforderlichen Angaben können wir die Anfrage gegebenenfalls nicht beantworten. Eine zusätzliche Bestätigung dieser Datenschutzhinweise ist für die Kontaktaufnahme nicht erforderlich. Die Spamprüfung ist keine Einwilligung in Werbung.</p>

        <h2>4. Übermittlung durch Web3Forms</h2>
        <p>Für den Empfang und die Zustellung von Formularanfragen verwenden wir Web3Forms, betrieben von Web3Creative, Kerala, Indien. Der Dienst erhält die eingegebenen Formulardaten sowie technische Angaben wie IP-Adresse und Zeitpunkt und leitet die Anfrage an unser geschäftliches E-Mail-Postfach weiter. Web3Forms nutzt Infrastruktur unter anderem von Amazon Web Services, Cloudflare und Hetzner; für Spamprüfungen können IP- und E-Mail-Adresse an CleanTalk oder Akismet übermittelt werden.</p>
        <p>Eine Verarbeitung außerhalb der EU bzw. des EWR, insbesondere in Indien und den USA, ist möglich. Der Anbieter sieht hierfür EU-Standardvertragsklauseln vor. Für unser Formular ist eine automatische Löschung der beim Versanddienst gespeicherten Anfragen nach sieben Tagen eingestellt. Die Aufbewahrung der zugestellten Nachrichten in unserem E-Mail-Postfach richtet sich nach Ziffer 7. Einzelheiten und die vertraglichen Regelungen finden Sie in der <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Web3Forms</a> und im <a href="https://web3forms.com/dpa" target="_blank" rel="noopener noreferrer">Auftragsverarbeitungsvertrag von Web3Forms</a>. Rechtsgrundlage ist die unter Ziffer 3 beschriebene Bearbeitung Ihrer Anfrage.</p>

        <h2 id="spamschutz">5. Spamschutz mit hCaptcha</h2>
        <p>Für den Schutz der Formulare verwenden wir hCaptcha von Intuition Machines, Inc., 1065 SW 8th St #704, Miami, FL 33130, USA. Der Dienst wird geladen, sobald der zugehörige Formularbereich sichtbar wird. Sie starten die eigentliche Prüfung über „Ich bin ein Mensch“; bei Bedarf zeigt hCaptcha eine zusätzliche Aufgabe. Dabei können IP-Adresse, Browser- und Geräteinformationen, Zeitpunkt sowie Interaktionen mit der Prüfung verarbeitet und in die USA übermittelt werden. hCaptcha kann hierfür Informationen auf Ihrem Endgerät speichern oder auslesen.</p>
        <p>Der Dienst dient der Abwehr automatisierter Spam-Anfragen und dem Schutz unseres Anfragekanals. Rechtsgrundlage ist unser berechtigtes Interesse an diesem Schutz gemäß Art. 6 Abs. 1 lit. f DSGVO. Soweit Informationen auf dem Endgerät gespeichert oder ausgelesen werden, erfolgt dies für die technisch erforderliche Sicherheitsprüfung auf Grundlage von § 25 Abs. 2 Nr. 2 TDDDG. Alternativ zur Nutzung des Formulars können Sie uns per E-Mail oder Telefon kontaktieren. Der Anbieter beschreibt die Datenverarbeitung und die Übermittlungsgarantien, darunter Standardvertragsklauseln, in seiner <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</p>

        <h2>6. Cookies, Schriftarten und externe Inhalte</h2>
        <p>Wir setzen keine Werbe- oder Tracking-Cookies ein und betreiben keine externe Besucheranalyse. Bilder, Videos und Schriftarten werden von unserer Website ausgeliefert; hierfür wird keine direkte Verbindung zu Google Fonts, YouTube oder einer Bildplattform aufgebaut. Cloudflare kann bei erforderlichen Sicherheitsprüfungen technisch notwendige Cookies verwenden. Solche Schutzfunktionen dienen dem sicheren Abruf der Website (Art. 6 Abs. 1 lit. f DSGVO und, soweit anwendbar, § 25 Abs. 2 Nr. 2 TDDDG). Für den Spamschutz am Formular gilt Ziffer 5.</p>

        <h2>7. Speicherdauer und Empfänger</h2>
        <p>Innerhalb unseres Unternehmens erhalten nur die mit Ihrem Anliegen befassten Personen Zugriff. Wir speichern Anfragen, solange dies für die Bearbeitung und eine anschließende geschäftliche Abwicklung erforderlich ist. Anschließend löschen wir die Daten, sofern keine gesetzlichen Aufbewahrungspflichten oder berechtigten Gründe, etwa die Geltendmachung oder Abwehr von Ansprüchen, eine weitere Speicherung erfordern. Aufbewahrungspflichtige Unterlagen werden nach Ablauf der jeweiligen gesetzlichen Frist gelöscht. Für technische Daten und bei Dienstleistern gelten zusätzlich die oben beschriebenen Zwecke und Aufbewahrungskriterien. Eine Weitergabe zu Werbezwecken findet nicht statt.</p>

        <h2>8. Ihre Rechte</h2>
        <p>Nach Maßgabe der DSGVO haben Sie das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Nutzen Sie hierfür die oben genannten Kontaktdaten.</p>
        <p><strong>Widerspruchsrecht:</strong> Beruht eine Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gemäß Art. 21 DSGVO widersprechen.</p>
        <p>Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere an Ihrem Aufenthaltsort, Arbeitsplatz oder am Ort eines vermuteten Verstoßes. Für unseren Sitz ist der <a href="https://www.lfd.niedersachsen.de/startseite/wir_uber_uns/kontakt_und_anfahrt/kontakt-und-anreise-56182.html" target="_blank" rel="noopener noreferrer">Landesbeauftragte für den Datenschutz Niedersachsen</a>, Postfach 221, 30002 Hannover, zuständig.</p>
        <p>Es findet keine ausschließlich automatisierte Entscheidungsfindung mit rechtlicher oder vergleichbar erheblicher Wirkung und kein Profiling durch uns statt.</p>

        <h2>9. Stand</h2>
        <p>Stand: Oktober 2026. Bei Änderungen der Website oder ihrer Dienste passen wir diese Hinweise entsprechend an.</p>
      </div>
    </main>
  );
}
