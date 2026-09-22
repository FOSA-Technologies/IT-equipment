import type { StatutCommande } from "@/types";

const STYLES: Record<StatutCommande, { pilule: string; point: string }> = {
  Payée: { pilule: "bg-vert-fond text-vert", point: "bg-vert" },
  "En préparation": { pilule: "bg-ambre-fond text-ambre", point: "bg-ambre" },
  Expédiée: { pilule: "bg-illu text-encre-2", point: "bg-encre-3" },
};

/** Pastille de statut d'une commande (couleur + libellé). */
export function StatutPilule({ statut }: { statut: StatutCommande }) {
  const style = STYLES[statut];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.75 py-1 text-[12.5px] font-medium ${style.pilule}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${style.point}`}
        aria-hidden="true"
      />
      {statut}
    </span>
  );
}
