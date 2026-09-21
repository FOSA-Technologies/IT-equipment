import { Fragment, useState } from "react";

import { CheckoutForm } from "@/components/commande/CheckoutForm";
import { OrderConfirmation } from "@/components/commande/OrderConfirmation";
import { OrderSummary } from "@/components/commande/OrderSummary";
import { CatalogueEtat } from "@/components/produit/CatalogueEtat";
import { BoutonLien } from "@/components/ui/Button";
import { totalPanier } from "@/domain/panier";
import { api } from "@/lib/api";
import { ApiError, messageErreur } from "@/lib/http";
import { useCatalogueStore } from "@/store/catalogueStore";
import { usePanierStore } from "@/store/panierStore";
import { useUiStore } from "@/store/uiStore";
import type { Produit, SaisieCommande } from "@/types";

const ETAPES = ["1 Panier", "2 Livraison", "3 Confirmation"];

interface Confirmation {
  reference: string;
  email: string;
  nb: number;
  total: number;
  livraisonEstimee: string;
}

interface ProblemeStock {
  produitId: string;
  raison: "introuvable" | "stock_insuffisant";
  disponible?: number;
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

/** Message détaillé quand le backend refuse une commande pour cause de stock. */
function messageStock(erreur: ApiError, produits: Produit[]): string {
  const problemes = Array.isArray(erreur.details)
    ? (erreur.details as ProblemeStock[])
    : [];
  if (problemes.length === 0) return erreur.message;
  return problemes
    .map((p) => {
      const nom = produits.find((x) => x.id === p.produitId)?.nom ?? p.produitId;
      if (p.raison === "introuvable") return `${nom} : n'est plus au catalogue`;
      return p.disponible
        ? `${nom} : ${p.disponible} disponible${p.disponible > 1 ? "s" : ""}`
        : `${nom} : en rupture`;
    })
    .join(" · ");
}

/** Commande : formulaire + récapitulatif, puis écran de confirmation. */
export function CheckoutPage() {
  const lignes = usePanierStore((s) => s.lignes);
  const vider = usePanierStore((s) => s.vider);
  const produits = useCatalogueStore((s) => s.produits);
  const statutCatalogue = useCatalogueStore((s) => s.statut);
  const chargerCatalogue = useCatalogueStore((s) => s.charger);
  const afficherToast = useUiStore((s) => s.afficherToast);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [enCours, setEnCours] = useState(false);

  const total = totalPanier(lignes, produits);
  const lignesCompletes = lignes
    .map((ligne) => ({
      produit: produits.find((p) => p.id === ligne.produitId),
      quantite: ligne.quantite,
    }))
    .filter((x): x is { produit: Produit; quantite: number } =>
      Boolean(x.produit),
    );

  async function commander(saisie: SaisieCommande) {
    if (enCours) return;
    setEnCours(true);
    try {
      const commande = await api.commandes.creer({
        ...saisie,
        lignes: lignesCompletes.map(({ produit, quantite }) => ({
          produitId: produit.id,
          quantite,
        })),
      });
      setConfirmation({
        reference: commande.reference,
        email: commande.email,
        nb: commande.nbArticles,
        total: commande.total,
        livraisonEstimee: commande.livraisonEstimee,
      });
      vider();
      afficherToast(`Commande confirmée — ${commande.reference}`);
      void chargerCatalogue(); // les stocks ont changé
    } catch (e) {
      if (e instanceof ApiError && e.code === "STOCK_INDISPONIBLE") {
        afficherToast(`Stock insuffisant — ${messageStock(e, produits)}`);
        void chargerCatalogue();
      } else {
        afficherToast(messageErreur(e));
      }
    } finally {
      setEnCours(false);
    }
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
          livraisonEstimee={confirmation.livraisonEstimee}
        />
      </div>
    );
  }

  // Panier non vide mais catalogue pas encore là : ne pas afficher « panier vide ».
  if (lignes.length > 0 && statutCatalogue !== "pret") {
    return <CatalogueEtat />;
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
        <OrderSummary lignes={lignesCompletes} total={total} enCours={enCours} />
      </div>
    </div>
  );
}
