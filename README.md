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
3. Eine möglichst kurze geeignete Aufbewahrung einstellen. Keine zusätzlichen Analyse-, Werbe- oder Drittanbieter-Integrationen aktivieren.
4. Den öffentlichen Access-Key in Cloudflare als `NEXT_PUBLIC_CONTACT_ACCESS_KEY` hinterlegen. Der Key ist für das Client-Bundle vorgesehen; keine privaten API- oder hCaptcha-Secrets eintragen. `NEXT_PUBLIC_CONTACT_ENDPOINT=https://api.web3forms.com/submit` verwenden.
5. Neu deployen. Kurzformular, ausführliche Anfrage und Störfallpfad prüfen. E-Mail und reinen Telefonkontakt berücksichtigen. Eine echte Anfrage absenden und ihren Eingang im Empfängerpostfach einschließlich Spamordner prüfen. Bei vorhandener Absender-E-Mail muss eine Antwort an diese Adresse möglich sein.
6. Mit fehlendem, ungültigem und bereits verwendetem Captcha-Token prüfen, dass der Dienst die Übermittlung ablehnt. Nach jeder Übermittlung bzw. Ablauf muss die Prüfung erneuert werden.

Ohne Access-Key wird kein Versand behauptet oder ausgelöst; die Website zeigt direkte Kontaktwege. Die Integration lädt hCaptcha erst nach bewusster Aktivierung. Eingaben bleiben bei Fehlern erhalten, und hängende Requests werden nach 20 Sekunden abgebrochen.
Dateianhänge bleiben deaktiviert. Sie benötigen einen passenden Tarif und einen gesonderten Funktionstest; Nachreichen per E-Mail ist möglich.

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
Web3Forms ist für dieses Postfach angelegt. Verpflichtendes hCaptcha und automatische Löschung der gespeicherten Anfragen nach sieben Tagen sind im Dienst eingestellt. Der öffentliche Formularschlüssel wird in Cloudflare und lokal über Umgebungsvariablen eingebunden.
Die Datenschutzhinweise beschreiben Cloudflare Pages, Web3Forms, dessen Unterauftragsverarbeiter und die nach Aktivierung geladene hCaptcha-Prüfung. Bei Änderungen an Anbietern, Analysefunktionen, Empfänger- oder Unternehmensdaten sind die Texte anzupassen. Die Umsetzung ist keine anwaltliche Freigabe.

## Sicherheitsprüfung

Next.js und Vitest wurden aktualisiert, bekannte behebbare transitive Schwachstellen gepatcht. Den aktuellen Stand mit `pnpm audit --prod` bzw. `npm audit --omit=dev` prüfen.
Einzelne Meldungen betreffen weiterhin Entwicklungswerkzeuge (Braces und PostCSS Selector Parser unter Tailwind 3). Diese Werkzeuge werden nicht an Website-Besucher ausgeliefert; keine Entwicklungs- oder Testserver öffentlich betreiben. Eine Migration auf eine neue Tailwind-Hauptversion ist ein gesondertes Vorhaben.
