import type { PlayerCard } from "./types";

/**
 * Joueurs et clubs entièrement fictifs, pour le prototype.
 * Toute ressemblance avec des personnes réelles serait fortuite.
 */
export const MOCK_CARDS: readonly PlayerCard[] = [
  {
    id: "nils-ardoin",
    number: 412,
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
    number: 388,
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
    number: 301,
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
    number: 142,
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
    number: 37,
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
    number: 1,
    name: "Mateus Lindqvar",
    position: "BU",
    nation: "POR",
    club: "AC Solenne",
    rating: 93,
    rarity: "mythic",
    stats: { pace: 91, shooting: 95, passing: 84, dribbling: 92, defending: 41, physical: 86 },
  },
];
