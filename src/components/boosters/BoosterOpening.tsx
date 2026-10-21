"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { CardBack } from "@/components/cards/CardBack";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { buttonPrimary, buttonSecondary } from "@/components/ui/buttons";
import { openBoosterAction } from "@/features/boosters/actions";
import { GUEST_BOOSTER_LIMIT, STANDARD_BOOSTER } from "@/features/boosters/config";
import { addGuestToken, useGuestBoosterCount } from "@/features/boosters/guest-storage";
import { RARITIES, RARITY_BY_ID } from "@/features/cards/rarities";
import type { PlayerCard as PlayerCardData, RarityId } from "@/features/cards/types";
import { BoosterPack } from "./BoosterPack";
import styles from "./BoosterOpening.module.css";

type Phase = "sealed" | "opening";

/** Le sélecteur de démo n'existe qu'en développement. */
const DEMO_ENABLED = process.env.NODE_ENV !== "production";

const DEMO_OPTIONS: { value: RarityId | ""; label: string }[] = [
  { value: "", label: "Tirage normal" },
  { value: "epic", label: "Épique garantie" },
  { value: "legendary", label: "Légendaire garantie" },
  { value: "mythic", label: "Mythique garantie" },
];

type BoosterOpeningProps = {
  signedIn: boolean;
};

export function BoosterOpening({ signedIn }: BoosterOpeningProps) {
  const [phase, setPhase] = useState<Phase>("sealed");
  /** L'animation de déchirure est finie. */
  const [torn, setTorn] = useState(false);
  const [cards, setCards] = useState<PlayerCardData[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ key: number; rarity: RarityId } | null>(null);
  const [demoRarity, setDemoRarity] = useState<RarityId | "">("");

  const guestCount = useGuestBoosterCount();
  const guestRemaining = signedIn || guestCount === null ? null : GUEST_BOOSTER_LIMIT - guestCount;

  // Les cartes s'affichent quand le sachet est déchiré ET que le serveur a répondu.
  const revealing = phase === "opening" && torn && cards.length > 0;
  const allRevealed = revealing && revealed.every(Boolean);
  const guestLocked = phase === "sealed" && guestRemaining !== null && guestRemaining <= 0;

  async function openBooster() {
    if (phase !== "sealed" || guestLocked) return;
    setPhase("opening");
    setTorn(false);
    setError(null);

    const result = await openBoosterAction(demoRarity || undefined);
    if (!result.ok) {
      setError(result.error);
      setPhase("sealed");
      return;
    }
    if (result.guestToken) addGuestToken(result.guestToken);
    setCards(result.cards);
    setRevealed(result.cards.map(() => false));
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
    setTorn(false);
    setCards([]);
    setRevealed([]);
    setFlash(null);
  }

  return (
    <div className={styles.stage}>
      {guestLocked && <GuestLimitPanel />}

      {!revealing && !guestLocked && (
        <>
          <BoosterPack
            name={STANDARD_BOOSTER.name}
            cardCount={STANDARD_BOOSTER.slots.length}
            tearing={phase === "opening"}
            onOpen={openBooster}
            onTorn={() => setTorn(true)}
          />
          <p className={styles.hint} aria-live="polite">
            {phase === "sealed" ? "Touche ou fais glisser pour déchirer" : "Ouverture…"}
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          {guestRemaining !== null && phase === "sealed" && (
            <GuestCounter remaining={guestRemaining} />
          )}
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

      {revealing && (
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
            <BoosterSummary cards={cards} signedIn={signedIn} onAgain={reset} />
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

function GuestCounter({ remaining }: { remaining: number }) {
  const opened = GUEST_BOOSTER_LIMIT - remaining;
  return (
    <div className="w-full max-w-xs text-center">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-mist">
        <span>Boosters d&apos;essai</span>
        <span>
          {opened} / {GUEST_BOOSTER_LIMIT}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-pitch-700">
        <div
          className="h-full rounded-full bg-volt transition-[width]"
          style={{ width: `${(opened / GUEST_BOOSTER_LIMIT) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-fog">
        <Link href="/connexion" className="text-volt hover:underline">
          Crée ton compte
        </Link>{" "}
        pour sauvegarder tes cartes.
      </p>
    </div>
  );
}

function GuestLimitPanel() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-volt/30 bg-pitch-800/70 p-6 text-center shadow-volt">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-volt">Essai terminé</p>
      <h2 className="font-display mt-2 text-3xl font-extrabold uppercase italic">
        Tes {GUEST_BOOSTER_LIMIT} boosters d&apos;essai sont ouverts
      </h2>
      <p className="mt-3 text-sm text-mist">
        Crée ton compte avec Discord ou ton e-mail pour continuer à ouvrir des boosters. Les cartes
        que tu as déjà obtenues seront ajoutées à ta collection.
      </p>
      <Link href="/connexion" className={`${buttonPrimary} mt-5`}>
        Créer mon compte
      </Link>
    </section>
  );
}

function BoosterSummary({
  cards,
  signedIn,
  onAgain,
}: {
  cards: PlayerCardData[];
  signedIn: boolean;
  onAgain: () => void;
}) {
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
      <p className="mt-3 text-xs text-fog">
        {signedIn ? "Cartes ajoutées à ta collection." : "Cartes gardées dans ce navigateur jusqu'à ton inscription."}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" className={buttonPrimary} onClick={onAgain}>
          Ouvrir un autre booster
        </button>
        {signedIn && (
          <Link href="/collection" className={buttonSecondary}>
            Ma collection
          </Link>
        )}
      </div>
    </section>
  );
}
