import type { DeviseCode } from "@/types";

interface DeviseInfo {
  libelle: string;
  symbole: string;
}

/** Devises proposées dans les paramètres de la boutique (miroir de backend/src/domain/parametres.js). */
export const DEVISES: Record<DeviseCode, DeviseInfo> = {
  EUR: { libelle: "Euro (€)", symbole: "€" },
  MAD: { libelle: "Dirham marocain (DH)", symbole: "DH" },
  USD: { libelle: "Dollar américain ($)", symbole: "$" },
};

const FORMAT_NOMBRE = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

let deviseCourante: DeviseCode = "EUR";

/** Change la devise utilisée par défaut par `formatPrix` (appelé au chargement des paramètres de la boutique). */
export function definirDevise(devise: DeviseCode): void {
  deviseCourante = devise;
}

export function deviseActuelle(): DeviseCode {
  return deviseCourante;
}

export function formatPrix(
  valeur: number,
  devise: DeviseCode = deviseCourante,
): string {
  return `${FORMAT_NOMBRE.format(valeur)} ${DEVISES[devise].symbole}`;
}
