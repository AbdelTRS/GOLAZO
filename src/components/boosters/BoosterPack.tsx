"use client";

import { useRef, type AnimationEvent, type PointerEvent } from "react";
import styles from "./BoosterPack.module.css";

type BoosterPackProps = {
  name: string;
  cardCount: number;
  tearing: boolean;
  onOpen: () => void;
  /** Appelé quand l'animation de déchirure est terminée. */
  onTorn: () => void;
};

/** Distance horizontale (px) à glisser pour déchirer le booster. */
const SWIPE_DISTANCE = 60;

export function BoosterPack({ name, cardCount, tearing, onOpen, onTorn }: BoosterPackProps) {
  const swipeStartX = useRef<number | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    swipeStartX.current = event.clientX;
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (swipeStartX.current === null) return;
    if (Math.abs(event.clientX - swipeStartX.current) > SWIPE_DISTANCE) {
      swipeStartX.current = null;
      onOpen();
    }
  }

  function handleBodyAnimationEnd(event: AnimationEvent<HTMLSpanElement>) {
    // Les animations des éléments enfants (reflet) remontent aussi : on ne garde que celle du corps.
    if (tearing && event.target === event.currentTarget) onTorn();
  }

  return (
    <button
      type="button"
      className={styles.pack}
      data-tearing={tearing}
      disabled={tearing}
      onClick={onOpen}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => (swipeStartX.current = null)}
      onPointerLeave={() => (swipeStartX.current = null)}
      aria-label={`Ouvrir le ${name.toLowerCase()}`}
    >
      <span className={styles.strip} />
      <span className={styles.body} onAnimationEnd={handleBodyAnimationEnd}>
        <span className={styles.foil} />
        <span className={styles.emblem}>
          <span>G</span>
        </span>
        <span className={styles.title}>Golazo</span>
        <span className={styles.subtitle}>{cardCount} cartes</span>
      </span>
    </button>
  );
}
