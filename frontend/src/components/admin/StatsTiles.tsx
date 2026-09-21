import { formatPrix } from "@/domain/format";
import type { Dashboard } from "@/types";

const SENS_COULEUR = {
  hausse: "text-vert",
  baisse: "text-rouge",
  neutre: "text-ambre",
} as const;

type Sens = keyof typeof SENS_COULEUR;

interface Tuile {
  etiquette: string;
  valeur: string;
  delta: string;
  sens: Sens;
}

const FORMAT_MOIS = new Intl.DateTimeFormat("fr-FR", { month: "long" });
const FORMAT_POURCENT = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const signe = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "");
const sens = (n: number | null): Sens =>
  n === null || n === 0 ? "neutre" : n > 0 ? "hausse" : "baisse";

function deltaPourcent(variation: number | null, mois: string): string {
  if (variation === null) return `pas de données en ${mois}`;
  return `${signe(variation)}${FORMAT_POURCENT.format(Math.abs(variation))} % vs ${mois}`;
}

interface StatsTilesProps {
  tuiles: Dashboard["tuiles"];
  /** Date-heure ISO du calcul : sert à nommer le mois de comparaison. */
  date: string;
}

/** Indicateurs clés du dashboard, calculés par le backend. */
export function StatsTiles({ tuiles, date }: StatsTilesProps) {
  const maintenant = new Date(date);
  const moisPrecedent = FORMAT_MOIS.format(
    new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1),
  );

  const liste: Tuile[] = [
    {
      etiquette: "CA du mois",
      valeur: formatPrix(tuiles.caMois.valeur),
      delta: deltaPourcent(tuiles.caMois.variationPct, moisPrecedent),
      sens: sens(tuiles.caMois.variationPct),
    },
    {
      etiquette: "Commandes",
      valeur: String(tuiles.commandes.valeur),
      delta: `${signe(tuiles.commandes.variation)}${Math.abs(tuiles.commandes.variation)} vs ${moisPrecedent}`,
      sens: sens(tuiles.commandes.variation),
    },
    {
      etiquette: "Panier moyen",
      valeur: formatPrix(tuiles.panierMoyen.valeur),
      delta: deltaPourcent(tuiles.panierMoyen.variationPct, moisPrecedent),
      sens: sens(tuiles.panierMoyen.variationPct),
    },
    {
      etiquette: "Stock faible",
      valeur: String(tuiles.stockFaible.valeur),
      delta: "à réapprovisionner",
      sens: "neutre",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
      {liste.map((tuile) => (
        <div
          key={tuile.etiquette}
          className="rounded-[10px] border border-ligne bg-white p-[18px]"
        >
          <p className="text-[13px] text-encre-2">{tuile.etiquette}</p>
          <p className="my-1.5 font-mono text-2xl font-semibold">
            {tuile.valeur}
          </p>
          <span className={`font-mono text-xs ${SENS_COULEUR[tuile.sens]}`}>
            {tuile.delta}
          </span>
        </div>
      ))}
    </div>
  );
}
