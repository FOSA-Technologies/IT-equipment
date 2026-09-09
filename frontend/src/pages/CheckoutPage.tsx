import { Fragment, useState } from "react";

import { CheckoutForm } from "@/components/commande/CheckoutForm";
import { OrderConfirmation } from "@/components/commande/OrderConfirmation";
import { OrderSummary } from "@/components/commande/OrderSummary";
import { BoutonLien } from "@/components/ui/Button";
import { creerReferenceCommande } from "@/domain/commandes";
import { nbArticles, totalPanier } from "@/domain/panier";
import { useCatalogueStore } from "@/store/catalogueStore";
import { usePanierStore } from "@/store/panierStore";
import { useUiStore } from "@/store/uiStore";
import type { Produit } from "@/types";

const ETAPES = ["1 Panier", "2 Livraison", "3 Confirmation"];

interface Confirmation {
  reference: string;
  email: string;
  nb: number;
  total: number;
}

function Etapes({ actuelle }: { actuelle: number }) {
  return (
    <div className="flex items-center gap-3 py-[30px] font-mono text-[13px]">
      {ETAPES.map((etape, i) => (
        <Fragment key={etape}>
          {i > 0 && <span className="text-encre-3">/</span>}
          <span className={i === actuelle ? "font-semibold text-cuivre" : "text-encre-3"}>
            {etape}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

/** Commande : formulaire + récapitulatif, puis écran de confirmation. */
export function CheckoutPage() {
  const lignes = usePanierStore((s) => s.lignes);
  const vider = usePanierStore((s) => s.vider);
  const produits = useCatalogueStore((s) => s.produits);
  const afficherToast = useUiStore((s) => s.afficherToast);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const total = totalPanier(lignes, produits);
  const lignesCompletes = lignes
    .map((ligne) => ({
      produit: produits.find((p) => p.id === ligne.produitId),
      quantite: ligne.quantite,
    }))
    .filter((x): x is { produit: Produit; quantite: number } =>
      Boolean(x.produit),
    );

  function commander(email: string) {
    const nb = nbArticles(lignes);
    const reference = creerReferenceCommande();
    setConfirmation({ reference, email, nb, total });
    vider();
    afficherToast(`Commande confirmée — ${reference}`);
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Etapes actuelle={2} />
        <OrderConfirmation
          reference={confirmation.reference}
          email={confirmation.email}
          nbArticles={confirmation.nb}
          total={confirmation.total}
        />
      </div>
    );
  }

  if (lignesCompletes.length === 0) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Etapes actuelle={1} />
        <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
          <h3 className="text-base font-bold">Votre commande</h3>
          <p className="mb-4 mt-2.5 text-[14.5px] text-encre-2">
            Votre panier est vide.
          </p>
          <BoutonLien to="/boutique" className="w-full">
            Parcourir le catalogue
          </BoutonLien>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
      <Etapes actuelle={1} />
      <div className="grid grid-cols-[1fr_360px] items-start gap-8 pb-[60px] max-lg:grid-cols-1">
        <CheckoutForm onCommander={commander} />
        <OrderSummary lignes={lignesCompletes} total={total} />
      </div>
    </div>
  );
}
