import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ---------- Tables gérées par Better Auth (noms et colonnes imposés) ---------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* ---------- Tables du jeu ---------- */

/** Historique des boosters ouverts. L'identifiant d'un booster invité empêche de l'importer deux fois. */
export const boosterOpening = pgTable(
  "booster_opening",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    boosterType: text("booster_type").notNull(),
    source: text("source", { enum: ["account", "guest"] }).notNull(),
    cardIds: text("card_ids").array().notNull(),
    openedAt: timestamp("opened_at").notNull().defaultNow(),
  },
  (table) => [index("booster_opening_user_id_idx").on(table.userId)],
);

/** Collection du joueur : une ligne par carte possédée, avec le nombre d'exemplaires. */
export const collectionCard = pgTable(
  "collection_card",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Identifiant de la carte dans le catalogue (src/features/cards/catalog.ts). */
    cardId: text("card_id").notNull(),
    quantity: integer("quantity").notNull().default(1),
    firstObtainedAt: timestamp("first_obtained_at").notNull().defaultNow(),
    lastObtainedAt: timestamp("last_obtained_at")
      .notNull()
      .default(sql`now()`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cardId] })],
);
