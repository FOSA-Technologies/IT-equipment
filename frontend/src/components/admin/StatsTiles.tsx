import { statutStock } from "@/domain/catalogue";
import { useCatalogueStore } from "@/store/catalogueStore";

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

const TUILES_FIXES: Tuile[] = [
  { etiquette: "CA du mois", valeur: "12 480 €", delta: "+8,2 % vs août", sens: "hausse" },
  { etiquette: "Commandes", valeur: "96", delta: "+12 vs août", sens: "hausse" },
  { etiquette: "Panier moyen", valeur: "130,10 €", delta: "−2,1 % vs août", sens: "baisse" },
];

/** Indicateurs clés du dashboard. Le stock faible est calculé sur le vrai catalogue. */
export function StatsTiles() {
  const produits = useCatalogueStore((s) => s.produits);
  const nbAlertes = produits.filter(
    (p) => statutStock(p).niveau !== "disponible",
  ).length;

  const tuiles: Tuile[] = [
    ...TUILES_FIXES,
    {
      etiquette: "Stock faible",
      valeur: String(nbAlertes),
      delta: "à réapprovisionner",
      sens: "neutre",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
      {tuiles.map((tuile) => (
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
