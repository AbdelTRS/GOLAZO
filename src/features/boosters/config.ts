import type { RarityId } from "@/features/cards/types";

/** Poids de tirage par rareté, en pourcentage par carte (total : 100). */
export type DropRates = Record<RarityId, number>;

export type BoosterConfig = {
  name: string;
  /** Rareté minimale de chaque emplacement : un tirage inférieur est remonté à ce minimum. */
  slots: RarityId[];
  rates: DropRates;
};

export const STANDARD_BOOSTER: BoosterConfig = {
  name: "Booster standard",
  slots: ["common", "common", "common", "common", "uncommon"],
  rates: {
    common: 60,
    uncommon: 26,
    rare: 11,
    epic: 2.5,
    legendary: 0.45,
    mythic: 0.05,
  },
};
