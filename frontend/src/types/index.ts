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
