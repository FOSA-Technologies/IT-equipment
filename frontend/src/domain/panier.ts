import type { LignePanier, Produit } from "@/types";

export function totalPanier(
  lignes: LignePanier[],
  produits: Produit[],
): number {
  return lignes.reduce((total, ligne) => {
    const produit = produits.find((p) => p.id === ligne.produitId);
    return produit ? total + produit.prix * ligne.quantite : total;
  }, 0);
}

export function nbArticles(lignes: LignePanier[]): number {
  return lignes.reduce((nb, ligne) => nb + ligne.quantite, 0);
}
