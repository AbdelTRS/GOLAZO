import { parseEnv } from "@neon/env";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import neonConfig from "./neon";

config({ path: ".env.local" });

// Les migrations passent par la connexion directe : le pooler (PgBouncer) ne gère pas
// l'état de session dont drizzle-kit a besoin.
const { postgres } = parseEnv(neonConfig, ["DATABASE_URL_UNPOOLED"]);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: postgres.databaseUrlUnpooled,
  },
});
