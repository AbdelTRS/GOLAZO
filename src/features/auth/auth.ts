import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendMagicLinkEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: ({ email, url }) => sendMagicLinkEmail(email, url),
    }),
    // Doit rester le dernier plugin : écrit les cookies de session depuis les actions serveur.
    nextCookies(),
  ],
});
