/**
 * Hilfen für die Navigationshervorhebung im Header. Die Auswahl steht hier
 * statt in der Komponente, damit sie ohne Browser prüfbar bleibt.
 */

/** Anker eines Menüpunkts ("/#galerie" → "galerie"). */
export function ankerId(href: string): string {
  return href.slice(href.indexOf("#") + 1);
}

/**
 * Der Abschnitt, in dem gerade gelesen wird: von allen, deren Oberkante die
 * Unterkante des Headers bereits passiert hat, der zuletzt passierte.
 *
 * Bewusst über die größte Oberkante statt über die Listenreihenfolge — die
 * Menüreihenfolge weicht von der Dokumentreihenfolge ab ("Leistungen" steht im
 * Menü vor "Projekte", auf der Seite aber dahinter).
 */
export function aktiveSektion(positionen: Array<{ id: string; top: number }>, grenze: number): string | null {
  let treffer: string | null = null;
  let besteOberkante = -Infinity;

  for (const { id, top } of positionen) {
    if (top <= grenze && top > besteOberkante) {
      besteOberkante = top;
      treffer = id;
    }
  }

  return treffer;
}
