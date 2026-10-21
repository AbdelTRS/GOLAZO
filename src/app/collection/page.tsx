import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonPrimary } from "@/components/ui/buttons";
import { getSessionUser } from "@/features/auth/session";
import { CATALOG } from "@/features/cards/catalog";
import { rarityIndex } from "@/features/cards/rarities";
import { getCollection } from "@/features/collection/queries";

export const metadata: Metadata = {
  title: "Ma collection",
};

export default function CollectionPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
        <Suspense fallback={<p className="py-12 text-mist">Chargement de ta collection…</p>}>
          <CollectionContent />
        </Suspense>
      </main>
    </div>
  );
}

const CATALOG_BY_ID = new Map(CATALOG.map((card) => [card.id, card]));

async function CollectionContent() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  const owned = (await getCollection(user.id))
    .map(({ cardId, quantity }) => ({ card: CATALOG_BY_ID.get(cardId), quantity }))
    .filter((entry) => entry.card !== undefined)
    .map((entry) => ({ card: entry.card!, quantity: entry.quantity }))
    .sort(
      (a, b) =>
        rarityIndex(b.card.rarity) - rarityIndex(a.card.rarity) || b.card.rating - a.card.rating,
    );

  const totalCopies = owned.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <>
      <section className="py-8 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-volt">{user.name}</p>
        <h1 className="font-display mt-2 text-5xl font-extrabold uppercase italic sm:text-6xl">
          Ma collection
        </h1>
        <p className="mt-4 text-mist">
          <strong className="text-chalk">
            {owned.length} / {CATALOG.length}
          </strong>{" "}
          joueurs différents · {totalCopies} cartes au total
        </p>
        <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-pitch-700">
          <div
            className="h-full rounded-full bg-volt"
            style={{ width: `${(owned.length / CATALOG.length) * 100}%` }}
          />
        </div>
      </section>

      {owned.length === 0 ? (
        <div className="rounded-2xl border border-line bg-pitch-800/60 p-8 text-center">
          <p className="text-mist">Ta collection est vide pour l&apos;instant.</p>
          <Link href="/booster" className={`${buttonPrimary} mt-5`}>
            Ouvrir un booster
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {owned.map(({ card, quantity }) => (
            <li key={card.id} className="relative mx-auto w-full max-w-[240px]">
              <PlayerCard card={card} />
              {quantity > 1 && (
                <span className="absolute -top-2 -right-2 rounded-full border border-volt/50 bg-pitch-950 px-2.5 py-1 text-xs font-bold text-volt">
                  ×{quantity}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
