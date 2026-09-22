import type { MoyenPaiement } from "@/types";

export const LIBELLES_PAIEMENT: Record<MoyenPaiement, string> = {
  carte: "Carte bancaire",
  virement: "Virement",
  paypal: "PayPal",
  especes: "Espèces",
};

/**
 * Taux de TVA appliqué à l'affichage (les prix du catalogue sont TTC), à
 * l'identique de backend/src/domain/commandes.js#TAUX_TVA.
 */
export const TAUX_TVA = 0.2;

/** Décompose un montant TTC en base HT et montant de TVA. */
export function decomposerTva(ttc: number): { ht: number; tva: number } {
  const ht = ttc / (1 + TAUX_TVA);
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
