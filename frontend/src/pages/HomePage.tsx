import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CategoryTiles } from "@/components/produit/CategoryTiles";
import { ProductCard } from "@/components/produit/ProductCard";
import { ProductGrid } from "@/components/produit/ProductGrid";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SearchBar } from "@/components/ui/SearchBar";
import { Trace } from "@/components/ui/Trace";
import { useCatalogueStore } from "@/store/catalogueStore";
import { CATEGORIES, type Categorie, type Produit } from "@/types";

const IDS_VEDETTES = ["ram-d5-32", "ssv-p41-2t", "clv-mx87", "ecr-27q"];

const PUCE_CATEGORIES: Categorie[] = [
  "Claviers",
  "Stockage",
  "Mémoire",
  "Écrans",
  "Périphériques",
];

const GARANTIES: { icone: IconName; titre: string; texte: string }[] = [
  {
    icone: "colis",
    titre: "Expédié sous 24 h",
    texte: "Commande passée avant 16 h, départ le jour même.",
  },
  {
    icone: "bouclier",
    titre: "Garantie 2 ans",
    texte: "Pièces et main-d'œuvre incluses.",
  },
  {
    icone: "retour",
    titre: "Retour 30 jours",
    texte: "Remboursé, sans discussion.",
  },
];

/** Accueil client : recherche, catégories, produits en vedette. */
export function HomePage() {
  const produits = useCatalogueStore((s) => s.produits);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const compteurs = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = produits.filter((p) => p.cat === cat).length;
      return acc;
    },
    {} as Record<Categorie, number>,
  );

  const vedettes = IDS_VEDETTES.map((id) => produits.find((p) => p.id === id)).filter(
    (p): p is Produit => Boolean(p),
  );
  const aLaUne = produits.find((p) => p.id === "ram-d5-32");

  function chercher() {
    const terme = q.trim();
    navigate(terme ? `/boutique?q=${encodeURIComponent(terme)}` : "/boutique");
  }

  return (
    <>
      <div className="mx-auto grid max-w-[1180px] grid-cols-[1.15fr_0.85fr] items-center gap-12 px-4 py-16 sm:px-6 max-lg:grid-cols-1 max-lg:gap-8">
        <div>
          <h1 className="max-w-[15ch] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.15] tracking-tight">
            Trouvez le bon composant, sans compromis.
          </h1>
          <p className="mt-4 max-w-[46ch] text-[17px] text-encre-2">
            Claviers mécaniques, SSD, mémoire vive, écrans : des composants
            testés et garantis, expédiés sous 24 h.
          </p>
          <div className="mt-7 max-w-[520px]">
            <SearchBar
              valeur={q}
              onChange={setQ}
              onSubmit={chercher}
              placeholder="DDR5 32 Go, SSD NVMe, clavier TKL…"
              ariaLabel="Rechercher un composant"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {PUCE_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/boutique?cat=${cat}`}
                className="rounded-full border-[1.5px] border-ligne bg-white px-3.5 py-[7px] text-sm text-encre-2 transition-colors hover:border-cuivre hover:text-cuivre"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
        {aLaUne && <ProductCard produit={aLaUne} vedette />}
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-14 pt-5 sm:px-6">
        <Trace />
        <h2 className="mb-[22px] text-2xl font-bold">Catégories</h2>
        <CategoryTiles compteurs={compteurs} />
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-14 sm:px-6">
        <Trace />
        <h2 className="mb-[22px] text-2xl font-bold">En ce moment</h2>
        <ProductGrid produits={vedettes} />
      </div>

      <div className="border-y border-ligne bg-white py-[30px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-3 gap-7 px-4 sm:px-6 max-lg:grid-cols-1">
          {GARANTIES.map((garantie) => (
            <div key={garantie.titre} className="flex items-start gap-3.5">
              <Icon
                name={garantie.icone}
                className="mt-0.5 h-6 w-6 shrink-0 text-cuivre"
              />
              <div>
                <h3 className="text-[15px] font-semibold">{garantie.titre}</h3>
                <p className="mt-0.5 text-[13.5px] text-encre-2">
                  {garantie.texte}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
