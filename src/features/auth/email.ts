import "server-only";

/**
 * Envoie le lien magique de connexion.
 * Avec RESEND_API_KEY : envoi réel via l'API Resend.
 * Sans clé en développement : le lien est affiché dans le terminal.
 */
export async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY manquant : impossible d'envoyer le lien de connexion.");
    }
    console.info(`\n[GOLAZO] Lien de connexion pour ${email} :\n${url}\n`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "GOLAZO <onboarding@resend.dev>",
      to: email,
      subject: "Ton lien de connexion GOLAZO",
      html: `<p>Clique sur ce lien pour te connecter à GOLAZO :</p><p><a href="${url}">Se connecter</a></p><p>Il expire dans 5 minutes. Si tu n'as rien demandé, ignore ce message.</p>`,
      text: `Connecte-toi à GOLAZO : ${url}\nCe lien expire dans 5 minutes.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Échec de l'envoi du lien de connexion (${response.status}).`);
  }
}
