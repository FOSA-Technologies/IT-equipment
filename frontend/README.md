# IT-equipment — frontend

Frontend e-commerce de matériel informatique, porté depuis la maquette `../maquette.html`.

## Stack

- React 18 + TypeScript
- Vite 6
- TailwindCSS 4 (tokens dans `src/index.css`, bloc `@theme`)
- Zustand 5 (état global, persisté en localStorage)
- react-router-dom 6

## Scripts

```bash
npm install     # installer les dépendances
npm run dev     # serveur de développement (http://localhost:5173)
npm run build   # vérification TypeScript + build de production
npm run preview # servir le build de production
```

## Architecture

- `domain/` — logique métier pure (filtres, totaux, formatage) : aucun import React. C'est la couche à tester et à réutiliser.
- `store/` — état global Zustand : catalogue (CRUD produits), panier, session, notifications. Zéro logique métier, uniquement des transitions d'état.
- `data/` — catalogue initial fictif. Pour brancher une vraie API, remplacer le seed de `catalogueStore` par des appels réseau : les composants ne changent pas.
- `components/` — UI réutilisable (ui, layout, produit, panier, commande, admin).
- `pages/` — écrans de routes, composés à partir des composants.
- `types/` — types partagés du domaine.

### Routes

| Route | Écran |
|---|---|
| `/` | Accueil client |
| `/boutique` | Catalogue (recherche, filtres, tri) |
| `/produit/:id` | Fiche produit |
| `/panier` | Panier |
| `/commande` | Commande et confirmation |
| `/connexion` | Connexion propriétaire |
| `/dashboard` | Tableau de bord (protégé) |
| `/admin` | Gestion des produits (protégé) |
