import { createSeededRng, pickOne, randomInt, type Rng } from "@/lib/random";
import { SHOWCASE_CARDS } from "./mock-cards";
import type { CardDraft, PlayerCard, PlayerStats, Position, RarityId } from "./types";

/*
 * Catalogue fictif du prototype : les joueurs vitrines + des joueurs générés.
 * La génération utilise une graine fixe, le catalogue est donc identique à chaque build
 * (même contenu côté serveur et côté navigateur).
 */

const FIRST_NAMES = [
  "Aurel", "Bastien", "Caio", "Darius", "Elio", "Fabian", "Gaspard", "Idris",
  "Jonas", "Kenzo", "Lucan", "Marlon", "Noam", "Oskar", "Paolo", "Ruben",
  "Silas", "Timeo", "Ugo", "Viktor", "Wassim", "Yoan", "Zeno", "Amadou",
];

const LAST_NAMES = [
  "Aldric", "Brenner", "Castellan", "Delvaux", "Esparza", "Ferrand", "Gravel",
  "Halvorsen", "Ibarra", "Jansky", "Kerbrat", "Lazare", "Montaro", "Nevrin",
  "Orlak", "Pellerin", "Quiroga", "Rasmund", "Solari", "Tavernel", "Ulmen",
  "Varga", "Wexley", "Yildor", "Zamorel", "Diakhaby",
];

const CLUBS = [
  "FC Lumen", "Nordhavn SK", "Atlético Brisa", "Olympique Vireo", "Real Ostara",
  "AC Solenne", "Sporting Aurora", "FC Granit", "Union Calypso", "Dynamo Velde",
  "Racing Kestrel", "Inter Basalte",
];

const NATIONS = [
  "FRA", "ESP", "POR", "BRA", "ARG", "GER", "ITA", "NED", "BEL", "SEN", "CIV",
  "MAR", "ALG", "NGA", "GHA", "JPN", "KOR", "USA", "MEX", "CRO", "DEN", "NOR",
];

const POSITIONS: Position[] = ["GB", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

/** Écart de chaque statistique par rapport à la note globale, selon le poste. */
const POSITION_PROFILES: Record<Position, PlayerStats> = {
  GB: { pace: -20, shooting: -45, passing: -5, dribbling: -20, defending: 4, physical: 0 },
  DD: { pace: 2, shooting: -25, passing: -6, dribbling: -10, defending: 3, physical: 0 },
  DC: { pace: -10, shooting: -30, passing: -12, dribbling: -16, defending: 5, physical: 4 },
  DG: { pace: 2, shooting: -25, passing: -6, dribbling: -10, defending: 3, physical: 0 },
  MDC: { pace: -10, shooting: -15, passing: 0, dribbling: -5, defending: 2, physical: 2 },
  MC: { pace: -5, shooting: -8, passing: 3, dribbling: 0, defending: -12, physical: -3 },
  MOC: { pace: 0, shooting: 0, passing: 3, dribbling: 3, defending: -35, physical: -10 },
  AD: { pace: 5, shooting: -3, passing: -5, dribbling: 3, defending: -40, physical: -15 },
  AG: { pace: 5, shooting: -3, passing: -5, dribbling: 3, defending: -40, physical: -15 },
  BU: { pace: 2, shooting: 4, passing: -10, dribbling: -2, defending: -45, physical: -2 },
};

const RATING_RANGES: Record<RarityId, [min: number, max: number]> = {
  common: [52, 64],
  uncommon: [65, 72],
  rare: [73, 79],
  epic: [80, 84],
  legendary: [85, 89],
  mythic: [90, 94],
};

/** Nombre de joueurs générés par rareté (en plus des vitrines). */
const GENERATED_PER_RARITY: Record<RarityId, number> = {
  common: 16,
  uncommon: 11,
  rare: 8,
  epic: 4,
  legendary: 2,
  mythic: 1,
};

const CATALOG_SEED = 20261021;

function clampStat(value: number): number {
  return Math.max(20, Math.min(99, value));
}

function generateStats(rng: Rng, position: Position, rating: number): PlayerStats {
  const profile = POSITION_PROFILES[position];
  const stat = (offset: number) => clampStat(rating + offset + randomInt(rng, -4, 4));
  return {
    pace: stat(profile.pace),
    shooting: stat(profile.shooting),
    passing: stat(profile.passing),
    dribbling: stat(profile.dribbling),
    defending: stat(profile.defending),
    physical: stat(profile.physical),
  };
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function generateDrafts(): CardDraft[] {
  const rng = createSeededRng(CATALOG_SEED);
  const usedIds = new Set(SHOWCASE_CARDS.map((card) => card.id));
  const drafts: CardDraft[] = [];

  for (const [rarity, count] of Object.entries(GENERATED_PER_RARITY) as [RarityId, number][]) {
    for (let i = 0; i < count; i++) {
      let name: string;
      let id: string;
      do {
        name = `${pickOne(rng, FIRST_NAMES)} ${pickOne(rng, LAST_NAMES)}`;
        id = slugify(name);
      } while (usedIds.has(id));
      usedIds.add(id);

      const [min, max] = RATING_RANGES[rarity];
      const rating = randomInt(rng, min, max);
      const position = pickOne(rng, POSITIONS);

      drafts.push({
        id,
        name,
        position,
        nation: pickOne(rng, NATIONS),
        club: pickOne(rng, CLUBS),
        rating,
        rarity,
        stats: generateStats(rng, position, rating),
      });
    }
  }

  return drafts;
}

/** Numérote le catalogue par note décroissante : #0001 = meilleure carte. */
function buildCatalog(drafts: CardDraft[]): PlayerCard[] {
  return [...drafts]
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
    .map((draft, index) => ({ ...draft, number: index + 1 }));
}

export const CATALOG: readonly PlayerCard[] = buildCatalog([
  ...SHOWCASE_CARDS,
  ...generateDrafts(),
]);

const SHOWCASE_IDS = new Set(SHOWCASE_CARDS.map((card) => card.id));

export const SHOWCASE: readonly PlayerCard[] = CATALOG.filter((card) =>
  SHOWCASE_IDS.has(card.id),
).reverse();
