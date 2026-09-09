import { Bouton } from "@/components/ui/Button";
import { formatPrix } from "@/domain/format";
import type { Produit } from "@/types";

interface LigneRecap {
  produit: Produit;
  quantite: number;
}

interface OrderSummaryProps {
  lignes: LigneRecap[];
  total: number;
}

/**
 * Récapitulatif de la commande. Le bouton soumet le formulaire voisin
 * (CheckoutForm) via l'attribut HTML `form`.
 */
export function OrderSummary({ lignes, total }: OrderSummaryProps) {
  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="mb-3.5 text-base font-bold">Votre commande</h3>
      <div className="grid gap-2.5 text-sm">
        {lignes.map(({ produit, quantite }) => (
          <div
            key={produit.id}
            className="flex justify-between gap-3 text-encre-2"
          >
            <span>
              {produit.nom} × {quantite}
            </span>
            <span className="ml-auto font-mono font-semibold text-encre">
              {formatPrix(produit.prix * quantite)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex justify-between border-t border-ligne pt-3.5 font-semibold">
        <span>Total</span>
        <span className="font-mono text-[19px]">{formatPrix(total)}</span>
      </div>
      <Bouton
        type="submit"
        form="form-commande"
        variant="cuivre"
        className="mt-[18px] w-full"
      >
        Commander — {formatPrix(total)}
      </Bouton>
      <p className="mt-3 font-mono text-[11.5px] text-encre-3">
        Paiement sécurisé, aucune donnée bancaire stockée.
      </p>
    </div>
  );
}
