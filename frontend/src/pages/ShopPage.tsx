import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FilterSidebar } from "@/components/produit/FilterSidebar";
import { ProductGrid } from "@/components/produit/ProductGrid";
import { Bouton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { filtrerProduits } from "@/domain/catalogue";
import { useCatalogueStore } from "@/store/catalogueStore";
import { CATEGORIES, type Categorie, type Filtres } from "@/types";

/**
 * Boutique : la recherche et les catégories vivent dans l'URL (partageable) ;
 * le prix, la disponibilité et le tri restent dans l'état local de la page.
 */
export function ShopPage() {
  const produits = useCatalogueStore((s) => s.produits);
  const [params, setParams] = useSearchParams();

  const [saisie, setSaisie] = useState(params.get("q") ?? "");
  const [prix, setPrix] = useState<Filtres["prix"]>("");
  const [stockSeul, setStockSeul] = useState(false);
  const [tri, setTri] = useState<Filtres["tri"]>("pertinence");

  const q = params.get("q") ?? "";
  const categories = params.getAll("cat") as Categorie[];

  const filtres: Filtres = { q, categories, prix, stockSeul, tri };
  const resultats = filtrerProduits(produits, filtres);

  const compteurs = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = produits.filter((p) => p.cat === cat).length;
      return acc;
    },
    {} as Record<Categorie, number>,
  );

  function appliquerPatch(patch: Partial<Filtres>) {
    if (patch.categories) {
      setParams(
        (precedents) => {
          const suivants = new URLSearchParams(precedents);
          suivants.delete("cat");
          patch.categories?.forEach((cat) => suivants.append("cat", cat));
          return suivants;
        },
        { replace: true },
      );
    }
    if (patch.prix !== undefined) setPrix(patch.prix);
    if (patch.stockSeul !== undefined) setStockSeul(patch.stockSeul);
  }

  function reinitialiser() {
    setPrix("");
    setStockSeul(false);
    setTri("pertinence");
    setSaisie("");
    setParams({}, { replace: true });
  }

  function chercher() {
    const terme = saisie.trim();
    setParams(terme ? { q: terme } : {}, { replace: true });
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-[60px] sm:px-6">
      <div className="py-9">
        <SearchBar
          valeur={saisie}
          onChange={setSaisie}
          onSubmit={chercher}
          ariaLabel="Rechercher un composant"
        />
      </div>

      <div className="grid grid-cols-[230px_1fr] gap-8 max-lg:grid-cols-1">
        <FilterSidebar
          filtres={filtres}
          compteurs={compteurs}
          onChanger={appliquerPatch}
          onReinitialiser={reinitialiser}
        />

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <h1 className="text-[22px] font-bold">
              {q ? `Résultats pour « ${q} »` : "Catalogue"}
            </h1>
            <span className="font-mono text-[13px] text-encre-3">
              {resultats.length} produit{resultats.length > 1 ? "s" : ""}
            </span>
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as Filtres["tri"])}
              aria-label="Trier les résultats"
              className="ml-auto rounded-lg border-[1.5px] border-ligne bg-white px-3 py-[9px] text-sm text-encre-2"
            >
              <option value="pertinence">Pertinence</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>

          {resultats.length > 0 ? (
            <ProductGrid produits={resultats} />
          ) : (
            <EmptyState
              titre="Aucun produit ne correspond"
              texte="Essayez un autre terme ou retirez un filtre."
            >
              <Bouton onClick={reinitialiser}>Réinitialiser les filtres</Bouton>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
