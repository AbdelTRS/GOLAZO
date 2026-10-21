import "server-only";
import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { boosterOpening, collectionCard } from "@/db/schema";

export type NewOpening = {
  id: string;
  boosterType: string;
  source: "account" | "guest";
  cardIds: string[];
};

/**
 * Enregistre des boosters et ajoute leurs cartes à la collection, en une transaction.
 * Un booster déjà enregistré (même id) est ignoré. Renvoie le nombre de boosters ajoutés.
 */
export async function saveOpenings(userId: string, openings: NewOpening[]): Promise<number> {
  if (openings.length === 0) return 0;

  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(boosterOpening)
      .values(openings.map((opening) => ({ ...opening, userId })))
      .onConflictDoNothing()
      .returning({ cardIds: boosterOpening.cardIds });

    const quantities = new Map<string, number>();
    for (const { cardIds } of inserted) {
      for (const cardId of cardIds) quantities.set(cardId, (quantities.get(cardId) ?? 0) + 1);
    }

    if (quantities.size > 0) {
      await tx
        .insert(collectionCard)
        .values([...quantities].map(([cardId, quantity]) => ({ userId, cardId, quantity })))
        .onConflictDoUpdate({
          target: [collectionCard.userId, collectionCard.cardId],
          set: {
            quantity: sql`${collectionCard.quantity} + excluded.quantity`,
            lastObtainedAt: sql`now()`,
          },
        });
    }

    return inserted.length;
  });
}

export async function countGuestOpenings(userId: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(boosterOpening)
    .where(and(eq(boosterOpening.userId, userId), eq(boosterOpening.source, "guest")));
  return row?.value ?? 0;
}

export async function getCollection(userId: string) {
  return db
    .select({ cardId: collectionCard.cardId, quantity: collectionCard.quantity })
    .from(collectionCard)
    .where(eq(collectionCard.userId, userId));
}
