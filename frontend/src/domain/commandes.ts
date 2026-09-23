import type { MoyenPaiement } from "@/types";

export const LIBELLES_PAIEMENT: Record<MoyenPaiement, string> = {
  carte: "Carte bancaire",
  virement: "Virement",
  paypal: "PayPal",
  especes: "Espèces",
};

/**
 * Taux de TVA (en pourcentage) utilisé par `decomposerTva`, mis à jour au
 * chargement des paramètres de la boutique (20 % par défaut avant ce chargement).
 */
let tauxTvaCourant = 20;

export function definirTauxTva(pourcentage: number): void {
  tauxTvaCourant = pourcentage;
}

export function tauxTvaActuel(): number {
  return tauxTvaCourant;
}

/** Décompose un montant TTC en base HT et montant de TVA, au taux courant (ou fourni, en %). */
export function decomposerTva(
  ttc: number,
  pourcentage: number = tauxTvaCourant,
): { ht: number; tva: number } {
  const taux = pourcentage / 100;
  const ht = ttc / (1 + taux);
  return { ht, tva: ttc - ht };
}

const FORMAT_LIVRAISON = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Formate la date de livraison estimée renvoyée par l'API (AAAA-MM-JJ). */
export function formaterDateLivraison(iso: string): string {
  return FORMAT_LIVRAISON.format(new Date(`${iso}T12:00:00`));
}
