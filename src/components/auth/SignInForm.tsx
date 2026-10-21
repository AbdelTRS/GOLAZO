"use client";

import { useState, type FormEvent } from "react";
import { buttonPrimary } from "@/components/ui/buttons";
import { authClient } from "@/features/auth/auth-client";

/** Page affichée après la connexion. */
const CALLBACK_URL = "/collection";

type Status = "idle" | "sending" | "sent" | "error";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [discordPending, setDiscordPending] = useState(false);

  async function signInWithDiscord() {
    setDiscordPending(true);
    const { error } = await authClient.signIn.social({
      provider: "discord",
      callbackURL: CALLBACK_URL,
    });
    // En cas de succès, le navigateur part vers Discord : on ne revient ici qu'en cas d'erreur.
    if (error) {
      setDiscordPending(false);
      setStatus("error");
    }
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const { error } = await authClient.signIn.magicLink({
      email: email.trim(),
      callbackURL: CALLBACK_URL,
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-volt/40 bg-pitch-800/70 p-6 text-center" role="status">
        <p className="font-display text-2xl font-bold uppercase italic text-volt">Vérifie ta boîte mail</p>
        <p className="mt-2 text-sm text-mist">
          Un lien de connexion a été envoyé à <strong className="text-chalk">{email}</strong>. Il
          expire dans 5 minutes.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-volt hover:underline"
        >
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-pitch-800/60 p-6">
      <button
        type="button"
        onClick={signInWithDiscord}
        disabled={discordPending}
        className="font-display flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-6 py-3 text-lg font-bold uppercase italic text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {discordPending ? "Redirection…" : "Continuer avec Discord"}
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-fog">
        <span className="h-px flex-1 bg-line" />
        ou par e-mail
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm font-medium text-mist">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="toi@exemple.fr"
          className="rounded-xl border border-line-strong bg-pitch-950 px-4 py-3 text-chalk placeholder:text-fog focus:border-volt focus:outline-none"
        />
        <button type="submit" disabled={status === "sending"} className={buttonPrimary}>
          {status === "sending" ? "Envoi…" : "Recevoir mon lien"}
        </button>
      </form>

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-sm text-red-400">
          La connexion a échoué. Réessaie dans un instant.
        </p>
      )}

      <p className="mt-6 text-center text-xs text-fog">
        Pas besoin de mot de passe : ton compte est créé à la première connexion.
      </p>
    </div>
  );
}
