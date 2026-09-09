import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StockStatus } from "@/components/ui/StockStatus";
import { statutStock } from "@/domain/catalogue";
import { formatPrix } from "@/domain/format";
import type { Produit } from "@/types";

interface ProductsTableProps {
  produits: Produit[];
  onModifier: (id: string) => void;
  onSupprimer: (id: string) => void;
}

/** Tableau de gestion des produits (côté propriétaire). */
export function ProductsTable({
  produits,
  onModifier,
  onSupprimer,
}: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Produit", "Catégorie", "Prix", "Stock", "Actions"].map(
              (entete) => (
                <th
                  key={entete}
                  className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
                >
                  {entete}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {produits.map((produit) => (
            <tr
              key={produit.id}
              className="border-b border-ligne last:border-b-0"
            >
              <td className="px-3.5 py-4">
                <div className="flex items-center gap-3.5">
                  <span className="h-10 w-[52px] shrink-0 rounded-lg border border-ligne bg-illu p-1">
                    <ProductIllustration nom={produit.illu} />
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold">{produit.nom}</p>
                    <p className="font-mono text-xs text-encre-3">
                      {produit.ref}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3.5 py-4 text-[14.5px]">{produit.cat}</td>
              <td className="px-3.5 py-4 font-mono font-semibold">
                {formatPrix(produit.prix)}
              </td>
              <td className="px-3.5 py-4">
                <StockStatus statut={statutStock(produit)} />
                <span className="ml-2 font-mono text-xs text-encre-3">
                  {produit.stock}
                </span>
              </td>
              <td className="px-3.5 py-4">
                <div className="flex gap-1">
                  <BoutonIcone
                    taille="petite"
                    onClick={() => onModifier(produit.id)}
                    aria-label={`Modifier ${produit.nom}`}
                  >
                    <Icon name="stylo" className="h-[15px] w-[15px]" />
                  </BoutonIcone>
                  <BoutonIcone
                    taille="petite"
                    danger
                    onClick={() => onSupprimer(produit.id)}
                    aria-label={`Supprimer ${produit.nom}`}
                  >
                    <Icon name="poubelle" className="h-[15px] w-[15px]" />
                  </BoutonIcone>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
