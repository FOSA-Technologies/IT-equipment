import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Bouton } from "@/components/ui/Button";
import { Trace } from "@/components/ui/Trace";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

/** Connexion du propriétaire (authentification fictive). */
export function LoginPage() {
  const seConnecter = useAuthStore((s) => s.seConnecter);
  const afficherToast = useUiStore((s) => s.afficherToast);
  const navigate = useNavigate();
  const [resterConnecte, setResterConnecte] = useState(true);

  function soumettre(e: FormEvent) {
    e.preventDefault();
    seConnecter();
    afficherToast("Connecté à l'espace propriétaire");
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-[400px] max-w-full rounded-xl border border-ligne bg-white p-9">
        <Link
          to="/"
          className="block text-center font-titre text-[21px] font-bold tracking-tight"
        >
          IT<span className="text-cuivre">-</span>equipment
        </Link>
        <Trace className="mx-auto mb-3.5 mt-3.5 w-10" />
        <h1 className="text-center text-[23px] font-bold">
          Espace propriétaire
        </h1>
        <p className="mb-[26px] mt-2.5 text-center text-[14.5px] text-encre-2">
          Gérez le catalogue et suivez les commandes.
        </p>

        <form onSubmit={soumettre}>
          <div className="mb-4 grid gap-1.5">
            <label htmlFor="cx-email" className="text-[13.5px] font-semibold">
              Adresse e-mail
            </label>
            <input
              id="cx-email"
              type="email"
              required
              defaultValue="proprietaire@it-equipment.fr"
              className="w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]"
            />
          </div>
          <div className="mb-4 grid gap-1.5">
            <label htmlFor="cx-mdp" className="text-[13.5px] font-semibold">
              Mot de passe
            </label>
            <input
              id="cx-mdp"
              type="password"
              required
              defaultValue="••••••••"
              className="w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]"
            />
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                className="text-[13px] text-encre-3 underline underline-offset-4 hover:text-cuivre"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
          <label className="mb-5 flex cursor-pointer items-center gap-2.5 text-sm text-encre-2">
            <input
              type="checkbox"
              checked={resterConnecte}
              onChange={(e) => setResterConnecte(e.target.checked)}
              className="h-4 w-4 accent-cuivre"
            />
            Rester connecté
          </label>
          <Bouton type="submit" variant="cuivre" className="w-full">
            Se connecter
          </Bouton>
        </form>

        <p className="mt-[18px] text-center font-mono text-xs text-encre-3">
          Maquette : n'importe quel identifiant fonctionne.
        </p>
      </div>
    </div>
  );
}
