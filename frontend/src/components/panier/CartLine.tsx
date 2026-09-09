import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { formatPrix } from "@/domain/format";
import type { LignePanier, Produit } from "@/types";

interface CartLineProps {
  ligne: LignePanier;
  produit: Produit;
  onIncrementer: () => void;
  onDecrementer: () => void;
  onRetirer: () => void;
}

/** Ligne du tableau du panier. */
export function CartLine({
  ligne,
  produit,
  onIncrementer,
  onDecrementer,
  onRetirer,
}: CartLineProps) {
  return (
    <tr className="border-b border-ligne last:border-b-0">
      <td className="px-3.5 py-4">
        <div className="flex items-center gap-3.5">
          <span className="h-12 w-16 shrink-0 rounded-lg border border-ligne bg-illu p-1.5">
            <ProductIllustration nom={produit.illu} />
          </span>
          <div>
            <p className="text-[14.5px] font-semibold">{produit.nom}</p>
            <p className="font-mono text-xs text-encre-3">{produit.ref}</p>
          </div>
        </div>
      </td>
      <td className="px-3.5 py-4 font-mono font-semibold">
        {formatPrix(produit.prix)}
      </td>
      <td className="px-3.5 py-4">
        <QtyStepper
          quantite={ligne.quantite}
          onIncrementer={onIncrementer}
          onDecrementer={onDecrementer}
          ariaLabel={`Quantité de ${produit.nom}`}
        />
      </td>
      <td className="px-3.5 py-4 font-mono font-semibold">
        {formatPrix(produit.prix * ligne.quantite)}
      </td>
      <td className="px-3.5 py-4">
        <BoutonIcone
          taille="petite"
          danger
          onClick={onRetirer}
          aria-label={`Retirer ${produit.nom} du panier`}
        >
          <Icon name="croix" className="h-[15px] w-[15px]" />
        </BoutonIcone>
      </td>
    </tr>
  );
}
