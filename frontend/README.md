# IT-equipment — frontend

Frontend e-commerce de matériel informatique, porté depuis la maquette `../maquette.html`.

## Stack

- React 18 + TypeScript
- Vite 6
- TailwindCSS 4 (tokens dans `src/index.css`, bloc `@theme`)
- Zustand 5 (état global ; le panier et la session sont persistés en localStorage)
- react-router-dom 6

## Scripts

```bash
npm install     # installer les dépendances
npm run dev     # serveur de développement (http://localhost:5173)
npm run build   # vérification TypeScript + build de production
npm run preview # servir le build de production
```

## Connexion au backend

Le frontend consomme l'API du dossier `../backend` (voir son README).

```bash
# terminal 1
cd backend && npm run dev        # http://localhost:3000
# terminal 2
cd frontend && npm run dev       # http://localhost:5173
```

En développement, Vite relaie `/api` vers `http://localhost:3000` (voir `vite.config.ts`) : aucun réglage CORS n'est nécessaire. En production, définir `VITE_API_URL` (voir `.env.example`) et ajouter l'origine du frontend dans `CORS_ORIGINS` côté backend.

Ce qui passe par l'API : catalogue, gestion des produits (propriétaire), passage de commande (prix et stock validés côté serveur), vente au comptoir, suivi des commandes, clients, dashboard, connexion. Le panier reste local au navigateur. Compte propriétaire : celui défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `backend/.env`.

## Architecture

- `domain/` — logique métier pure (filtres, totaux, formatage) : aucun import React. C'est la couche à tester et à réutiliser.
- `store/` — état global Zustand : catalogue (copie du backend, CRUD via l'API), panier, session (JWT), notifications. Zéro logique métier.
- `lib/` — accès au backend : `http.ts` (fetch, jeton, erreurs) et `api.ts` (endpoints typés).
- `components/` — UI réutilisable (ui, layout, produit, panier, commande, admin).
- `pages/` — écrans de routes, composés à partir des composants.
- `types/` — types partagés du domaine.

### Routes

| Route              | Écran                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `/`                | Accueil client                                                                             |
| `/boutique`        | Catalogue (recherche, filtres, tri)                                                        |
| `/produit/:id`     | Fiche produit                                                                              |
| `/panier`          | Panier                                                                                     |
| `/commande`        | Commande et confirmation                                                                   |
| `/connexion`       | Connexion propriétaire                                                                     |
| `/dashboard`       | Tableau de bord (protégé)                                                                  |
| `/admin/vente`     | Caisse : recherche, catégories, panier, encaissement en magasin (protégé)                  |
| `/admin`           | Gestion des produits (protégé)                                                             |
| `/admin/commandes` | Suivi des commandes : liste, filtre par statut, détail, changement de statut (protégé)     |
| `/admin/clients`   | Clients agrégés par e-mail : recherche, fiche détaillée, historique de commandes (protégé) |
