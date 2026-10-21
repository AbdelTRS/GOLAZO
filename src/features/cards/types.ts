export type RarityId =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

/** Postes en notation française. */
export type Position =
  | "GB"
  | "DD"
  | "DC"
  | "DG"
  | "MDC"
  | "MC"
  | "MOC"
  | "AD"
  | "AG"
  | "BU";

export type PlayerStats = {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
};

export type PlayerCard = {
  id: string;
  /** Numéro dans le catalogue, affiché sur la carte. */
  number: number;
  name: string;
  position: Position;
  /** Code pays à 3 lettres, affiché en texte (pas de drapeau). */
  nation: string;
  club: string;
  rating: number;
  rarity: RarityId;
  stats: PlayerStats;
};

/** Carte avant attribution de son numéro de catalogue. */
export type CardDraft = Omit<PlayerCard, "number">;
