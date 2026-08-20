// Die Seite wird statisch ausgeliefert und hat keinen eigenen Server. Der
// Formularversand laeuft deshalb ueber einen externen Dienst; der Access-Key ist
// bei diesen Diensten oeffentlich und darf im Client-Bundle stehen.
export const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "https://api.web3forms.com/submit";
export const contactAccessKey = process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY ?? "";

// Datei-Anhaenge sind bei Web3Forms ein Pro-Feature. Erst aktivieren, wenn der
// Tarif sie traegt – sonst blendet das Formular die Upload-Felder aus und
// verweist auf das Nachreichen per E-Mail.
export const contactUploadsEnabled = process.env.NEXT_PUBLIC_CONTACT_UPLOADS === "true";

export function contactEndpointOrigin() {
  try {
    return new URL(contactEndpoint).origin;
  } catch {
    return "";
  }
}

/**
 * Alle Textwerte eines Formulars als flaches Objekt. Dateien und Mehrfachwerte
 * bleiben außen vor — die Prüffunktionen arbeiten ausschließlich auf Text.
 */
export function leseFormularWerte(form: HTMLFormElement | null): Record<string, string> {
  if (!form) return {};
  const werte: Record<string, string> = {};
  new FormData(form).forEach((wert, name) => {
    if (typeof wert === "string" && !(name in werte)) werte[name] = wert;
  });
  return werte;
}

/** Ohne Access-Key zeigen die Formulare nur den Hinweis auf Telefon und E-Mail. */
export const versandFreigeschaltet = contactAccessKey.length > 0;

/** Ausgang eines Versandversuchs; die Meldungstexte bleiben beim Aufrufer. */
export type VersandErgebnis = "gesendet" | "gesperrt" | "fehler";

/**
 * Gemeinsamer Versandweg beider Formulare: ergänzt die Pflichtfelder des
 * Dienstes und wertet die Antwort aus. Ohne Access-Key wird nichts gesendet —
 * der Aufrufer zeigt dann seinen Hinweis auf Telefon und E-Mail.
 */
export async function sendeFormular(daten: FormData, betreff: string, absender: string): Promise<VersandErgebnis> {
  if (!contactAccessKey) return "gesperrt";

  daten.set("access_key", contactAccessKey);
  daten.set("botcheck", "");
  daten.set("from_name", absender);
  daten.set("subject", betreff);

  try {
    const antwort = await fetch(contactEndpoint, { method: "POST", body: daten, headers: { Accept: "application/json" } });
    const ergebnis = (await antwort.json()) as { success?: boolean };
    return antwort.ok && ergebnis.success ? "gesendet" : "fehler";
  } catch {
    return "fehler";
  }
}
