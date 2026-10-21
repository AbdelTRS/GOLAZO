import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const navLinks = [
  { href: "/booster", label: "Booster" },
  { href: "/cartes", label: "Cartes" },
];

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <Link href="/" aria-label="Accueil GOLAZO">
        <Logo />
      </Link>
      <nav className="flex items-center gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-display text-lg font-bold uppercase italic tracking-wide text-mist transition-colors hover:text-volt"
          >
            {link.label}
          </Link>
        ))}
        <span className="hidden rounded-full border border-line px-3 py-1 text-xs font-medium uppercase tracking-widest text-mist sm:inline">
          En développement
        </span>
      </nav>
    </header>
  );
}
