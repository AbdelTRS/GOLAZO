import { describe, expect, it } from "vitest";
import { CATALOG, SHOWCASE } from "./catalog";
import { RARITIES } from "./rarities";

describe("CATALOG", () => {
  it("a des identifiants uniques", () => {
    expect(new Set(CATALOG.map((card) => card.id)).size).toBe(CATALOG.length);
  });

  it("numérote les cartes de 1 à N par note décroissante", () => {
    CATALOG.forEach((card, index) => expect(card.number).toBe(index + 1));
    for (let i = 1; i < CATALOG.length; i++) {
      expect(CATALOG[i - 1].rating).toBeGreaterThanOrEqual(CATALOG[i].rating);
    }
  });

  it("contient au moins une carte de chaque rareté", () => {
    for (const rarity of RARITIES) {
      expect(CATALOG.some((card) => card.rarity === rarity.id), rarity.id).toBe(true);
    }
  });

  it("garde des statistiques entre 20 et 99", () => {
    for (const card of CATALOG) {
      for (const value of Object.values(card.stats)) {
        expect(value).toBeGreaterThanOrEqual(20);
        expect(value).toBeLessThanOrEqual(99);
      }
    }
  });

  it("expose une vitrine d'une carte par rareté, dans l'ordre", () => {
    expect(SHOWCASE.map((card) => card.rarity)).toEqual(RARITIES.map((rarity) => rarity.id));
  });
});
