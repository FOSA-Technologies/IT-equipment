const FORMAT_LIVRAISON = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Formate la date de livraison estimée renvoyée par l'API (AAAA-MM-JJ). */
export function formaterDateLivraison(iso: string): string {
  return FORMAT_LIVRAISON.format(new Date(`${iso}T12:00:00`));
}
