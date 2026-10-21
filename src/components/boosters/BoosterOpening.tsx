"use client";

import { useState, type CSSProperties } from "react";
import { CardBack } from "@/components/cards/CardBack";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { STANDARD_BOOSTER } from "@/features/boosters/config";
import { drawBooster } from "@/features/boosters/draw";
import { CATALOG } from "@/features/cards/catalog";
import { RARITIES, RARITY_BY_ID } from "@/features/cards/rarities";
import type { PlayerCard as PlayerCardData, RarityId } from "@/features/cards/types";
import { BoosterPack } from "./BoosterPack";
import styles from "./BoosterOpening.module.css";

type Phase = "sealed" | "tearing" | "revealing";

/** Le sélecteur de démo n'existe qu'en développement. */
const DEMO_ENABLED = process.env.NODE_ENV !== "production";

const DEMO_OPTIONS: { value: RarityId | ""; label: string }[] = [
  { value: "", label: "Tirage normal" },
  { value: "epic", label: "Épique garantie" },
  { value: "legendary", label: "Légendaire garantie" },
  { value: "mythic", label: "Mythique garantie" },
];

const buttonPrimary =
  "font-display inline-flex items-center gap-2 rounded-xl bg-volt px-6 py-3 text-lg font-bold uppercase italic text-pitch-950 shadow-volt transition-transform hover:-translate-y-0.5";
const buttonSecondary =
  "font-display inline-flex items-center gap-2 rounded-xl border border-line-strong px-6 py-3 text-lg font-bold uppercase italic text-chalk transition-colors hover:border-volt hover:text-volt";

export function BoosterOpening() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [cards, setCards] = useState<PlayerCardData[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [flash, setFlash] = useState<{ key: number; rarity: RarityId } | null>(null);
  const [demoRarity, setDemoRarity] = useState<RarityId | "">("");

  const allRevealed = phase === "revealing" && revealed.every(Boolean);

  function openBooster() {
    if (phase !== "sealed") return;
    const drawn = drawBooster(CATALOG, STANDARD_BOOSTER, Math.random, {
      topRarity: demoRarity || undefined,
    });
    setCards(drawn);
    setRevealed(drawn.map(() => false));
    setPhase("tearing");
  }

  function celebrate(revealedCards: PlayerCardData[]) {
    // Les cartes sont rangées par rareté croissante : la dernière est la meilleure.
    const best = revealedCards.at(-1);
    if (best && RARITY_BY_ID[best.rarity].highlight) {
      setFlash((previous) => ({ key: (previous?.key ?? 0) + 1, rarity: best.rarity }));
    }
  }

  function revealCard(index: number) {
    if (revealed[index]) return;
    setRevealed((previous) => previous.map((value, i) => value || i === index));
    celebrate([cards[index]]);
  }

  function revealAll() {
    celebrate(cards.filter((_, i) => !revealed[i]));
    setRevealed(cards.map(() => true));
  }

  function reset() {
    setPhase("sealed");
    setCards([]);
    setRevealed([]);
    setFlash(null);
  }

  return (
    <div className={styles.stage}>
      {phase !== "revealing" && (
        <>
          <BoosterPack
            name={STANDARD_BOOSTER.name}
            cardCount={STANDARD_BOOSTER.slots.length}
            tearing={phase === "tearing"}
            onOpen={openBooster}
            onTorn={() => setPhase("revealing")}
          />
          <p className={styles.hint} aria-live="polite">
            {phase === "sealed" ? "Touche ou fais glisser pour déchirer" : "Ouverture…"}
          </p>
          {DEMO_ENABLED && phase === "sealed" && (
            <label className="flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-3 py-2 text-xs text-fog">
              Démo (dev)
              <select
                value={demoRarity}
                onChange={(event) => setDemoRarity(event.target.value as RarityId | "")}
                className="rounded bg-pitch-800 px-2 py-1 text-mist"
              >
                {DEMO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </>
      )}

      {phase === "revealing" && (
        <>
          <ul className={styles.hand}>
            {cards.map((card, index) => {
              const isRevealed = revealed[index];
              return (
                <li
                  key={`${card.id}-${index}`}
                  className={styles.slot}
                  style={{ "--i": index } as CSSProperties}
                  data-rarity={card.rarity}
                  data-highlight={isRevealed && RARITY_BY_ID[card.rarity].highlight}
                >
                  <button
                    type="button"
                    className={styles.flip}
                    data-flipped={isRevealed}
                    disabled={isRevealed}
                    onClick={() => revealCard(index)}
                    aria-label={isRevealed ? undefined : `Révéler la carte ${index + 1}`}
                  >
                    <span className={styles.flipInner}>
                      <span className={styles.face} aria-hidden={isRevealed}>
                        <CardBack />
                      </span>
                      <span className={`${styles.face} ${styles.front}`} aria-hidden={!isRevealed}>
                        <PlayerCard card={card} />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {allRevealed ? (
            <BoosterSummary cards={cards} onAgain={reset} />
          ) : (
            <div className={styles.actions}>
              <p className={`${styles.hint} w-full text-center`}>Touche une carte pour la retourner</p>
              <button type="button" className={buttonSecondary} onClick={revealAll}>
                Tout révéler
              </button>
            </div>
          )}
        </>
      )}

      {flash && (
        <div
          key={flash.key}
          className={styles.flash}
          data-rarity={flash.rarity}
          onAnimationEnd={() => setFlash(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function BoosterSummary({ cards, onAgain }: { cards: PlayerCardData[]; onAgain: () => void }) {
  const best = cards.at(-1);
  const counts = RARITIES.map((rarity) => ({
    rarity,
    count: cards.filter((card) => card.rarity === rarity.id).length,
  })).filter(({ count }) => count > 0);

  return (
    <section className={`${styles.summary} rounded-2xl border border-line bg-pitch-800/60 p-5 text-center`}>
      {best && (
        <p className="text-sm text-mist">
          Meilleure carte :{" "}
          <strong className="font-display text-lg font-bold uppercase italic text-chalk">
            {best.name}
          </strong>{" "}
          · {RARITY_BY_ID[best.rarity].label} · {best.rating}
        </p>
      )}
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {counts.map(({ rarity, count }) => (
          <li
            key={rarity.id}
            className="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-mist"
          >
            {count} × {rarity.label}
          </li>
        ))}
      </ul>
      <button type="button" className={`${buttonPrimary} mt-5`} onClick={onAgain}>
        Ouvrir un autre booster
      </button>
    </section>
  );
}
