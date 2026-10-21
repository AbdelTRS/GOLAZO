import "server-only";
import { parseEnv } from "@neon/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import neonConfig from "../../neon";
import * as schema from "./schema";

/*
 * Client PostgreSQL Neon (driver postgres.js, runtime Node.js).
 * - URL poolée (DATABASE_URL, pooler PgBouncer) pour le trafic de l'application ;
 *   les migrations utilisent la connexion directe (voir drizzle.config.ts).
 * - `prepare: false` : le pooler en mode transaction ne gère pas les requêtes préparées.
 * parseEnv valide la variable au démarrage avec un message clair si elle manque.
 */

const { postgres: env } = parseEnv(neonConfig, ["DATABASE_URL"]);

const globalForDb = globalThis as unknown as {
  pg?: { url: string; client: ReturnType<typeof postgres> };
};

// En développement, on réutilise le client entre les rechargements à chaud,
// tant que l'URL ne change pas (sinon un .env.local modifié serait ignoré).
const client =
  globalForDb.pg?.url === env.databaseUrl
    ? globalForDb.pg.client
    : postgres(env.databaseUrl, { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.pg = { url: env.databaseUrl, client };

export const db = drizzle(client, { schema });
