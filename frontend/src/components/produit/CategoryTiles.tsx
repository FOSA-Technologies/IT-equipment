import { Link } from "react-router-dom";

import { Icon, type IconName } from "@/components/ui/Icon";
import { CATEGORIES, type Categorie } from "@/types";

const ICONES: Record<Categorie, IconName> = {
  Claviers: "clavier",
  Stockage: "disque",
  Mémoire: "ram",
  Écrans: "ecran",
  Périphériques: "souris",
  Composants: "chip",
};

interface CategoryTilesProps {
  compteurs: Record<Categorie, number>;
}

/** Tuiles des catégories avec leur nombre de produits. */
export function CategoryTiles({ compteurs }: CategoryTilesProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3.5">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          to={`/boutique?cat=${cat}`}
          className="flex flex-col gap-2.5 rounded-[10px] border border-ligne bg-white p-[18px] transition-colors hover:border-cuivre"
        >
          <Icon name={ICONES[cat]} className="h-[26px] w-[26px]" />
          <span className="text-[14.5px] font-semibold">{cat}</span>
          <span className="font-mono text-xs text-encre-3">
            {compteurs[cat]} produit{compteurs[cat] > 1 ? "s" : ""}
          </span>
        </Link>
      ))}
    </div>
  );
}
