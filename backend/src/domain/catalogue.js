/** Règles métier du catalogue (miroir de frontend/src/domain/catalogue.ts). */

export const CATEGORIES = [
  "Claviers",
  "Stockage",
  "Mémoire",
  "Écrans",
  "Périphériques",
  "Composants",
];

export const ILLUSTRATIONS = [
  "ram",
  "ssd",
  "ssd-sata",
  "hdd",
  "clavier",
  "souris",
  "ecran",
  "alim",
  "cm",
];

export const PLAGES_PRIX = ["0-75", "75-150", "150-"];
export const TRIS = ["pertinence", "prix-asc", "prix-desc"];

/** Seuil sous lequel un produit est considéré en stock faible. */
export const SEUIL_STOCK_FAIBLE = 8;

export function statutStock(produit) {
  if (produit.stock === 0) return { niveau: "rupture", libelle: "Rupture" };
  if (produit.stock <= SEUIL_STOCK_FAIBLE) {
    return { niveau: "faible", libelle: "Stock faible" };
  }
  return { niveau: "disponible", libelle: "En stock" };
}

const FILTRES_PRIX = {
  "0-75": (p) => p.prix < 75,
  "75-150": (p) => p.prix >= 75 && p.prix <= 150,
  "150-": (p) => p.prix > 150,
};

export function trierProduits(produits, tri) {
  if (tri === "prix-asc") return [...produits].sort((a, b) => a.prix - b.prix);
  if (tri === "prix-desc") return [...produits].sort((a, b) => b.prix - a.prix);
  return produits;
}

export function filtrerProduits(produits, filtres) {
  let liste = produits;

  if (filtres.q) {
    const q = filtres.q.toLowerCase();
    liste = liste.filter((p) =>
      `${p.nom} ${p.ref} ${p.spec} ${p.cat}`.toLowerCase().includes(q),
    );
  }
  if (filtres.categories?.length > 0) {
    liste = liste.filter((p) => filtres.categories.includes(p.cat));
  }
  if (filtres.prix) liste = liste.filter(FILTRES_PRIX[filtres.prix]);
  if (filtres.stockSeul) liste = liste.filter((p) => p.stock > 0);

  return trierProduits(liste, filtres.tri);
}

/** Identifiant interne d'un produit, dérivé de sa référence. */
export const idDepuisReference = (ref) => ref.toLowerCase();
