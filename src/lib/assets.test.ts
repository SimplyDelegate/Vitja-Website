import { describe, expect, it } from "vitest";
import { absoluteAssetUrl, asset, basePath } from "./assets";

describe("Asset-Pfade", () => {
  it("stellt den basePath absoluten Pfaden voran", () => expect(asset("/media/hero/rohrtrasse-anlagenbau.webp")).toBe(`${basePath}/media/hero/rohrtrasse-anlagenbau.webp`));
  it("erzeugt absolute Asset-URLs ohne einen doppelten Seitenpfad", () => {
    expect(absoluteAssetUrl("/brand/logo.svg", "https://example.com/Vitja-Website"))
      .toBe(`https://example.com${basePath}/brand/logo.svg`);
  });
  it("lässt externe und relative Quellen unverändert", () => {
    expect(asset("https://example.com/bild.webp")).toBe("https://example.com/bild.webp");
    expect(asset("data:image/svg+xml,<svg/>")).toBe("data:image/svg+xml,<svg/>");
  });
});
