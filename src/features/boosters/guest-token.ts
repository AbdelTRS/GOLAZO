import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Un booster ouvert sans compte est renvoyé avec un jeton signé par le serveur.
 * Le navigateur le garde ; à l'inscription, le serveur vérifie la signature avant
 * d'ajouter les cartes à la collection. Impossible donc d'inventer ses propres cartes.
 */

export type GuestBooster = {
  id: string;
  boosterType: string;
  cardIds: string[];
  issuedAt: number;
};

function getSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET manquant.");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createGuestToken(booster: GuestBooster): string {
  const payload = Buffer.from(JSON.stringify(booster)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Renvoie le booster si le jeton est authentique, sinon null. */
export function verifyGuestToken(token: string): GuestBooster | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const booster = JSON.parse(Buffer.from(payload, "base64url").toString()) as GuestBooster;
    if (typeof booster.id !== "string" || !Array.isArray(booster.cardIds)) return null;
    return booster;
  } catch {
    return null;
  }
}
