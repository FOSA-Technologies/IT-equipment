import type { StatutStock } from "@/types";

export const COULEURS_DOT: Record<StatutStock["niveau"], string> = {
  disponible: "bg-vert",
  faible: "bg-ambre",
  rupture: "bg-rouge",
};

/** Statut de disponibilité : pastille colorée toujours accompagnée du libellé. */
export function StockStatus({ statut }: { statut: StatutStock }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${COULEURS_DOT[statut.niveau]}`}
        aria-hidden="true"
      />
      {statut.libelle}
    </span>
  );
}
