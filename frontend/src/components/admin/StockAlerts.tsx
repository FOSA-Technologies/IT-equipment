import { Link } from "react-router-dom";

import { COULEURS_DOT } from "@/components/ui/StockStatus";
import type { AlerteStock } from "@/types";

interface StockAlertsProps {
  /** Toutes les alertes ; seules les trois premières sont détaillées. */
  alertes: AlerteStock[];
}

/** Alertes de stock : produits faibles ou en rupture. */
export function StockAlerts({ alertes }: StockAlertsProps) {
  const visibles = alertes.slice(0, 3);

  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="text-base font-bold">Stock faible</h3>
      <p className="mb-4 mt-1 font-mono text-[11.5px] text-encre-3">
        {alertes.length} produit{alertes.length > 1 ? "s" : ""} à réapprovisionner
      </p>

      {visibles.length === 0 ? (
        <p className="text-sm text-encre-2">Aucun produit en alerte.</p>
      ) : (
        <div className="grid gap-3.5">
          {visibles.map((alerte) => (
            <div
              key={alerte.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${COULEURS_DOT[alerte.niveau]}`}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold">{alerte.nom}</p>
                <p className="font-mono text-xs text-encre-3">
                  {alerte.ref} — {alerte.stock} en stock
                </p>
              </div>
              <Link
                to={`/boutique?cat=${alerte.cat}`}
                className="text-[12.5px] text-encre-3 underline underline-offset-4 hover:text-cuivre"
              >
                Réapprovisionner
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
