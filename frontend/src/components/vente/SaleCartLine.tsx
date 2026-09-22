import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { formatPrix } from "@/domain/format";
import type { LignePanier, Produit } from "@/types";

interface SaleCartLineProps {
  ligne: LignePanier;
  produit: Produit;
  onIncrementer: () => void;
  onDecrementer: () => void;
  onRetirer: () => void;
}

/** Ligne compacte du panier de vente (barre latérale de l'écran de caisse). */
export function SaleCartLine({
  ligne,
  produit,
  onIncrementer,
  onDecrementer,
  onRetirer,
}: SaleCartLineProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ligne bg-illu p-1">
        <ProductIllustration nom={produit.illu} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold">{produit.nom}</p>
        <p className="font-mono text-xs text-encre-3">
          {formatPrix(produit.prix)}
        </p>
      </div>
      <QtyStepper
        quantite={ligne.quantite}
        onIncrementer={onIncrementer}
        onDecrementer={onDecrementer}
        ariaLabel={`Quantité de ${produit.nom}`}
      />
      <BoutonIcone
        taille="petite"
        danger
        onClick={onRetirer}
        aria-label={`Retirer ${produit.nom} du panier`}
      >
        <Icon name="croix" className="h-[13px] w-[13px]" />
      </BoutonIcone>
    </div>
  );
}
