"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/features/auth/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="rounded-lg border border-line px-3 py-1.5 text-sm text-mist transition-colors hover:border-line-strong hover:text-chalk disabled:opacity-60"
    >
      Déconnexion
    </button>
  );
}
