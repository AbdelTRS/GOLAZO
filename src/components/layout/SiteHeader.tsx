import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/Logo";
import { UserMenu } from "./UserMenu";

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
      <nav className="flex items-center gap-3 text-base sm:gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-display text-base font-bold uppercase italic tracking-wide text-mist sm:text-lg transition-colors hover:text-volt"
          >
            {link.label}
          </Link>
        ))}
        {/* La session est lue à la requête : le reste de l'en-tête reste statique. */}
        <Suspense fallback={<span className="h-9 w-24" aria-hidden="true" />}>
          <UserMenu />
        </Suspense>
      </nav>
    </header>
  );
}
