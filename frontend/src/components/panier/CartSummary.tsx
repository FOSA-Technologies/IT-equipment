import { Link } from "react-router-dom";

import { BoutonLien } from "@/components/ui/Button";
import { formatPrix } from "@/domain/format";

/** Récapitulatif du panier : sous-total, livraison, total. */
export function CartSummary({ total }: { total: number }) {
  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="mb-3.5 text-base font-bold">Récapitulatif</h3>
      <div className="grid gap-2 text-[14.5px]">
        <div className="flex justify-between text-encre-2">
          <span>Sous-total</span>
          <span className="font-mono font-semibold text-encre">
            {formatPrix(total)}
          </span>
        </div>
        <div className="flex justify-between text-encre-2">
          <span>Livraison</span>
          <span className="font-medium text-vert">Offerte</span>
        </div>
      </div>
      <div className="mt-3.5 flex justify-between border-t border-ligne pt-3.5 font-semibold">
        <span>Total</span>
        <span className="font-mono text-[19px]">{formatPrix(total)}</span>
      </div>
      <BoutonLien to="/commande" variant="cuivre" className="mt-[18px] w-full">
        Passer la commande
      </BoutonLien>
      <p className="mt-3 font-mono text-[11.5px] text-encre-3">
        Paiement sécurisé, aucune donnée bancaire stockée.
      </p>
      <Link
        to="/boutique"
        className="mt-2 inline-block text-sm text-encre-3 underline underline-offset-4 hover:text-cuivre"
      >
        Continuer mes achats
      </Link>
    </div>
  );
}
