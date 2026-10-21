import type { PlayerStats, RarityId } from "./types";

export type Rarity = {
  id: RarityId;
  label: string;
  /** Sigle affiché dans le badge de la carte. */
  short: string;
  description: string;
  /** Reflet holographique animé. */
  holo: boolean;
  /** Révélation spectaculaire à l'ouverture d'un booster. */
  highlight: boolean;
};

/** Raretés de la plus commune à la plus rare. */
export const RARITIES: readonly Rarity[] = [
  {
    id: "common",
    label: "Commune",
    short: "C",
    description: "Cadre acier brossé, sans effet.",
    holo: false,
    highlight: false,
  },
  {
    id: "uncommon",
    label: "Peu commune",
    short: "PC",
    description: "Cadre vert gazon, liseré lumineux.",
    holo: false,
    highlight: false,
  },
  {
    id: "rare",
    label: "Rare",
    short: "R",
    description: "Cadre bleu nuit, halo externe.",
    holo: false,
    highlight: false,
  },
  {
    id: "epic",
    label: "Épique",
    short: "É",
    description: "Cadre violet, premier reflet holographique.",
    holo: true,
    highlight: false,
  },
  {
    id: "legendary",
    label: "Légendaire",
    short: "L",
    description: "Cadre or, holo et forte lueur.",
    holo: true,
    highlight: true,
  },
  {
    id: "mythic",
    label: "Mythique",
    short: "M",
    description: "Cadre prismatique animé, holo intégral.",
    holo: true,
    highlight: true,
  },
];

export const RARITY_BY_ID = Object.fromEntries(
  RARITIES.map((rarity) => [rarity.id, rarity]),
) as Record<RarityId, Rarity>;

/** Rang de la rareté : 0 pour Commune, 5 pour Mythique. */
export function rarityIndex(id: RarityId): number {
  return RARITIES.findIndex((rarity) => rarity.id === id);
}

export const STAT_LABELS: Record<keyof PlayerStats, string> = {
  pace: "VIT",
  shooting: "TIR",
  passing: "PAS",
  dribbling: "DRI",
  defending: "DÉF",
  physical: "PHY",
};
