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
