"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { importGuestBoostersAction } from "@/features/boosters/actions";
import { clearGuestTokens, readGuestTokens } from "@/features/boosters/guest-storage";

/**
 * Monté seulement quand le joueur est connecté : envoie au serveur les boosters
 * ouverts en invité, puis vide le stockage du navigateur.
 */
export function GuestImport() {
  const router = useRouter();
  const started = useRef(false);
  const [imported, setImported] = useState(0);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const tokens = readGuestTokens();
    if (tokens.length === 0) return;

    importGuestBoostersAction(tokens).then((result) => {
      if (!result.ok) return; // On réessaiera au prochain chargement.
      clearGuestTokens();
      if (result.imported > 0) {
        setImported(result.imported);
        router.refresh();
      }
    });
  }, [router]);

  if (imported === 0) return null;

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm rounded-xl border border-volt/40 bg-pitch-800 px-4 py-3 text-center text-sm text-chalk shadow-volt sm:left-auto"
    >
      {imported} booster{imported > 1 ? "s" : ""} d&apos;essai ajouté{imported > 1 ? "s" : ""} à ta
      collection.
      <button
        type="button"
        onClick={() => setImported(0)}
        className="ml-3 text-volt hover:underline"
      >
        OK
      </button>
    </div>
  );
}
