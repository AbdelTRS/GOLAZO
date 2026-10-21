import type { CardDraft } from "./types";

/**
 * Joueurs vitrines, un par rareté, entièrement fictifs.
 * Toute ressemblance avec des personnes réelles serait fortuite.
 */
export const SHOWCASE_CARDS: readonly CardDraft[] = [
  {
    id: "nils-ardoin",
    name: "Nils Ardoin",
    position: "DC",
    nation: "FRA",
    club: "FC Lumen",
    rating: 61,
    rarity: "common",
    stats: { pace: 58, shooting: 34, passing: 52, dribbling: 49, defending: 66, physical: 68 },
  },
  {
    id: "kofi-belmar",
    name: "Kofi Belmar",
    position: "MC",
    nation: "GHA",
    club: "Nordhavn SK",
    rating: 69,
    rarity: "uncommon",
    stats: { pace: 71, shooting: 62, passing: 70, dribbling: 68, defending: 58, physical: 66 },
  },
  {
    id: "teo-valcarcel",
    name: "Teo Valcárcel",
    position: "AD",
    nation: "ESP",
    club: "Atlético Brisa",
    rating: 77,
    rarity: "rare",
    stats: { pace: 86, shooting: 72, passing: 70, dribbling: 81, defending: 35, physical: 61 },
  },
  {
    id: "yanis-korvel",
    name: "Yanis Korvel",
    position: "MOC",
    nation: "BEL",
    club: "Olympique Vireo",
    rating: 83,
    rarity: "epic",
    stats: { pace: 80, shooting: 82, passing: 86, dribbling: 87, defending: 44, physical: 68 },
  },
  {
    id: "rafael-ostend",
    name: "Rafael Ostend",
    position: "GB",
    nation: "BRA",
    club: "Real Ostara",
    rating: 87,
    rarity: "legendary",
    stats: { pace: 55, shooting: 28, passing: 79, dribbling: 52, defending: 89, physical: 84 },
  },
  {
    id: "mateus-lindqvar",
    name: "Mateus Lindqvar",
    position: "BU",
    nation: "POR",
    club: "AC Solenne",
    rating: 93,
    rarity: "mythic",
    stats: { pace: 91, shooting: 95, passing: 84, dribbling: 92, defending: 41, physical: 86 },
  },
];
