export const STATUTS_COMMANDE = ["Payée", "En préparation", "Expédiée"];
export const MOYENS_PAIEMENT = ["carte", "virement", "paypal"];

/** Statut initial : le paiement est simulé, aucune passerelle n'est branchée. */
export const STATUT_INITIAL = "Payée";

/** Livraison estimée : 2 jours ouvrés après la commande (date ISO AAAA-MM-JJ). */
export function dateLivraisonEstimee(depuis = new Date()) {
  const jour = new Date(
    Date.UTC(depuis.getUTCFullYear(), depuis.getUTCMonth(), depuis.getUTCDate()),
  );
  let restants = 2;
  while (restants > 0) {
    jour.setUTCDate(jour.getUTCDate() + 1);
    const dow = jour.getUTCDay();
    if (dow !== 0 && dow !== 6) restants -= 1;
  }
  return jour.toISOString().slice(0, 10);
}
