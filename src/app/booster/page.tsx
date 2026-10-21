import type { Metadata } from "next";
import { Suspense } from "react";
import { BoosterOpening } from "@/components/boosters/BoosterOpening";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionUser } from "@/features/auth/session";

export const metadata: Metadata = {
  title: "Booster",
  description: "Ouvre un booster GOLAZO de 5 cartes.",
};

export default function BoosterPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-volt/10 blur-3xl"
      />
      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6">
        <section className="pt-6 text-center sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-volt">
            Prototype · booster standard
          </p>
          <h1 className="font-display mt-2 text-5xl font-extrabold uppercase italic sm:text-6xl">
            Ouvre ton booster
          </h1>
        </section>

        {/* La session est lue à la requête : cette zone arrive en streaming. */}
        <Suspense fallback={<div className="mt-10 min-h-[520px]" aria-busy="true" />}>
          <BoosterSection />
        </Suspense>
      </main>
    </div>
  );
}

async function BoosterSection() {
  const user = await getSessionUser();
  return <BoosterOpening signedIn={user !== null} />;
}
