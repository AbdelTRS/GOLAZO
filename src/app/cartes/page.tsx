import type { Metadata } from "next";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SHOWCASE } from "@/features/cards/catalog";
import { RARITY_BY_ID } from "@/features/cards/rarities";

export const metadata: Metadata = {
  title: "Cartes",
  description: "Les six raretés des cartes GOLAZO.",
};

export default function CardsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
        <section className="py-8 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-volt">
            Prototype · joueurs fictifs
          </p>
          <h1 className="font-display mt-2 text-5xl font-extrabold uppercase italic sm:text-6xl">
            Les cartes
          </h1>
          <p className="mt-4 max-w-2xl text-mist">
            Six raretés, de Commune à Mythique. Plus une carte est rare, plus son
            cadre est travaillé : halo, reflet holographique, puis cadre prismatique.
          </p>
        </section>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:gap-x-12">
          {SHOWCASE.map((card) => {
            const rarity = RARITY_BY_ID[card.rarity];
            return (
              <li key={card.id} className="mx-auto w-full max-w-[300px]">
                <PlayerCard card={card} />
                <div className="mt-4 text-center">
                  <p className="font-display text-xl font-bold uppercase italic">
                    {rarity.label}
                  </p>
                  <p className="mt-1 text-sm text-mist">{rarity.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
