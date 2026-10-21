import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`font-display inline-flex items-center gap-2 text-2xl font-extrabold italic tracking-tight ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-md bg-volt text-base not-italic text-pitch-950"
      >
        G
      </span>
      {siteConfig.name}
    </span>
  );
}
