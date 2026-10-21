import { Logo } from "@/components/brand/Logo";
import { CardBack } from "@/components/cards/CardBack";
import { siteConfig } from "@/config/site";

const pillars = [
  {
    title: "Ouvre des boosters",
    text: "Des boosters de cartes de football à déchirer, avec des raretés de Commune à Légendaire.",
  },
  {
    title: "Complète tes albums",
    text: "Collectionne les joueurs, rassemble les effectifs et fais grimper ta collection.",
  },
  {
    title: "Affronte les autres",
    text: "Échanges, marché et défis entre collectionneurs, pour devenir le meilleur.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Halo vert en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-volt/10 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium uppercase tracking-widest text-mist">
          En développement
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <section>
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-volt">
            <span className="size-2 rounded-full bg-volt shadow-volt" />
            Jeu de collection de cartes
          </p>
          <h1 className="font-display text-7xl leading-[0.85] font-extrabold italic uppercase sm:text-8xl lg:text-9xl">
            Gola<span className="text-volt">zo</span>
          </h1>
          <p className="font-display mt-4 text-2xl font-semibold uppercase italic tracking-wide text-chalk sm:text-3xl">
            {siteConfig.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            {siteConfig.description}
          </p>
        </section>

        <div className="mx-auto w-full max-w-[260px] rotate-3 sm:max-w-[300px]">
          <CardBack />
        </div>
      </main>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6">
        {pillars.map((pillar, index) => (
          <article
            key={pillar.title}
            className="rounded-2xl border border-line bg-pitch-800/60 p-5 backdrop-blur transition-colors hover:border-volt/40"
          >
            <span className="font-display text-sm font-bold text-volt">
              0{index + 1}
            </span>
            <h2 className="font-display mt-1 text-2xl font-bold uppercase italic">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{pillar.text}</p>
          </article>
        ))}
      </section>

      <footer className="relative z-10 border-t border-line py-6 text-center text-xs text-fog">
        {siteConfig.name} — prototype
      </footer>
    </div>
  );
}
