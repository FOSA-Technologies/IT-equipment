/** Utilitaires de dates dans le fuseau horaire de la boutique. */

/** Date « AAAA-MM-JJ » de `date` dans le fuseau `timezone`. */
export function jourLocal(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Mois « AAAA-MM » de `date` dans le fuseau `timezone`. */
export function moisLocal(date, timezone) {
  return jourLocal(date, timezone).slice(0, 7);
}

/** Mois précédent d'un mois « AAAA-MM ». */
export function moisPrecedent(mois) {
  const [annee, m] = mois.split("-").map(Number);
  const d = new Date(Date.UTC(annee, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Décale un jour « AAAA-MM-JJ » de `delta` jours (arithmétique calendaire pure). */
export function decalerJour(jour, delta) {
  const [a, m, j] = jour.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j + delta)).toISOString().slice(0, 10);
}

export const arrondir = (valeur) => Math.round((valeur + Number.EPSILON) * 100) / 100;
