import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { formatPrix } from "@/domain/format";
import type { Produit } from "@/types";

interface SaleProductCardProps {
  produit: Produit;
  /** Quantité déjà présente dans le panier de vente (limite l'ajout au stock). */
  quantiteAuPanier: number;
  onAjouter: () => void;
}

/** Carte produit compacte de l'écran de vente : clic pour ajouter au panier. */
export function SaleProductCard({
  produit,
  quantiteAuPanier,
  onAjouter,
}: SaleProductCardProps) {
  const epuise = quantiteAuPanier >= produit.stock;

  return (
    <button
      type="button"
      onClick={onAjouter}
      disabled={epuise}
      className="flex flex-col items-start gap-2.5 rounded-[10px] border border-ligne bg-white p-3.5 text-left transition-colors hover:border-cuivre disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-ligne"
    >
      <span className="flex h-14 w-full items-center justify-center rounded-lg bg-illu p-2">
        <ProductIllustration nom={produit.illu} />
      </span>
      <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug">
        {produit.nom}
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="font-mono text-[14px] font-bold text-cuivre">
          {formatPrix(produit.prix)}
        </span>
        <span className="font-mono text-[11px] text-encre-3">
          {epuise ? "Stock max" : `Stock : ${produit.stock}`}
        </span>
      </span>
    </button>
  );
}
