import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export type SessionUser = {
  id: string;
  name: string;
};

/**
 * Utilisateur connecté, ou null. Lit les cookies de la requête :
 * à appeler uniquement dans un composant placé sous <Suspense>, ou dans une action serveur.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email } = session.user;
  // Un compte créé par e-mail n'a pas encore de pseudo : on affiche le début de l'adresse.
  return { id, name: name || email.split("@")[0] };
});
