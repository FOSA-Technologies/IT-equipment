import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Bouton } from "@/components/ui/Button";
import { Trace } from "@/components/ui/Trace";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const CHAMP_INPUT =
  "w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]";

/** Connexion du propriétaire (JWT délivré par le backend). */
export function LoginPage() {
  const ouvrirSession = useAuthStore((s) => s.ouvrirSession);
  const afficherToast = useUiStore((s) => s.afficherToast);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [resterConnecte, setResterConnecte] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    if (enCours) return;
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await api.auth.connexion(
        email.trim(),
        motDePasse,
        resterConnecte,
      );
      ouvrirSession(reponse.token, reponse.utilisateur.email);
      afficherToast("Connecté à l'espace propriétaire");
      navigate("/dashboard");
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnCours(false);
    }
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
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="proprietaire@it-equipment.fr"
              className={CHAMP_INPUT}
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
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={CHAMP_INPUT}
            />
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

          {erreur && (
            <p role="alert" className="mb-4 text-sm font-medium text-rouge">
              {erreur}
            </p>
          )}

          <Bouton
            type="submit"
            variant="cuivre"
            className="w-full"
            disabled={enCours}
          >
            {enCours ? "Connexion…" : "Se connecter"}
          </Bouton>
        </form>
      </div>
    </div>
  );
}
