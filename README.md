# GOLAZO

Jeu web de collection de cartes de football (Next.js App Router, TypeScript, Tailwind CSS v4).

## Prérequis

- Node.js 20.9+ (testé avec 22.13)

## Commandes

```bash
npm install        # installer les dépendances
npm run dev        # serveur de développement → http://localhost:3000
npm run typecheck  # génération des types Next + vérification TypeScript
npm run lint       # ESLint
npm test           # tests unitaires (Vitest)
npm run build      # build de production
npm run start      # lancer le build de production
```

## Base de données (Neon)

Le projet est lié à Neon (`neon.ts`, `.neon`). Variables d'environnement dans `.env.local` (voir `.env.example`).

```bash
neon env pull      # récupère DATABASE_URL / DATABASE_URL_UNPOOLED de la branche liée
npm run db:migrate # applique les migrations (connexion directe, non poolée)
npm run db:generate # génère une migration après modification de src/db/schema.ts
```

## Structure

```
src/
  app/          routes (App Router), layout racine, styles globaux
  components/   composants React réutilisables (brand/, cards/, boosters/…)
  config/       configuration statique de l'application (nom, textes)
  features/     logique métier sans UI (cartes, catalogue, tirage des boosters)
  lib/          utilitaires génériques (aléatoire…)
public/         fichiers statiques
```

Les couleurs et typographies sont définies comme tokens dans `src/app/globals.css` (`@theme`).
