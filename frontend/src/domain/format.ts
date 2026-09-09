const FORMAT_PRIX = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatPrix(valeur: number): string {
  return FORMAT_PRIX.format(valeur);
}
