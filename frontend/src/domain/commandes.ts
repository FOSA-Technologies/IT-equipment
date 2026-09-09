/** Référence de commande fictive, au format CMD-AAAA-NNNN. */
export function creerReferenceCommande(): string {
  const annee = new Date().getFullYear();
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${annee}-${numero}`;
}

/** Date de livraison estimée : commande du jour, livrée sous 48 h ouvrées. */
export function dateLivraisonEstimee(): string {
  const jour = new Date();
  jour.setDate(jour.getDate() + 2);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(jour);
}
