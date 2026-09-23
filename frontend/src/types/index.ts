/** Types du domaine IT-equipment, partagés par domain/, store/ et components/. */

export const CATEGORIES = [
  "Claviers",
  "Stockage",
  "Mémoire",
  "Écrans",
  "Périphériques",
  "Composants",
] as const;

export type Categorie = (typeof CATEGORIES)[number];

export type IllustrationNom =
  | "ram"
  | "ssd"
  | "ssd-sata"
  | "hdd"
  | "clavier"
  | "souris"
  | "ecran"
  | "alim"
  | "cm";

export interface Produit {
  id: string;
  ref: string;
  nom: string;
  cat: Categorie;
  prix: number;
  /** Ancien prix barré, présent uniquement en promotion. */
  prixBarre?: number;
  spec: string;
  stock: number;
  illu: IllustrationNom;
  desc: string;
  fiche: Record<string, string>;
}

/** Données saisies dans le formulaire de gestion des produits. */
export type SaisieProduit = Pick<
  Produit,
  "nom" | "ref" | "cat" | "prix" | "stock" | "desc"
>;

export interface StatutStock {
  niveau: "disponible" | "faible" | "rupture";
  libelle: string;
}

export interface Filtres {
  q: string;
  categories: Categorie[];
  prix: "" | "0-75" | "75-150" | "150-";
  stockSeul: boolean;
  tri: "pertinence" | "prix-asc" | "prix-desc";
}

export interface LignePanier {
  produitId: string;
  quantite: number;
}

/* ------------------------------------------------------------------ */
/* Contrats de l'API backend                                           */
/* ------------------------------------------------------------------ */

export type MoyenPaiement = "carte" | "virement" | "paypal" | "especes";

export const STATUTS_COMMANDE = [
  "Payée",
  "En préparation",
  "Expédiée",
] as const;

export type StatutCommande = (typeof STATUTS_COMMANDE)[number];

/** Coordonnées saisies dans le formulaire de commande. */
export interface SaisieCommande {
  email: string;
  tel: string;
  nom: string;
  adresse: string;
  cp: string;
  ville: string;
  paiement: MoyenPaiement;
}

export interface NouvelleCommande extends SaisieCommande {
  lignes: LignePanier[];
}

/** Réponse à la création d'une commande (POST /commandes). */
export interface CommandeCreee {
  reference: string;
  statut: StatutCommande;
  email: string;
  nbArticles: number;
  total: number;
  /** Date ISO AAAA-MM-JJ. */
  livraisonEstimee: string;
}

export interface ReponseConnexion {
  token: string;
  expiresIn: string;
  utilisateur: CompteUtilisateur;
}

export interface Tuile {
  valeur: number;
  precedent: number;
}

export interface AlerteStock {
  id: string;
  ref: string;
  nom: string;
  cat: Categorie;
  stock: number;
  niveau: "faible" | "rupture";
}

export interface CommandeRecente {
  reference: string;
  client: string;
  /** Date-heure ISO. */
  date: string;
  total: number;
  statut: StatutCommande;
}

export interface Dashboard {
  /** Date-heure ISO du calcul. */
  date: string;
  tuiles: {
    caMois: Tuile & { variationPct: number | null };
    commandes: Tuile & { variation: number };
    panierMoyen: Tuile & { variationPct: number | null };
    stockFaible: { valeur: number };
  };
  ventes7Jours: { date: string; valeur: number }[];
  alertesStock: AlerteStock[];
  commandesRecentes: CommandeRecente[];
}

export interface LigneCommande {
  produitId: string;
  ref: string;
  nom: string;
  prixUnitaire: number;
  quantite: number;
}

/** Commande telle que listée par GET /commandes (propriétaire). */
export interface Commande extends SaisieCommande {
  reference: string;
  statut: StatutCommande;
  nbArticles: number;
  total: number;
  /** Date-heure ISO de création. */
  creeLe: string;
}

/** Commande avec ses lignes (GET /commandes/:reference). */
export interface CommandeDetail extends Commande {
  lignes: LigneCommande[];
}

export interface PageCommandes {
  items: Commande[];
  total: number;
  page: number;
  limit: number;
}

/** Réponse à POST /commandes/vente (encaissement au comptoir). */
export interface VenteCreee {
  reference: string;
  statut: StatutCommande;
  paiement: MoyenPaiement;
  nbArticles: number;
  total: number;
}

export interface Client {
  email: string;
  nom: string;
  tel: string;
  nbCommandes: number;
  totalDepense: number;
  /** Date-heure ISO de la première et de la dernière commande. */
  premiereCommande: string;
  derniereCommande: string;
}

/** Commande listée dans le détail d'un client (mêmes champs que Commande, sans redite email/nom/tel). */
export interface CommandeClient {
  reference: string;
  statut: StatutCommande;
  total: number;
  nbArticles: number;
  creeLe: string;
  adresse: string;
  cp: string;
  ville: string;
  paiement: MoyenPaiement;
}

export interface ClientDetail extends Client {
  commandes: CommandeClient[];
}

export interface PageClients {
  items: Client[];
  total: number;
  page: number;
  limit: number;
}

/* ------------------------------------------------------------------ */
/* Paramètres et compte propriétaire                                   */
/* ------------------------------------------------------------------ */

export type DeviseCode = "EUR" | "MAD" | "USD";

export interface ParametresBoutique {
  nom: string;
  ville: string;
  devise: DeviseCode;
  /** Pourcentage (0-100). */
  tva: number;
}

export interface CompteUtilisateur {
  email: string;
  nom: string;
}

/** Corps de PATCH /auth/me : le nom seul, ou un changement de mot de passe. */
export interface MajCompte {
  nom?: string;
  motDePasseActuel?: string;
  nouveauMotDePasse?: string;
}
