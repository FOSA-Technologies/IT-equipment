import { Link } from "react-router-dom";

import { COULEURS_DOT } from "@/components/ui/StockStatus";
import { statutStock } from "@/domain/catalogue";
import { useCatalogueStore } from "@/store/catalogueStore";

/** Alertes de stock : produits faibles ou en rupture, dérivés du catalogue. */
export function StockAlerts() {
  const produits = useCatalogueStore((s) => s.produits);
  const alertes = produits
    .map((produit) => ({ produit, statut: statutStock(produit) }))
    .filter(({ statut }) => statut.niveau !== "disponible")
    .slice(0, 3);

  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="text-base font-bold">Stock faible</h3>
      <p className="mb-4 mt-1 font-mono text-[11.5px] text-encre-3">
        {alertes.length} produit{alertes.length > 1 ? "s" : ""} à réapprovisionner
      </p>

      {alertes.length === 0 ? (
        <p className="text-sm text-encre-2">Aucun produit en alerte.</p>
      ) : (
        <div className="grid gap-3.5">
          {alertes.map(({ produit, statut }) => (
            <div
              key={produit.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${COULEURS_DOT[statut.niveau]}`}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold">{produit.nom}</p>
                <p className="font-mono text-xs text-encre-3">
                  {produit.ref} — {produit.stock} en stock
                </p>
              </div>
              <Link
                to={`/boutique?cat=${produit.cat}`}
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
