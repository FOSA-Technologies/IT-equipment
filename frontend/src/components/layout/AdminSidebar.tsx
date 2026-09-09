import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

const LIENS_ACTIFS = [
  { to: "/dashboard", libelle: "Vue d'ensemble" },
  { to: "/admin", libelle: "Produits" },
];

const LIENS_A_VENIR = ["Commandes", "Clients", "Paramètres"];

const BASE_LIEN =
  "flex items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-[14.5px]";

/** Navigation latérale des pages propriétaire. */
export function AdminSidebar() {
  const seDeconnecter = useAuthStore((s) => s.seDeconnecter);
  const navigate = useNavigate();

  function deconnexion() {
    seDeconnecter();
    navigate("/connexion");
  }

  return (
    <aside className="sticky top-0 flex h-screen flex-col gap-6 bg-sombre px-4 py-[22px] text-[#A6ADBB] max-lg:static max-lg:h-auto max-lg:flex-row max-lg:flex-wrap max-lg:items-center max-lg:gap-2.5 max-lg:px-4 max-lg:py-3">
      <Link
        to="/"
        className="px-2.5 font-titre text-lg font-bold text-white"
      >
        IT<span className="text-cuivre">-</span>equipment
      </Link>

      <nav aria-label="Administration" className="grid gap-0.5 max-lg:flex max-lg:flex-wrap">
        {LIENS_ACTIFS.map((lien) => (
          <NavLink
            key={lien.to}
            to={lien.to}
            className={({ isActive }) =>
              `${BASE_LIEN} ${
                isActive
                  ? "border-cuivre bg-cuivre/25 text-white"
                  : "border-transparent hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {lien.libelle}
          </NavLink>
        ))}
        {LIENS_A_VENIR.map((libelle) => (
          <span key={libelle} className={`${BASE_LIEN} cursor-default border-transparent opacity-45`}>
            {libelle}
          </span>
        ))}
      </nav>

      <div className="mt-auto grid gap-0.5 border-t border-white/10 pt-3.5 max-lg:mt-0 max-lg:ml-auto max-lg:flex max-lg:border-t-0 max-lg:pt-0">
        <Link to="/" className={`${BASE_LIEN} border-transparent hover:bg-white/5 hover:text-white`}>
          Voir la boutique
        </Link>
        <button
          type="button"
          onClick={deconnexion}
          className={`${BASE_LIEN} border-transparent text-left hover:bg-white/5 hover:text-white`}
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
