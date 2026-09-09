import { Link } from "react-router-dom";

import { Icon } from "@/components/ui/Icon";
import { nbArticles } from "@/domain/panier";
import { useAuthStore } from "@/store/authStore";
import { usePanierStore } from "@/store/panierStore";

const LIENS_CATALOGUE = [
  { to: "/boutique", libelle: "Catalogue" },
  { to: "/boutique?cat=Stockage", libelle: "Stockage" },
  { to: "/boutique?cat=Mémoire", libelle: "Mémoire" },
  { to: "/boutique?cat=Claviers", libelle: "Claviers" },
];

const ICONE_LIEN =
  "inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border-[1.5px] border-ligne bg-white text-encre-2 transition-colors hover:border-cuivre hover:text-cuivre";

/** Entête du site côté client : logo, navigation, recherche, panier. */
export function Header() {
  const lignes = usePanierStore((s) => s.lignes);
  const connecte = useAuthStore((s) => s.connecte);
  const nb = nbArticles(lignes);

  return (
    <header className="sticky top-0 z-50 border-b border-ligne bg-white">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-7 px-4 sm:px-6">
        <Link
          to="/"
          className="font-titre text-[19px] font-bold tracking-tight"
        >
          IT<span className="text-cuivre">-</span>equipment
        </Link>

        <nav aria-label="Catalogue" className="hidden gap-5 md:flex">
          {LIENS_CATALOGUE.map((lien) => (
            <Link
              key={lien.to}
              to={lien.to}
              className="text-[14.5px] font-medium text-encre-2 transition-colors hover:text-cuivre"
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link to="/boutique" aria-label="Rechercher un produit" className={ICONE_LIEN}>
            <Icon name="loupe" />
          </Link>
          <Link to="/panier" aria-label="Voir le panier" className={`relative ${ICONE_LIEN}`}>
            <Icon name="panier" />
            {nb > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cuivre px-1 font-mono text-[11px] font-semibold text-white">
                {nb}
              </span>
            )}
          </Link>
          <Link
            to={connecte ? "/dashboard" : "/connexion"}
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-transparent px-3.5 py-2 text-[15px] font-semibold text-encre-2 transition-colors hover:border-ligne hover:text-encre"
          >
            <Icon name="utilisateur" className="h-4 w-4" />
            <span className="hidden sm:inline">Espace propriétaire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
