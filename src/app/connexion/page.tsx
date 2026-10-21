import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connecte-toi à GOLAZO avec Discord ou ton e-mail pour sauvegarder ta collection.",
};

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-volt">Ton compte</p>
        <h1 className="font-display mt-2 text-5xl font-extrabold uppercase italic">Connexion</h1>
        <p className="mt-3 mb-8 text-mist">
          Sauvegarde ta collection et continue à ouvrir des boosters. Les cartes de tes boosters
          d&apos;essai seront ajoutées à ton compte.
        </p>
        <SignInForm />
      </main>
    </div>
  );
}
