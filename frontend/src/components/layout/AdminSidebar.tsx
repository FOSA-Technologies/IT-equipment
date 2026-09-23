import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  ListOrdered,
  LogOut,
  LucideIcon,
  Package,
  Settings,
  ShoppingCart,
  Undo2,
  UserRound,
} from "lucide-react";
import logo from "/fosa-logo.webp";

const LIENS_ACTIFS: { to: string; libelle: string; Icon: LucideIcon }[] = [
  { to: "/dashboard", libelle: "Vue d'ensemble", Icon: LayoutDashboard },
  { to: "/admin/vente", libelle: "Vente", Icon: ShoppingCart },
  { to: "/admin", libelle: "Produits", Icon: Package },
  { to: "/admin/commandes", libelle: "Commandes", Icon: ListOrdered },
  { to: "/admin/clients", libelle: "Clients", Icon: UserRound },
  { to: "/admin/parametres", libelle: "Paramètres", Icon: Settings },
];

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
        className="px-2.5 font-titre text-lg font-bold text-white flex items-center gap-2.5"
      >
        <img src={logo} alt="Logo" className="h-6 w-6" /> <span>FOSA</span>
      </Link>

      <nav
        aria-label="Administration"
        className="grid gap-0.5 max-lg:flex max-lg:flex-wrap"
      >
        {LIENS_ACTIFS.map((lien) => (
          <NavLink
            key={lien.to}
            to={lien.to}
            end
            className={({ isActive }) =>
              `${BASE_LIEN} ${
                isActive
                  ? "border-cuivre bg-cuivre/25 text-white"
                  : "border-transparent hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <lien.Icon className="h-[17px] w-[17px]" />
            {lien.libelle}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto grid gap-0.5 border-t border-white/10 pt-3.5 max-lg:mt-0 max-lg:ml-auto max-lg:flex max-lg:border-t-0 max-lg:pt-0">
        <Link
          to="/"
          className={`${BASE_LIEN} border-transparent hover:bg-white/5 hover:text-white`}
        >
          <Undo2 className="h-[17px] w-[17px]" />
          Voir la boutique
        </Link>
        <button
          type="button"
          onClick={deconnexion}
          className={`${BASE_LIEN} border-transparent text-left hover:bg-white/5 hover:text-white`}
        >
          <LogOut className="h-[17px] w-[17px]" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
