import { describe, expect, it } from "vitest";
import { CATALOG } from "@/features/cards/catalog";
import { RARITIES, rarityIndex } from "@/features/cards/rarities";
import type { RarityId } from "@/features/cards/types";
import { createSeededRng } from "@/lib/random";
import { STANDARD_BOOSTER } from "./config";
import { drawBooster, rollRarity } from "./draw";

describe("rollRarity", () => {
  it("respecte les taux de tirage sur 200 000 cartes", () => {
    const rng = createSeededRng(1);
    const draws = 200_000;
    const counts = Object.fromEntries(RARITIES.map((r) => [r.id, 0])) as Record<RarityId, number>;

    for (let i = 0; i < draws; i++) {
      counts[rollRarity(STANDARD_BOOSTER.rates, rng)]++;
    }

    for (const rarity of RARITIES) {
      const expected = STANDARD_BOOSTER.rates[rarity.id] / 100;
      const observed = counts[rarity.id] / draws;
      // Tolérance de 4 écarts-types : un échec signalerait un vrai biais, pas le hasard.
      const tolerance = 4 * Math.sqrt((expected * (1 - expected)) / draws);
      expect(Math.abs(observed - expected), rarity.id).toBeLessThan(tolerance);
    }
  });
});

describe("drawBooster", () => {
  const rng = createSeededRng(42);
  const boosters = Array.from({ length: 5_000 }, () =>
    drawBooster(CATALOG, STANDARD_BOOSTER, rng),
  );

  it("contient 5 cartes", () => {
    for (const booster of boosters) expect(booster).toHaveLength(5);
  });

  it("garantit au moins une Peu commune ou mieux", () => {
    for (const booster of boosters) {
      expect(booster.some((card) => rarityIndex(card.rarity) >= rarityIndex("uncommon"))).toBe(true);
    }
  });

  it("range les cartes de la moins rare à la plus rare", () => {
    for (const booster of boosters) {
      const ranks = booster.map((card) => rarityIndex(card.rarity));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it("ne contient pas deux fois la même carte", () => {
    for (const booster of boosters) {
      expect(new Set(booster.map((card) => card.id)).size).toBe(booster.length);
    }
  });

  it("peut forcer la rareté de la meilleure carte (démo)", () => {
    const booster = drawBooster(CATALOG, STANDARD_BOOSTER, createSeededRng(7), {
      topRarity: "mythic",
    });
    expect(booster.at(-1)?.rarity).toBe("mythic");
  });
});
