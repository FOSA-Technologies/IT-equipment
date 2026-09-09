import { ProductCard } from "@/components/produit/ProductCard";
import type { Produit } from "@/types";

/** Grille de cartes produit. */
export function ProductGrid({ produits }: { produits: Produit[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
      {produits.map((produit) => (
        <ProductCard key={produit.id} produit={produit} />
      ))}
    </div>
  );
}
