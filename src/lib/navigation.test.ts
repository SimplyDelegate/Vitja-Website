import { describe, expect, it } from "vitest";
import { aktiveSektion, ankerId } from "./navigation";

describe("Ankerkennung", () => {
  it("liest die Kennung aus einem Menü-Link", () => {
    expect(ankerId("/#galerie")).toBe("galerie");
    expect(ankerId("#kontakt")).toBe("kontakt");
  });
});

describe("Aktive Sektion", () => {
  const grenze = 96;

  it("meldet nichts, solange kein Abschnitt die Grenze passiert hat", () => {
    expect(aktiveSektion([], grenze)).toBeNull();
    expect(aktiveSektion([{ id: "leistungen", top: 400 }, { id: "kontakt", top: 2000 }], grenze)).toBeNull();
  });

  it("wählt den zuletzt passierten Abschnitt", () => {
    const positionen = [
      { id: "projektbeispiele", top: -1800 },
      { id: "leistungen", top: -60 },
      { id: "galerie", top: 900 }
    ];
    expect(aktiveSektion(positionen, grenze)).toBe("leistungen");
  });

  it("hängt nicht an der Reihenfolge der Eingabe", () => {
    // Die Menüreihenfolge weicht von der Dokumentreihenfolge ab: "Leistungen"
    // steht im Menü vorn, auf der Seite aber hinter den Projektbeispielen.
    const positionen = [
      { id: "leistungen", top: -60 },
      { id: "projektbeispiele", top: -1800 },
      { id: "kontakt", top: 2600 }
    ];
    expect(aktiveSektion(positionen, grenze)).toBe("leistungen");
  });

  it("zählt einen Abschnitt genau auf der Grenze als passiert", () => {
    expect(aktiveSektion([{ id: "galerie", top: grenze }], grenze)).toBe("galerie");
    expect(aktiveSektion([{ id: "galerie", top: grenze + 1 }], grenze)).toBeNull();
  });
});
