import { Bouton } from "@/components/ui/Button";
import { CATEGORIES, type Categorie, type Filtres } from "@/types";

export const PLAGES_PRIX = [
  { valeur: "", libelle: "Tous les prix" },
  { valeur: "0-75", libelle: "Moins de 75 €" },
  { valeur: "75-150", libelle: "75 € à 150 €" },
  { valeur: "150-", libelle: "Plus de 150 €" },
] as const;

interface FilterSidebarProps {
  filtres: Filtres;
  compteurs: Record<Categorie, number>;
  onChanger: (patch: Partial<Filtres>) => void;
  onReinitialiser: () => void;
}

/** Filtres du catalogue : catégories, prix, disponibilité. */
export function FilterSidebar({
  filtres,
  compteurs,
  onChanger,
  onReinitialiser,
}: FilterSidebarProps) {
  function basculerCategorie(cat: Categorie) {
    const presente = filtres.categories.includes(cat);
    onChanger({
      categories: presente
        ? filtres.categories.filter((c) => c !== cat)
        : [...filtres.categories, cat],
    });
  }

  return (
    <aside
      aria-label="Filtres"
      className="grid content-start gap-6 lg:sticky lg:top-[88px] max-lg:grid-cols-3 max-sm:grid-cols-1"
    >
      <div>
        <h4 className="mb-2.5 text-[13.5px] font-semibold">Catégorie</h4>
        {CATEGORIES.map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2.5 py-[3px] text-sm text-encre-2"
          >
            <input
              type="checkbox"
              checked={filtres.categories.includes(cat)}
              onChange={() => basculerCategorie(cat)}
              className="h-4 w-4 accent-cuivre"
            />
            {cat}
            <span className="ml-auto font-mono text-[11.5px] text-encre-3">
              {compteurs[cat]}
            </span>
          </label>
        ))}
      </div>

      <div className="border-t border-ligne pt-[22px] max-lg:border-t-0 max-lg:pt-0">
        <h4 className="mb-2.5 text-[13.5px] font-semibold">Prix</h4>
        {PLAGES_PRIX.map((plage) => (
          <label
            key={plage.valeur}
            className="flex items-center gap-2.5 py-[3px] text-sm text-encre-2"
          >
            <input
              type="radio"
              name="prix"
              checked={filtres.prix === plage.valeur}
              onChange={() => onChanger({ prix: plage.valeur })}
              className="h-4 w-4 accent-cuivre"
            />
            {plage.libelle}
          </label>
        ))}
      </div>

      <div className="border-t border-ligne pt-[22px] max-lg:border-t-0 max-lg:pt-0">
        <h4 className="mb-2.5 text-[13.5px] font-semibold">Disponibilité</h4>
        <label className="flex items-center gap-2.5 py-[3px] text-sm text-encre-2">
          <input
            type="checkbox"
            checked={filtres.stockSeul}
            onChange={(e) => onChanger({ stockSeul: e.target.checked })}
            className="h-4 w-4 accent-cuivre"
          />
          En stock uniquement
        </label>
        <div className="mt-4">
          <Bouton
            variant="fantome"
            className="!p-0 text-sm font-normal underline underline-offset-4"
            onClick={onReinitialiser}
          >
            Réinitialiser les filtres
          </Bouton>
        </div>
      </div>
    </aside>
  );
}
