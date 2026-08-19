import { describe, expect, it } from "vitest";
import { asset, basePath } from "./assets";

describe("Asset-Pfade", () => {
  it("stellt den basePath absoluten Pfaden voran", () => expect(asset("/media/hero/rohrtrasse-anlage.webp")).toBe(`${basePath}/media/hero/rohrtrasse-anlage.webp`));
  it("lässt externe und relative Quellen unverändert", () => {
    expect(asset("https://example.com/bild.webp")).toBe("https://example.com/bild.webp");
    expect(asset("data:image/svg+xml,<svg/>")).toBe("data:image/svg+xml,<svg/>");
  });
});
