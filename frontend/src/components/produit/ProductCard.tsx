import { Link } from "react-router-dom";

import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatPrix } from "@/domain/format";
import { usePanierStore } from "@/store/panierStore";
import { useUiStore } from "@/store/uiStore";
import type { Produit } from "@/types";

interface ProductCardProps {
  produit: Produit;
  /** Mise en avant (héro de l'accueil) : visuel plus grand. */
  vedette?: boolean;
}

/** Carte produit : schéma technique, référence, prix, ajout au panier. */
export function ProductCard({ produit, vedette = false }: ProductCardProps) {
  const ajouter = usePanierStore((s) => s.ajouter);
  const afficherToast = useUiStore((s) => s.afficherToast);

  function ajouterAuPanier() {
    ajouter(produit.id);
    afficherToast(`Ajouté au panier — ${produit.ref}`);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-[10px] border border-ligne bg-white transition-colors hover:border-cuivre">
      <Link
        to={`/produit/${produit.id}`}
        className="relative block bg-illu p-5"
      >
        {vedette && (
          <span className="absolute left-3 top-3 rounded-full bg-cuivre px-[11px] py-1 text-[12.5px] font-semibold text-white">
            Nouveau
          </span>
        )}
        <ProductIllustration nom={produit.illu} />
      </Link>

      <div
        className={`flex flex-1 flex-col gap-1 ${
          vedette ? "px-5 pb-5 pt-[18px]" : "px-4 pb-4 pt-3.5"
        }`}
      >
        <p className="font-mono text-[11px] tracking-wide text-encre-3">
          {produit.ref}
        </p>
        <h3 className={`font-semibold leading-snug ${vedette ? "text-[17px]" : "text-[15px]"}`}>
          <Link to={`/produit/${produit.id}`} className="hover:text-cuivre">
            {produit.nom}
          </Link>
        </h3>
        <p className="text-[13px] text-encre-2">{produit.spec}</p>

        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="font-mono font-semibold">
            {produit.prixBarre && (
              <s className="mr-1.5 font-normal text-encre-3">
                {formatPrix(produit.prixBarre)}
              </s>
            )}
            {formatPrix(produit.prix)}
          </span>
          <BoutonIcone
            onClick={ajouterAuPanier}
            aria-label={`Ajouter ${produit.nom} au panier`}
          >
            <Icon name="panier" />
          </BoutonIcone>
        </div>
      </div>
    </article>
  );
}
