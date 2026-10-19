# Prüfung von Formular und Drittdiensten

Stand: 19.10.2026. Gegenstand ist die konkrete statische Website von Triumph Technical Services UG (haftungsbeschränkt), einschließlich Web3Forms und des über dessen öffentlichen Sitekey eingebundenen hCaptcha. Dies ist eine dokumentierte Prüfung anhand zugänglicher Quellen und der Implementierung, keine verbindliche Rechtsbescheinigung. Nicht zugängliche Anbieterprozesse und Vertragsannahmen werden nicht als geprüft ausgegeben.

## Ergebnis und Änderungen

Die pauschale bisherige Aussage, sämtliche hCaptcha-Endgerätezugriffe seien unbedingt erforderlich, ist anhand der verfügbaren Informationen nicht ausreichend belegt. Daher gilt nun ein vorab erklärter Einwilligungsschritt mit demselben Klick auf „Ich bin ein Mensch“. Es gibt kein zusätzliches Pflichtkästchen. Vor diesem Klick werden weder SDK noch hCaptcha-Iframes geladen; die optionale SDK-Fehlertelemetrie ist abgeschaltet.

Die Einwilligung benennt Zweck, Anbieterland und Gerätezugriffe, verlinkt weitere Angaben sowie direkte E-Mail- und Telefonalternativen. Nach Aktivierung steht ein Widerrufsbutton bereit. Dieser beendet durch Neuladen auch den bisherigen JavaScript-Kontext; der mögliche Verlust unversendeter Eingaben wird vorher am Button genannt. Einwilligungen werden nicht über Seitenaufrufe hinweg gespeichert. Bei einer abgesendeten Anfrage werden Zeitpunkt und Hinweisversion mitübermittelt. Diese Client-Angaben dokumentieren den Ablauf, sind kein manipulationssicheres unabhängiges Protokoll. Ein Token und die Angaben sind vor dem Versand erforderlich; der externe Dienst muss das Token zusätzlich serverseitig prüfen.

Die Verarbeitung einer eigentlichen geschäftlichen Anfrage bleibt davon getrennt: Vertragsanbahnung mit der betroffenen Person unter Art. 6 Abs. 1 lit. b DSGVO, sonstige Kontaktbearbeitung unter Art. 6 Abs. 1 lit. f. Keine Werbeeinwilligung, keine allgemeine Zustimmung zur Datenschutzerklärung. Der Websitebesuch selbst benötigt keine hCaptcha-Einwilligung.

## Aufbewahrung bei Web3Forms

Abschnitt 8 des [Web3Forms-DPA](https://web3forms.com/dpa) nennt drei Jahre physische Speicherzeit. Die [Anbieter-Datenschutzhinweise](https://web3forms.com/privacy) nennen maximal drei Jahre und mögliche kürzere Fristen. Das Dashboard steht auf sieben Tagen. Die Website nennt auf ausdrücklichen Nutzerwunsch die mögliche technische Speicherung von bis zu drei Jahren; eine sichere frühere Löschung wird nicht behauptet. Die kurze Dashboard-Einstellung bleibt bestehen. Es wird keine tatsächliche längere Speicherung konfiguriert.

Damit ist die Textkorrektur erledigt. Eine längere Angabe beweist weder die Erforderlichkeit dieser Speicherdauer noch die tatsächliche Löschung. Anfragen im Empfängerpostfach werden getrennt nach Bearbeitungszweck und gesetzlichen Pflichten aufbewahrt. Lösch- und Auskunftsanfragen müssen bei Bedarf auch an den Versanddienst weitergegeben werden.

## Übermittlungen und Vertragslage

| Dienst | Nachvollziehbare Grundlage und Schutzmaßnahmen | Grenzen der Prüfung |
| --- | --- | --- |
| Cloudflare Pages | Der [Cloudflare-DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) regelt Auftragsverarbeitung und Übermittlungen, einschließlich SCCs und DPF. Die Website verwendet HTTPS, lokale Schriften und lokale Medien; keine externe Besucheranalyse ist eingebaut. | Keine Behauptung einer ausschließlichen EU-Verarbeitung. Die tatsächliche Zuordnung des Kontos und Vertrags zum Kunden muss zutreffen. Eine DPF-Registerprüfung wird hier nicht als erfolgt ausgegeben. |
| Web3Forms / Web3Creative, Indien | Der DPA bezieht SCCs ein und beschreibt TLS, Speicherverschlüsselung, Zugriffsbeschränkung und Unterauftragsverarbeiter. Die Website nennt Indien/USA und die Empfänger von Spamprüfungen. Anhänge und optionale Weiterleitungen bleiben deaktiviert. Die [FAQ](https://docs.web3forms.com/getting-started/faq) nennt US-East als Serverregion. | Der DPA legt die AWS-Region nicht fest. Die FAQ behauptet zugleich keine Speicherung von Einsendungen und steht damit im Widerspruch zum neueren DPA; sie reicht als aktueller alleiniger Nachweis nicht aus. Hostingregion, Fernzugriffe aus Indien und Wirksamkeit der SCC-Garantien sind getrennt zu belegen. Keine pauschale Freigabe sämtlicher Auslandstransfers. |
| hCaptcha / Intuition Machines, USA | Die [hCaptcha-Bedingungen](https://www.hcaptcha.com/terms) verweisen auf den [DPA mit SCCs](https://newassets.hcaptcha.com/dpa/IMI_Data_Processing_Addendum_4.20.2023.pdf). Am 19.10.2026 wurde die aktive EU-US-DPF-Teilnahme für Non-HR-Daten im amtlichen Register einschließlich hCaptcha ausdrücklich bestätigt; Einzelheiten unten. Es werden durch unsere Komponente keine Kontaktformularinhalte an hCaptcha übergeben. | Die [Web3Forms-Anleitung](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha) verlangt im kostenlosen Tarif den gemeinsamen Sitekey. Ein eigener hCaptcha-Vertrag der UG ist damit nicht nachgewiesen; hCaptcha ist in der eingesehenen Web3Forms-Unterauftragsverarbeiterliste nicht ausdrücklich aufgeführt. Die konkrete Vertragskette ist ein offener Nachweispunkt. Eine DPF-Zertifizierung ersetzt keinen Vertrag nach Art. 28 DSGVO. |

Die hCaptcha-Einwilligung betrifft die Verarbeitung und Endgerätezugriffe. Sie wird nicht als Ausnahme für regelmäßige Drittlandtransfers nach Art. 49 DSGVO behandelt und heilt keine fehlende Auftragsverarbeitungsvereinbarung. Die öffentliche Erklärung nennt die SCCs als vom Anbieter vorgesehene Garantien; auf Anfrage muss der Verantwortliche die einschlägigen Unterlagen bereitstellen können.

## Ergänzende Anbieterrecherche am 19.10.2026

### Im amtlichen Register bestätigt

Die Suche nach `Intuition Machines` in der [offiziellen DPF-Liste](https://www.dataprivacyframework.gov/list) ergab genau einen Teilnehmer: `Intuition Machines Inc`, Miami, Florida. Das vollständige Profil nennt:

- EU-U.S. Data Privacy Framework: **Active**, `Non-HR Data`.
- Die Richtlinie `hCaptcha Privacy Policy DPF`, Beschreibung `Privacy policy for IMI's hCaptcha service`, verlinkt auf die hCaptcha-Datenschutzerklärung.
- Nächste Zertifizierungsfälligkeit in der Originaldarstellung: `08/12/2027`.
- Verifizierungsmethode: `Self-Assessment`; dies wird nicht als unabhängiges technisches Audit dargestellt.

Ein Screenshot des offiziellen Profils wurde als Prüfbeleg in den lokalen Aufgabenartefakten gesichert. Nach der [aktuellen Liste der EU-Kommission](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en) erfasst der US-Angemessenheitsbeschluss teilnehmende Organisationen. Damit ist für entsprechend erfasste direkte hCaptcha-USA-Übermittlungen der Transfermechanismus nach Art. 45 DSGVO nachvollziehbar. Dies ist eine Bewertung des geprüften Geltungsbereichs, keine Aussage über alle Weiterübermittlungen. Indien ist in der Kommissionsliste nicht als angemessen anerkannt.

### Konkret verbleibende Nachweise

Die [Web3Forms-Bedingungen](https://web3forms.com/terms), Abschnitt 1, beziehen den DPA automatisch ein, soweit der Dienst personenbezogene Daten im Kundenauftrag verarbeitet. Die Nutzung eines kostenlosen Tarifs verhindert damit nach den Anbieterbedingungen keine Auftragsverarbeitung. DPA und hCaptcha-Anleitung belegen aber nicht ausdrücklich, wie Intuition Machines bei Nutzung des gemeinsamen Schlüssels vertraglich für diese UG eingebunden ist. Das wird nicht als fehlender Vertrag bewiesen, sondern als noch fehlender Nachweis bewertet.

Der Web3Forms-DPA beschreibt allgemeine Schutzmaßnahmen, enthält jedoch keine konkreten Angaben über behördliche Zugriffsrechte in Indien, deren Auswirkungen auf diesen Dienst oder eine entsprechende Anbieterbewertung. Eine solche Bewertung lässt sich aus Verschlüsselung und dem bloßen SCC-Verweis nicht ableiten. Auch mögliche Administratorzugriffe sind aus der US-Hostingangabe nicht ausgeschlossen.

Die [vorbereitete Anbieteranfrage](anbieteranfrage-web3forms.txt) fragt die Vertragskette, die vollständige Anbieteridentität, die Verarbeitungs-/Zugriffsländer sowie SCC-Anhänge und Übermittlungsbewertung ab. Sie nennt nur öffentliche Unternehmens- und Kontaktdaten, enthält keine Zugangsschlüssel oder Kundeneinsendungen und beauftragt keine kostenpflichtige Leistung. Status: **Der Nutzer hat den Versand am 19.10.2026 ausdrücklich abgelehnt; keine Anbieteranfrage versendet und keine weitere Kontaktaufnahme beauftragt.** Der Entwurf bleibt ausschließlich als Dokumentation erhalten. Die genannten Nachweislücken sind damit weiterhin unbestätigt; die Entscheidung wird nicht als Anbieterbestätigung oder rechtliche Freigabe dargestellt.

## Maßstab und verbleibende Punkte

Die [DSK-Orientierungshilfe Digitale Dienste, November 2024](https://www.datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf), insbesondere Rn. 76–86, verlangt eine konkrete Betrachtung der gewünschten Funktion und der Endgerätezugriffe. Eine bloße Bezeichnung als Sicherheitsfunktion genügt nicht. Die Umsetzung vermeidet daher eine pauschale Berufung auf die Ausnahme des § 25 Abs. 2 Nr. 2 TDDDG. Maßgeblich sind außerdem [Art. 5–7, 13, 28 und 44–46 DSGVO](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679). Für SCC-Übermittlungen ist die Wirksamkeit der Garantien zu bewerten; siehe die [EDPB-Empfehlungen 01/2020, finale Fassung](https://www.edpb.europa.eu/documents/recommendation/recommendations-012020-on-measures-that-supplement-transfer-tools-to_en).

Die Umsetzung und die Textprüfung sind abgeschlossen. Für eine uneingeschränkte rechtliche Launchfreigabe fehlen weiterhin die oben genannten Vertrags- und Übermittlungsnachweise. Diese können nicht durch eine Codeänderung oder das Setzen einer Freigabevariable ersetzt werden. Unabhängig davon bleiben die Kammerangaben im Impressum und der reale Zustelltest offen. `LEGAL_REVIEW_CONFIRMED`, `FORM_DELIVERY_CONFIRMED` und die öffentliche Indexierung werden in dieser Prüfung nicht freigeschaltet.

## Überprüfung der Umsetzung

Bestanden: ESLint, statischer Next-Build einschließlich TypeScript sowie 71 Tests. Darunter: abgewiesener Versand ohne Einwilligungsangaben und Erhalt der Angaben im Versandobjekt. Im Browser sind vor Einwilligung kein hCaptcha-Skript und kein hCaptcha-Iframe vorhanden. Hinweis, Beschreibungszuordnung und direkte Kontaktalternativen sind vorhanden; bei 320 Pixeln Breite gibt es keinen Seitenüberlauf, und Logo/Text bleiben mittig sowie die beiden Anbieterlinks in einer Zeile. Der Widerruf beendet den Seitenkontext per normalem Neuladen und speichert keine fortdauernde Freigabe; der tatsächliche Ablauf nach einer positiven Anbieterprüfung ist noch nicht im Browser geprüft. Positive Captcha-Prüfung und reale Formularzustellung erfordern einen gesonderten Test; in dieser Bearbeitung werden keine Test-E-Mails versendet.
