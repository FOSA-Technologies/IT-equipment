import type { Filtres, Produit, StatutStock } from "@/types";

/** Seuil sous lequel un produit est considéré en stock faible. */
export const SEUIL_STOCK_FAIBLE = 8;

export function statutStock(produit: Produit): StatutStock {
  if (produit.stock === 0) return { niveau: "rupture", libelle: "Rupture" };
  if (produit.stock <= SEUIL_STOCK_FAIBLE) {
    return { niveau: "faible", libelle: "Stock faible" };
  }
  return { niveau: "disponible", libelle: "En stock" };
}

const PLAGES_PRIX: Record<
  Exclude<Filtres["prix"], "">,
  (produit: Produit) => boolean
> = {
  "0-75": (p) => p.prix < 75,
  "75-150": (p) => p.prix >= 75 && p.prix <= 150,
  "150-": (p) => p.prix > 150,
};

export function filtrerProduits(
  produits: Produit[],
  filtres: Filtres,
): Produit[] {
  let liste = produits;

  if (filtres.q) {
    const q = filtres.q.toLowerCase();
    liste = liste.filter((p) =>
      `${p.nom} ${p.ref} ${p.spec} ${p.cat}`.toLowerCase().includes(q),
    );
  }
  if (filtres.categories.length > 0) {
    liste = liste.filter((p) => filtres.categories.includes(p.cat));
  }
  if (filtres.prix) {
    liste = liste.filter(PLAGES_PRIX[filtres.prix]);
  }
  if (filtres.stockSeul) {
    liste = liste.filter((p) => p.stock > 0);
  }

  return trierProduits(liste, filtres.tri);
}

export function trierProduits(
  produits: Produit[],
  tri: Filtres["tri"],
): Produit[] {
  if (tri === "prix-asc") {
    return [...produits].sort((a, b) => a.prix - b.prix);
  }
  if (tri === "prix-desc") {
    return [...produits].sort((a, b) => b.prix - a.prix);
  }
  return produits;
}

/** Identifiant interne d'un produit, dérivé de sa référence. */
export function idDepuisReference(ref: string): string {
  return ref.toLowerCase();
}
