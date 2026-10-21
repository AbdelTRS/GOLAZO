type CardBackProps = {
  className?: string;
};

/** Dos de carte décoratif (aucune donnée de joueur). */
export function CardBack({ className = "" }: CardBackProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[5/7] w-full overflow-hidden rounded-2xl border border-line-strong bg-gradient-to-br from-pitch-700 via-pitch-800 to-pitch-950 shadow-volt ${className}`}
    >
      <div className="absolute inset-3 rounded-xl border border-volt/30" />
      <div className="bg-pitch-lines absolute inset-0 opacity-60" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-7xl font-extrabold italic text-volt drop-shadow-[0_0_18px_rgb(57_255_136/0.6)]">
          G
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-5 text-center font-display text-sm font-bold uppercase tracking-[0.4em] text-mist">
        Golazo
      </div>
    </div>
  );
}
