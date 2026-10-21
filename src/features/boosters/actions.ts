"use server";

import { randomUUID } from "node:crypto";
import { getSessionUser } from "@/features/auth/session";
import { CATALOG } from "@/features/cards/catalog";
import { RARITIES } from "@/features/cards/rarities";
import type { PlayerCard, RarityId } from "@/features/cards/types";
import { countGuestOpenings, saveOpenings } from "@/features/collection/queries";
import { GUEST_BOOSTER_LIMIT, STANDARD_BOOSTER } from "./config";
import { drawBooster } from "./draw";
import { createGuestToken, verifyGuestToken } from "./guest-token";

export type OpenBoosterResult =
  | { ok: true; cards: PlayerCard[]; guestToken?: string }
  | { ok: false; error: string };

/**
 * Tire un booster côté serveur.
 * Connecté : les cartes sont enregistrées dans la collection.
 * Invité : les cartes sont renvoyées avec un jeton signé, à importer à l'inscription.
 */
export async function openBoosterAction(demoRarity?: RarityId): Promise<OpenBoosterResult> {
  // Le forçage de rareté n'existe qu'en développement, et seulement avec une valeur connue.
  const topRarity =
    process.env.NODE_ENV !== "production" && RARITIES.some((rarity) => rarity.id === demoRarity)
      ? demoRarity
      : undefined;

  const cards = drawBooster(CATALOG, STANDARD_BOOSTER, Math.random, { topRarity });
  const opening = {
    id: randomUUID(),
    boosterType: STANDARD_BOOSTER.id,
    cardIds: cards.map((card) => card.id),
  };

  try {
    const user = await getSessionUser();
    if (user) {
      await saveOpenings(user.id, [{ ...opening, source: "account" }]);
      return { ok: true, cards };
    }
    return { ok: true, cards, guestToken: createGuestToken({ ...opening, issuedAt: Date.now() }) };
  } catch (error) {
    console.error("[GOLAZO] Ouverture de booster impossible", error);
    return { ok: false, error: "Le booster n'a pas pu être ouvert. Réessaie dans un instant." };
  }
}

const CATALOG_IDS = new Set(CATALOG.map((card) => card.id));

/** Ajoute à la collection les boosters ouverts en invité (10 au maximum par compte). */
export async function importGuestBoostersAction(
  tokens: string[],
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Connexion requise." };

  try {
    const remaining = GUEST_BOOSTER_LIMIT - (await countGuestOpenings(user.id));
    if (remaining <= 0) return { ok: true, imported: 0 };

    const boosters = tokens
      .slice(0, GUEST_BOOSTER_LIMIT * 2)
      .map(verifyGuestToken)
      .filter((booster) => booster !== null)
      .filter((booster) => booster.cardIds.every((id) => CATALOG_IDS.has(id)))
      .sort((a, b) => a.issuedAt - b.issuedAt)
      .slice(0, remaining);

    const imported = await saveOpenings(
      user.id,
      boosters.map(({ id, boosterType, cardIds }) => ({ id, boosterType, cardIds, source: "guest" })),
    );
    return { ok: true, imported };
  } catch (error) {
    console.error("[GOLAZO] Import des boosters invités impossible", error);
    return { ok: false, error: "Import impossible pour le moment." };
  }
}
