import { useEffect, useState, type FormEvent } from "react";

import { Bouton } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const CHAMP_INPUT =
  "w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]";

/** Informations du compte propriétaire : nom, e-mail (lecture seule), mot de passe. */
export function CompteForm() {
  const email = useAuthStore((s) => s.email);
  const nom = useAuthStore((s) => s.nom);
  const definirNom = useAuthStore((s) => s.definirNom);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const [edition, setEdition] = useState(false);
  const [nomSaisi, setNomSaisi] = useState(nom ?? "");
  const [changerMdp, setChangerMdp] = useState(false);
  const [mdpActuel, setMdpActuel] = useState("");
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmationMdp, setConfirmationMdp] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  // Rafraîchit le nom au premier affichage : utile pour une session ouverte
  // avant l'ajout de ce champ (il vaut alors null dans le stockage local).
  useEffect(() => {
    api.auth
      .moi()
      .then(({ utilisateur }) => definirNom(utilisateur.nom))
      .catch(() => {
        /* la session reste valide ; la fiche s'affiche avec les données locales */
      });
  }, [definirNom]);

  function ouvrirEdition() {
    setNomSaisi(nom ?? "");
    setChangerMdp(false);
    setMdpActuel("");
    setNouveauMdp("");
    setConfirmationMdp("");
    setErreur(null);
    setEdition(true);
  }

  function annulerChangementMdp() {
    setChangerMdp(false);
    setMdpActuel("");
    setNouveauMdp("");
    setConfirmationMdp("");
  }

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    if (enCours) return;
    if (changerMdp && nouveauMdp !== confirmationMdp) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setEnCours(true);
    setErreur(null);
    try {
      const { utilisateur } = await api.auth.majCompte({
        nom: nomSaisi.trim(),
        ...(changerMdp && {
          motDePasseActuel: mdpActuel,
          nouveauMotDePasse: nouveauMdp,
        }),
      });
      definirNom(utilisateur.nom);
      afficherToast("Compte mis à jour");
      setEdition(false);
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnCours(false);
    }
  }

  const initiale = (nom || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="mb-4 text-base font-bold">Informations du compte</h3>

      {!edition ? (
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cuivre/15 text-lg font-bold text-cuivre">
            {initiale}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold">{nom || "—"}</p>
            <p className="text-[13px] text-cuivre">Propriétaire</p>
            <p className="text-[13px] text-encre-3">{email}</p>
          </div>
          <Bouton onClick={ouvrirEdition}>Modifier</Bouton>
        </div>
      ) : (
        <form onSubmit={soumettre} className="grid gap-3.5">
          <div className="grid gap-1.5">
            <label htmlFor="cpt-nom" className="text-[13.5px] font-semibold">
              Nom
            </label>
            <input
              id="cpt-nom"
              value={nomSaisi}
              onChange={(e) => setNomSaisi(e.target.value)}
              required
              className={CHAMP_INPUT}
            />
          </div>

          {!changerMdp ? (
            <button
              type="button"
              onClick={() => setChangerMdp(true)}
              className="justify-self-start text-[13.5px] text-cuivre underline underline-offset-4"
            >
              Changer le mot de passe
            </button>
          ) : (
            <div className="grid gap-3.5 rounded-lg border border-ligne bg-illu p-3.5">
              <div className="grid gap-1.5">
                <label
                  htmlFor="cpt-mdp-actuel"
                  className="text-[13.5px] font-semibold"
                >
                  Mot de passe actuel
                </label>
                <input
                  id="cpt-mdp-actuel"
                  type="password"
                  value={mdpActuel}
                  onChange={(e) => setMdpActuel(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={CHAMP_INPUT}
                />
              </div>
              <div className="grid gap-1.5">
                <label
                  htmlFor="cpt-mdp-nouveau"
                  className="text-[13.5px] font-semibold"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="cpt-mdp-nouveau"
                  type="password"
                  value={nouveauMdp}
                  onChange={(e) => setNouveauMdp(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={CHAMP_INPUT}
                />
              </div>
              <div className="grid gap-1.5">
                <label
                  htmlFor="cpt-mdp-confirm"
                  className="text-[13.5px] font-semibold"
                >
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="cpt-mdp-confirm"
                  type="password"
                  value={confirmationMdp}
                  onChange={(e) => setConfirmationMdp(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={CHAMP_INPUT}
                />
              </div>
              <button
                type="button"
                onClick={annulerChangementMdp}
                className="justify-self-start text-[13px] text-encre-3 underline underline-offset-4"
              >
                Annuler le changement de mot de passe
              </button>
            </div>
          )}

          {erreur && (
            <p role="alert" className="text-sm font-medium text-rouge">
              {erreur}
            </p>
          )}

          <div className="flex justify-end gap-2.5">
            <Bouton
              type="button"
              variant="fantome"
              onClick={() => setEdition(false)}
            >
              Annuler
            </Bouton>
            <Bouton type="submit" variant="cuivre" disabled={enCours}>
              {enCours ? "Enregistrement…" : "Enregistrer"}
            </Bouton>
          </div>
        </form>
      )}
    </div>
  );
}
