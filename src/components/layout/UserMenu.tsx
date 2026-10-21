import Link from "next/link";
import { GuestImport } from "@/components/auth/GuestImport";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getSessionUser } from "@/features/auth/session";

export async function UserMenu() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="rounded-lg border border-volt/40 px-3 py-1.5 text-sm font-semibold text-volt transition-colors hover:bg-volt hover:text-pitch-950"
      >
        Se connecter
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/collection"
        className="font-display text-base font-bold uppercase italic tracking-wide text-mist sm:text-lg transition-colors hover:text-volt"
      >
        Collection
      </Link>
      <span className="hidden max-w-32 truncate text-sm text-chalk md:inline" title={user.name}>
        {user.name}
      </span>
      <SignOutButton />
      <GuestImport />
    </>
  );
}
