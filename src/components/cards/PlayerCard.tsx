import { RARITY_BY_ID, STAT_LABELS } from "@/features/cards/rarities";
import type { PlayerCard as PlayerCardData, PlayerStats } from "@/features/cards/types";
import styles from "./PlayerCard.module.css";

type PlayerCardProps = {
  card: PlayerCardData;
  className?: string;
};

const STAT_ORDER: (keyof PlayerStats)[] = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physical",
];

export function PlayerCard({ card, className = "" }: PlayerCardProps) {
  const rarity = RARITY_BY_ID[card.rarity];

  return (
    <article
      className={`${styles.root} ${className}`}
      data-rarity={rarity.id}
      data-holo={rarity.holo}
      aria-label={`${card.name}, ${card.position}, note ${card.rating}, ${rarity.label}`}
    >
      <div className={styles.card}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div>
              <div className={styles.rating}>{card.rating}</div>
              <div className={styles.position}>{card.position}</div>
              <div className={styles.nation}>{card.nation}</div>
            </div>
            <div className={styles.badge} title={rarity.label}>
              <span>{rarity.short}</span>
            </div>
          </header>

          <div className={styles.portrait}>
            <PlayerSilhouette className={styles.silhouette} />
          </div>

          <h3 className={styles.name}>{card.name}</h3>

          <dl className={styles.stats}>
            {STAT_ORDER.map((stat) => (
              <div key={stat} className={styles.stat}>
                <dt className={styles.statLabel}>{STAT_LABELS[stat]}</dt>
                <dd className={styles.statValue}>{card.stats[stat]}</dd>
              </div>
            ))}
          </dl>

          <footer className={styles.footer}>
            <span>{card.club}</span>
            <span>#{String(card.number).padStart(4, "0")}</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

/** Silhouette générique : aucune photo de joueur. */
function PlayerSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="38" r="22" fill="currentColor" />
      <path
        d="M14 120c0-28 18-46 46-46s46 18 46 46z"
        fill="currentColor"
      />
    </svg>
  );
}
