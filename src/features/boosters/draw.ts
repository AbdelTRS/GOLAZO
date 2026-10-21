import { RARITIES, rarityIndex } from "@/features/cards/rarities";
import type { PlayerCard, RarityId } from "@/features/cards/types";
import type { Rng } from "@/lib/random";
import type { BoosterConfig, DropRates } from "./config";

/*
 * Logique de tirage, sans dépendance à React ni au navigateur :
 * elle pourra être exécutée côté serveur quand les boosters seront sauvegardés.
 */

export type DrawOptions = {
  /** Démo : force la rareté du dernier emplacement. */
  topRarity?: RarityId;
};

export function rollRarity(rates: DropRates, rng: Rng): RarityId {
  const total = RARITIES.reduce((sum, rarity) => sum + rates[rarity.id], 0);
  let roll = rng() * total;
  for (const rarity of RARITIES) {
    roll -= rates[rarity.id];
    if (roll < 0) return rarity.id;
  }
  return RARITIES[RARITIES.length - 1].id;
}

function maxRarity(a: RarityId, b: RarityId): RarityId {
  return rarityIndex(a) >= rarityIndex(b) ? a : b;
}

/** Choisit une carte de la rareté demandée, en évitant les doublons dans le même booster. */
function pickCard(
  catalog: readonly PlayerCard[],
  rarity: RarityId,
  alreadyPicked: PlayerCard[],
  rng: Rng,
): PlayerCard {
  const pool = catalog.filter((card) => card.rarity === rarity);
  if (pool.length === 0) {
    throw new Error(`Aucune carte de rareté « ${rarity} » dans le catalogue.`);
  }
  const fresh = pool.filter((card) => !alreadyPicked.some((picked) => picked.id === card.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  return candidates[Math.floor(rng() * candidates.length)];
}

/** Tire un booster. Les cartes sont rendues de la moins rare à la plus rare. */
export function drawBooster(
  catalog: readonly PlayerCard[],
  config: BoosterConfig,
  rng: Rng = Math.random,
  options: DrawOptions = {},
): PlayerCard[] {
  const rarities = config.slots.map((min) => maxRarity(rollRarity(config.rates, rng), min));
  if (options.topRarity) {
    rarities[rarities.length - 1] = options.topRarity;
  }

  const cards: PlayerCard[] = [];
  for (const rarity of rarities) {
    cards.push(pickCard(catalog, rarity, cards, rng));
  }

  return cards.sort((a, b) => rarityIndex(a.rarity) - rarityIndex(b.rarity));
}
