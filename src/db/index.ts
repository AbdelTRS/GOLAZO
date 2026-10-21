import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/*
 * Client PostgreSQL (Neon). La connexion n'est ouverte qu'à la première requête :
 * le build fonctionne donc même sans DATABASE_URL.
 * `prepare: false` est requis par le pooler de connexions de Neon.
 */

const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> };

// En développement, on réutilise le client entre les rechargements à chaud.
const client = globalForDb.pgClient ?? postgres(process.env.DATABASE_URL ?? "", { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
