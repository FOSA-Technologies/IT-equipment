import { useEffect, useState, type FormEvent } from "react";

import { Bouton } from "@/components/ui/Button";
import { DEVISES } from "@/domain/format";
import { messageErreur } from "@/lib/http";
import { useParametresStore } from "@/store/parametresStore";
import { useUiStore } from "@/store/uiStore";
import type { DeviseCode } from "@/types";

const CHAMP_INPUT =
  "w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]";

/** Paramètres de la boutique : nom, ville, devise, taux de TVA. */
export function BoutiqueForm() {
  const boutique = useParametresStore((s) => s.boutique);
  const statut = useParametresStore((s) => s.statut);
  const enregistrer = useParametresStore((s) => s.enregistrer);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [devise, setDevise] = useState<DeviseCode>("EUR");
  const [tva, setTva] = useState("20");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  // Recopie les paramètres chargés dans le formulaire, une fois disponibles.
  useEffect(() => {
    if (!boutique) return;
    setNom(boutique.nom);
    setVille(boutique.ville);
    setDevise(boutique.devise);
    setTva(String(boutique.tva));
  }, [boutique]);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    if (enCours) return;
    const tvaNombre = Number.parseFloat(tva.replace(",", "."));
    if (
      !nom.trim() ||
      Number.isNaN(tvaNombre) ||
      tvaNombre < 0 ||
      tvaNombre > 100
    ) {
      setErreur(
        "Vérifiez le nom de la boutique et le taux de TVA (entre 0 et 100).",
      );
      return;
    }
    setEnCours(true);
    setErreur(null);
    try {
      await enregistrer({
        nom: nom.trim(),
        ville: ville.trim(),
        devise,
        tva: tvaNombre,
      });
      afficherToast("Paramètres de la boutique enregistrés");
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnCours(false);
    }
  }

  if (statut === "chargement" && !boutique) {
    return (
      <div className="rounded-[10px] border border-ligne bg-white p-[22px] text-[14.5px] text-encre-2">
        Chargement des paramètres…
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
      <h3 className="mb-4 text-base font-bold">Paramètres de la boutique</h3>
      <form
        onSubmit={soumettre}
        className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
      >
        <div className="grid gap-1.5">
          <label htmlFor="bt-nom" className="text-[13.5px] font-semibold">
            Nom de la boutique
          </label>
          <input
            id="bt-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className={CHAMP_INPUT}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="bt-ville" className="text-[13.5px] font-semibold">
            Ville
          </label>
          <input
            id="bt-ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Antananarivo, Madagascar"
            className={CHAMP_INPUT}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="bt-devise" className="text-[13.5px] font-semibold">
            Devise
          </label>
          <select
            id="bt-devise"
            value={devise}
            onChange={(e) => setDevise(e.target.value as DeviseCode)}
            className={CHAMP_INPUT}
          >
            {Object.entries(DEVISES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.libelle}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="bt-tva" className="text-[13.5px] font-semibold">
            TVA (%)
          </label>
          <input
            id="bt-tva"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={tva}
            onChange={(e) => setTva(e.target.value)}
            className={CHAMP_INPUT}
          />
        </div>

        {erreur && (
          <p
            role="alert"
            className="col-span-2 text-sm font-medium text-rouge max-sm:col-span-1"
          >
            {erreur}
          </p>
        )}

        <div className="col-span-2 max-sm:col-span-1">
          <Bouton type="submit" variant="cuivre" disabled={enCours}>
            {enCours ? "Enregistrement…" : "Enregistrer"}
          </Bouton>
        </div>
      </form>
    </div>
  );
}
