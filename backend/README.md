# IT-equipment — Backend

API REST de la boutique, en **Node.js / Express 5**, avec une base **SQLite** (module `node:sqlite` intégré à Node, aucune compilation native), authentification **JWT** et validation **zod**.

## Démarrage

```bash
cd backend          # Node.js 22.13 ou plus récent
npm install
cp .env.example .env      # puis renseigner JWT_SECRET et ADMIN_PASSWORD
npm run dev               # http://localhost:3000
```

Au premier démarrage, la base est créée dans `data/`, remplie avec le catalogue de départ (10 produits, repris de `frontend/src/data/produits.ts`) et le compte propriétaire est créé à partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur avec rechargement automatique |
| `npm start` | Serveur en production |
| `npm test` | Tests d'intégration (base en mémoire) |
| `npm run seed:demo` | Ajoute 45 commandes de démonstration pour alimenter le dashboard |

Générer un secret JWT : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Architecture

```
backend/src/
├── server.js          point d'entrée (config, base, écoute, arrêt propre)
├── app.js             application Express (middlewares, routes)
├── bootstrap.js       initialisation : catalogue de départ + compte propriétaire
├── config/            variables d'environnement validées
├── db/                schéma SQLite, seed de démonstration
├── domain/            règles métier (stock faible, filtres, statuts, livraison)
├── repositories/      accès aux données (produits, commandes, utilisateurs)
├── routes/            auth, produits, commandes, dashboard
├── middleware/        auth JWT, validation, erreurs
├── schemas.js         schémas zod (messages en français)
└── data/produits.js   catalogue initial
```

`domain/catalogue.js` reprend à l'identique les règles du frontend (`statutStock`, `filtrerProduits`, seuil de stock faible à 8, id produit = référence en minuscules).

## Endpoints

Les erreurs ont toutes la forme `{ "error": { "code", "message", "details"? } }`.
🔒 = en-tête `Authorization: Bearer <token>` requis.

### Auth
| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | `{ email, motDePasse, resterConnecte? }` → `{ token, expiresIn, utilisateur }` (8 h, ou 30 j avec `resterConnecte`) |
| GET | `/api/auth/me` 🔒 | Utilisateur connecté |

### Produits
| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/api/produits` | Catalogue. Filtres : `q`, `cat` (`Claviers,Stockage` ou répété), `prix` (`0-75` \| `75-150` \| `150-`), `stockSeul=true`, `tri` (`pertinence` \| `prix-asc` \| `prix-desc`) |
| GET | `/api/produits/categories` | Liste des catégories |
| GET | `/api/produits/:id` | Détail |
| POST | `/api/produits` 🔒 | Création. Obligatoires : `nom`, `ref`, `cat`, `prix`, `stock`. Défauts : `spec`, `illu`, `desc`, `fiche` |
| PUT | `/api/produits/:id` 🔒 | Remplacement des champs du formulaire ; `spec`, `illu`, `fiche`, `prixBarre` sont conservés s'ils sont absents |
| PATCH | `/api/produits/:id` 🔒 | Modification partielle |
| DELETE | `/api/produits/:id` 🔒 | Suppression (204) |

Les réponses ont exactement la forme du type `Produit` du frontend. `ref` : lettres, chiffres, `.`, `-`, `_` (elle devient l'`id` en minuscules) ; `409` si elle existe déjà.

### Commandes
| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/api/commandes` | Passage de commande (public). Corps : `email, tel?, nom, adresse, cp, ville, paiement (carte\|virement\|paypal), lignes: [{ produitId, quantite }]` |
| GET | `/api/commandes` 🔒 | Liste paginée : `statut`, `page`, `limit` |
| GET | `/api/commandes/:reference` 🔒 | Détail avec lignes |
| PATCH | `/api/commandes/:reference/statut` 🔒 | `{ statut: "Payée" \| "En préparation" \| "Expédiée" }` |

À la création, dans une seule transaction : les **prix sont relus en base** (jamais pris du client), le **stock est vérifié puis décrémenté**, la référence est séquentielle (`CMD-AAAA-0001`…). Stock insuffisant ou produit inconnu → `409 STOCK_INDISPONIBLE` avec le détail par ligne, sans rien modifier. Les lignes conservent un instantané (réf., nom, prix) de chaque produit.

### Dashboard
`GET /api/dashboard` 🔒 → `tuiles` (CA du mois, commandes, panier moyen avec variation vs mois précédent, nombre de produits en stock faible), `ventes7Jours`, `alertesStock`, `commandesRecentes` (5).

`GET /api/health` → `{ "status": "ok" }`

## Sécurité

- Mots de passe hachés (bcrypt), JWT HS256 signé avec `JWT_SECRET` (aucun secret par défaut : le démarrage échoue s'il manque).
- `helmet`, CORS restreint à `CORS_ORIGINS`, corps JSON limité à 100 ko.
- Limitation de débit sur la connexion (10 / 15 min) et la commande (30 / 15 min). Derrière un reverse proxy, ajouter `app.set("trust proxy", 1)` pour que la limite s'applique par client.

## Limites connues

- **Le paiement est simulé** : aucune passerelle n'est branchée, une commande est créée directement au statut « Payée » (comme le faisait la maquette).
- Pas de suivi de commande côté client, pas d'envoi d'e-mail de confirmation.
- Un seul compte propriétaire, pas de réinitialisation de mot de passe.
- Le frontend consomme cette API (proxy Vite `/api` en développement, voir `frontend/README.md`).
