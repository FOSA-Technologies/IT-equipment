import { CartEmpty } from "@/components/panier/CartEmpty";
import { CartLine } from "@/components/panier/CartLine";
import { CartSummary } from "@/components/panier/CartSummary";
import { Bouton } from "@/components/ui/Button";
import { totalPanier } from "@/domain/panier";
import { useCatalogueStore } from "@/store/catalogueStore";
import { usePanierStore } from "@/store/panierStore";
import { useUiStore } from "@/store/uiStore";
import type { LignePanier, Produit } from "@/types";

interface LigneComplet {
  ligne: LignePanier;
  produit: Produit;
}

/** Page panier : tableau des lignes et récapitulatif. */
export function CartPage() {
  const lignes = usePanierStore((s) => s.lignes);
  const incrementer = usePanierStore((s) => s.incrementer);
  const decrementer = usePanierStore((s) => s.decrementer);
  const retirer = usePanierStore((s) => s.retirer);
  const vider = usePanierStore((s) => s.vider);
  const produits = useCatalogueStore((s) => s.produits);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const lignesCompletes: LigneComplet[] = lignes
    .map((ligne) => ({
      ligne,
      produit: produits.find((p) => p.id === ligne.produitId),
    }))
    .filter((x): x is LigneComplet => Boolean(x.produit));

  const total = totalPanier(lignes, produits);

  function viderPanier() {
    vider();
    afficherToast("Panier vidé");
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6">
      <h1 className="text-[28px] font-bold">Panier</h1>

      {lignesCompletes.length === 0 ? (
        <div className="mt-[22px]">
          <CartEmpty />
        </div>
      ) : (
        <div className="mt-[22px] grid grid-cols-[1fr_340px] items-start gap-7 max-lg:grid-cols-1">
          <div className="overflow-hidden rounded-[10px] border border-ligne bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Produit", "Prix unitaire", "Quantité", "Total", ""].map(
                      (entete, i) => (
                        <th
                          key={i}
                          className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
                        >
                          {entete}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {lignesCompletes.map(({ ligne, produit }) => (
                    <CartLine
                      key={produit.id}
                      ligne={ligne}
                      produit={produit}
                      onIncrementer={() => incrementer(produit.id)}
                      onDecrementer={() => decrementer(produit.id)}
                      onRetirer={() => retirer(produit.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-[18px] py-3.5 text-right">
              <Bouton
                variant="fantome"
                className="!p-0 text-sm font-normal underline underline-offset-4"
                onClick={viderPanier}
              >
                Vider le panier
              </Bouton>
            </div>
          </div>
          <CartSummary total={total} />
        </div>
      )}
    </div>
  );
}
