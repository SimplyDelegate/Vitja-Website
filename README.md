# Triumph Technical Services

Statische Next.js-Website für Cloudflare Pages. Node.js 24 verwenden.

## Entwicklung und Prüfung

```sh
npm ci
npm run dev
npm run check
```

Alternativ: `pnpm install --frozen-lockfile`, danach `pnpm dev` bzw. `pnpm check`.
Der Build schreibt die Website nach `out/`. Es gibt keinen Next.js-Server im produktiven Betrieb.

## Cloudflare Pages

Projekt: `vitja-website`, Repository `SimplyDelegate/Vitja-Website`, Branch `main`.
Build: `npm run build`, Ausgabeverzeichnis: `out`, Root-Verzeichnis leer lassen.
Variablen siehe `.env.example`; sie werden beim Build eingebettet. Nach Änderungen neu deployen.
Die Pages-Vorschau verwendet `SITE_ENV=preview` und `NEXT_PUBLIC_SITE_INDEXING=false`.
Für Cloudflare bleibt `NEXT_PUBLIC_BASE_PATH` leer.

## Formularversand freischalten

1. Ein kostenloses Web3Forms-Konto mit einer erreichbaren geschäftlichen Empfängeradresse anlegen und diese bestätigen. Die Betreiberin bzw. der Betreiber bestätigt selbst die Vertragsbedingungen einschließlich Auftragsverarbeitung.
2. Ein Formular für diese Website erstellen. hCaptcha im Web3Forms-Dashboard für dieses Formular **verpflichtend** aktivieren; eine reine Prüfung im Browser genügt nicht.
3. Eine möglichst kurze geeignete Aufbewahrung beibehalten. Die Oberfläche bezeichnet sieben Tage als endgültige Löschfrist, während der DPA in Abschnitt 8 eine physische Speicherdauer von drei Jahren beschreibt. Auf Wunsch des Betreibers nennen die Datenschutzhinweise deshalb die mögliche technische Speicherung von bis zu drei Jahren. Die Sieben-Tage-Einstellung wird dafür nicht verlängert und eine kürzere tatsächliche Löschung nicht versprochen. Keine zusätzlichen Analyse-, Werbe- oder Drittanbieter-Integrationen aktivieren.
4. Den öffentlichen Access-Key in Cloudflare als `NEXT_PUBLIC_CONTACT_ACCESS_KEY` hinterlegen. Der Key ist für das Client-Bundle vorgesehen; keine privaten API- oder hCaptcha-Secrets eintragen. `NEXT_PUBLIC_CONTACT_ENDPOINT=https://api.web3forms.com/submit` verwenden.
5. Neu deployen. Kurzformular, ausführliche Anfrage und Störfallpfad prüfen. E-Mail und reinen Telefonkontakt berücksichtigen. Eine echte Anfrage absenden und ihren Eingang im Empfängerpostfach einschließlich Spamordner prüfen. Bei vorhandener Absender-E-Mail muss eine Antwort an diese Adresse möglich sein.
6. Mit fehlendem, ungültigem und bereits verwendetem Captcha-Token prüfen, dass der Dienst die Übermittlung ablehnt. Nach jeder Übermittlung bzw. Ablauf muss die Prüfung erneuert werden.

Ohne Access-Key wird kein Versand behauptet oder ausgelöst; die Website zeigt direkte Kontaktwege. Eine einzige Prüfzeile in Feldbreite startet hCaptcha über dessen offizielle Invisible-API. Das Häkchen wird ausschließlich nach erfolgreicher Prüfung gesetzt; eine zusätzliche Bilderaufgabe kann weiterhin erforderlich sein. Ein separater Datenschutz-Haken wird nicht verlangt; ein kurzer Link steht am Senden-Button. Vor der Prüfzeile erklärt ein Hinweis den Klick als freiwillige Einwilligung in die Prüfung einschließlich USA-Verarbeitung und Gerätezugriffen; E-Mail und Telefon sind direkt verlinkte Alternativen. Der Dienst wird erst mit dem Klick auf „Ich bin ein Mensch“ geladen und startet die Prüfung danach automatisch. Zeitpunkt und Hinweisversion werden mit einer abgesendeten Anfrage dokumentiert; ohne diese Angaben oder ohne Token wird kein Versand ausgelöst. Die Einwilligung wird nicht dauerhaft im Browser gespeichert. Ein Widerrufsbutton lädt die Seite neu und beendet damit auch das geladene Drittskript; der Button warnt vor dem Verlust nicht abgesendeter Eingaben. Die optionale Sentry-Fehlertelemetrie des SDK ist deaktiviert. Die Prüfung bleibt vor jedem Versand verpflichtend. Eingaben bleiben bei Versandfehlern erhalten, und hängende Requests werden nach 20 Sekunden abgebrochen.
Dateianhänge bleiben deaktiviert. Sie benötigen einen passenden Tarif und einen gesonderten Funktionstest; Nachreichen per E-Mail ist möglich.

Das lokale hCaptcha-Logo (`public/brand/hcaptcha.svg`) stammt unverändert aus dem offiziellen Badge-Beispiel unter https://docs.hcaptcha.com/invisible/. Logo und Prüftext stehen gemeinsam vertikal in der Mitte der Kachel; Bedingungen und Datenschutz stehen unabhängig davon nebeneinander am unteren Rand. Alle Elemente bleiben auch bei schmalen Formularen innerhalb der Prüfzeile.

## Hauptdomain veröffentlichen

Die bestätigte Hauptdomain ist `https://triumphtechnicalservices.de`.
Vor der Veröffentlichung müssen Formularzustellung und verpflichtender Spamschutz tatsächlich geprüft sowie Unternehmensdaten und Datenschutzhinweise vom Betreiber geprüft sein.
Erst danach die entsprechenden Freigaben aus `.env.example` setzen, `SITE_ENV=production` und `NEXT_PUBLIC_SITE_INDEXING=true` verwenden und neu deployen.
Öffentliche Qualifikationsnachweise werden nur geprüft, wenn tatsächlich welche eingetragen sind. Es werden keine Nachweise erfunden oder pauschal verlangt.
Custom Domain in Cloudflare Pages verbinden, `www` auf die Hauptadresse umleiten und HTTPS, Canonicals, robots.txt sowie die vollständige sitemap.xml auf der echten Domain prüfen. Anschließend die Sitemap bei Google Search Console einreichen.
Pages-Adressen bleiben über HTTP-Header von der Indexierung ausgeschlossen. Eine Vorschau ist damit nicht passwortgeschützt.

## Unternehmensdaten und Datenschutz

Am 18.10.2026 vom Betreiber bestätigt: Triumph Technical Services UG (haftungsbeschränkt), Amtsgericht Tostedt, HRB 211346, Auf dem Jarten 6, 27607 Geestland; Geschäftsführer Viktor Jakobi. Keine USt-IdNr. oder Wirtschafts-ID angegeben. Die interne Steuernummer und die Bankverbindung werden nicht als Impressumspflichten veröffentlicht.
Am 18.10.2026 als öffentliche Kontakt- und Formular-Empfängeradresse bestätigt: `Jakobi@triumph-ts.de`.
Web3Forms ist für dieses Postfach angelegt. Verpflichtendes hCaptcha und die Einstellung „7 days“ sind im Dienst vorhanden. Die behauptete endgültige Löschung nach sieben Tagen ist wegen der abweichenden Angabe im [Web3Forms-DPA](https://web3forms.com/dpa), Abschnitt 8, nicht als bestätigt zu behandeln. Die Datenschutzhinweise nennen deshalb die dort beschriebene mögliche technische Speicherung bis zu drei Jahren. Der öffentliche Formularschlüssel wird in Cloudflare und lokal über Umgebungsvariablen eingebunden.
Die Datenschutzhinweise beschreiben Cloudflare Pages, Web3Forms, dessen Unterauftragsverarbeiter und die erst auf Anforderung geladene hCaptcha-Prüfung. Nach erneuter Prüfung am 19.10.2026 wird für hCaptcha eine vorher erläuterte Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG eingeholt. Auf eine pauschale Einstufung sämtlicher hCaptcha-Gerätezugriffe als unbedingt erforderlich wird verzichtet. Die aktive EU-US-DPF-Teilnahme von Intuition Machines für Non-HR-Daten einschließlich hCaptcha wurde im offiziellen Register bestätigt und in die Hinweise aufgenommen. Die Prüfung einschließlich Vertrags- und Übermittlungsgrenzen ist in [docs/datenschutz-pruefung.md](docs/datenschutz-pruefung.md) dokumentiert; sie ist keine anwaltliche oder behördliche Freigabe. Eine konkrete [Anbieteranfrage](docs/anbieteranfrage-web3forms.txt) zu den verbleibenden Nachweisen ist vorbereitet. Bei Änderungen an Anbietern, Analysefunktionen, Empfänger- oder Unternehmensdaten sind die Texte anzupassen.

## Erneute Launchprüfung am 18.10.2026

Die drei öffentlichen Seiten der Pages-Vorschau liefern HTTP 200, fehlende Seiten HTTP 404. Seitentitel, Beschreibungen, Canonicals, Open Graph, strukturierte Unternehmensdaten und die spätere Sitemap sind vorbereitet. Die Bild-Sitemap umfasst auch die Leistungskacheln. Die Vorschau bleibt absichtlich auf `noindex, nofollow`; robots.txt sperrt Crawler und die Sitemap bleibt bis zur Indexfreigabe leer.

Erneut bestanden: ESLint, TypeScript im statischen Build und 70 Tests. Die Exportprüfung umfasst 68 interne Links/Anker und 57 referenzierte Ressourcen; lokal fehlen keine Ziele oder Dateien. Bei 320, 768, 1024 und 1440 Pixeln gibt es keine horizontalen Überläufe oder überlappenden Leistungs- und Galeriekacheln. Pflichtfeldführung, Mehrfachauswahl, Erhalt der Projektdetails, mobile Navigation und Dialogbedienung per Escape wurden ohne Formularübermittlung geprüft. hCaptcha erzeugt vor Anforderung keine Skript- oder Iframe-Verbindung. Ungenutzte Steuer- und Bankdaten sind aus der aktuellen öffentlichen Konfiguration und dem Export entfernt. `pnpm audit --prod` meldet keine bekannten Schwachstellen; die zwei bereits dokumentierten Meldungen betreffen Entwicklungswerkzeuge.

Im Cloudflare-Projekt sind noch keine Custom Domains verbunden. Für `triumphtechnicalservices.de` und `www.triumphtechnicalservices.de` fehlen derzeit DNS-Ziele für die Website. Die Cloudflare-Build-Konfiguration stimmt (`npm run build`, Ausgabe `out`, Node 24, Branch `main`), läuft aber weiterhin mit `SITE_ENV=preview` und `NEXT_PUBLIC_SITE_INDEXING=false`.

Vor dem Launch verbleiben:

- Eingang und Antwortfunktion einer echten Testanfrage für Kurzformular, ausführliches Formular und Störfallpfad bestätigen. Auf Nutzerwunsch wird im Rahmen dieser Prüfung keine Testnachricht versendet.
- Die Aufbewahrung wird mit bis zu drei Jahren transparent beschrieben. Die Einwilligung für hCaptcha ist umgesetzt. Die tatsächliche Vertragszuordnung der über den Web3Forms-Schlüssel eingebundenen hCaptcha-Leistung und die Übermittlungsbewertung für Indien bleiben nach Maßgabe der dokumentierten Prüfung nachzuweisen; eine längere Frist oder eine Einwilligung ersetzt diese Nachweise nicht.
- Eine mögliche Kammerzugehörigkeit und berufsrechtliche Pflichtangaben für das Impressum anhand der tatsächlichen Tätigkeit der UG klären.
- In Cloudflare die bestätigten Unternehmensdaten aus `.env.example` ausdrücklich als Produktionsvariablen ergänzen und erst nach den tatsächlichen Prüfungen die Freigabevariablen setzen.
- Die Hauptdomain verbinden, `www` auf die Hauptdomain umleiten, HTTPS und Indexierung auf der echten Domain prüfen und anschließend die Sitemap in der Google Search Console einreichen.

Die Google Search Console ist seit dem 19.10.2026 für die Domain-Property `triumphtechnicalservices.de` im Kundenkonto `jakobi@triumph-ts.de` eingerichtet. Google hat die Inhaberschaft nach einem manuell ergänzten TXT-Eintrag bei Cloudflare bestätigt. Den Google-Bestätigungseintrag dauerhaft beibehalten. Hauptdomain, Weiterleitung und öffentliche Indexierung wurden dafür nicht freigeschaltet; die Sitemap wird erst nach dem Launch eingereicht. Weitere Nutzerrechte für die Agentur wurden nicht vergeben.

## Sicherheitsprüfung

Next.js und Vitest wurden aktualisiert, bekannte behebbare transitive Schwachstellen gepatcht. Den aktuellen Stand mit `pnpm audit --prod` bzw. `npm audit --omit=dev` prüfen.
Einzelne Meldungen betreffen weiterhin Entwicklungswerkzeuge (Braces und PostCSS Selector Parser unter Tailwind 3). Diese Werkzeuge werden nicht an Website-Besucher ausgeliefert; keine Entwicklungs- oder Testserver öffentlich betreiben. Eine Migration auf eine neue Tailwind-Hauptversion ist ein gesondertes Vorhaben.
