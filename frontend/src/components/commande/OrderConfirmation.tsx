import { Link } from "react-router-dom";

import { BoutonLien } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { dateLivraisonEstimee } from "@/domain/commandes";
import { formatPrix } from "@/domain/format";

interface OrderConfirmationProps {
  reference: string;
  email: string;
  nbArticles: number;
  total: number;
}

/** Écran de confirmation après validation de la commande. */
export function OrderConfirmation({
  reference,
  email,
  nbArticles,
  total,
}: OrderConfirmationProps) {
  const livraison = dateLivraisonEstimee();

  return (
    <div className="px-6 pb-20 pt-14 text-center">
      <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-vert text-white">
        <Icon name="check" className="h-[30px] w-[30px]" />
      </span>
      <h1 className="mb-2 text-[30px] font-bold">Commande confirmée</h1>
      <p className="mb-4 font-mono text-[15px] text-encre-2">{reference}</p>
      <p className="mx-auto mb-6 max-w-[52ch] text-encre-2">
        Un récapitulatif est envoyé à <strong>{email}</strong>. Livraison
        estimée : {livraison}.
      </p>

      <div className="mx-auto mb-6 grid max-w-[460px] gap-2 rounded-[10px] border border-ligne bg-white px-[22px] py-[18px] text-left text-[14.5px]">
        <div className="flex justify-between text-encre-2">
          <span>
            {nbArticles} article{nbArticles > 1 ? "s" : ""}
          </span>
          <span className="font-mono font-semibold text-encre">
            {formatPrix(total)}
          </span>
        </div>
        <div className="flex justify-between text-encre-2">
          <span>Livraison</span>
          <span className="font-medium text-vert">Offerte</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total payé</span>
          <span className="font-mono">{formatPrix(total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <BoutonLien to="/" variant="cuivre">
          Retour à l'accueil
        </BoutonLien>
        <Link
          to="/boutique"
          className="text-sm text-encre-3 underline underline-offset-4 hover:text-cuivre"
        >
          Suivre la commande
        </Link>
      </div>
    </div>
  );
}
