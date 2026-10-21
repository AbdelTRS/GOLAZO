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
npm run build      # build de production
npm run start      # lancer le build de production
```

## Structure

```
src/
  app/          routes (App Router), layout racine, styles globaux
  components/   composants React réutilisables (brand/, cards/…)
  config/       configuration statique de l'application (nom, textes)
public/         fichiers statiques
```

Les couleurs et typographies sont définies comme tokens dans `src/app/globals.css` (`@theme`).
