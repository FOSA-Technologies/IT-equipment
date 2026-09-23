import { create } from "zustand";

import { definirTauxTva } from "@/domain/commandes";
import { definirDevise } from "@/domain/format";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import type { ParametresBoutique } from "@/types";

type StatutParametres = "inactif" | "chargement" | "pret" | "erreur";

interface ParametresState {
  boutique: ParametresBoutique | null;
  statut: StatutParametres;
  erreur: string | null;
  charger: () => Promise<void>;
  enregistrer: (parametres: ParametresBoutique) => Promise<void>;
}

let chargementEnCours: Promise<void> | null = null;

/**
 * Paramètres de la boutique (nom, ville, devise, TVA), partagés par toute
 * l'application : `charger` met aussi à jour `formatPrix` et `decomposerTva`
 * (domain/format.ts, domain/commandes.ts) pour que les prix s'affichent
 * dans la bonne devise partout, sans avoir à passer la devise en paramètre.
 */
export const useParametresStore = create<ParametresState>()((set, get) => ({
  boutique: null,
  statut: "inactif",
  erreur: null,

  charger: () => {
    if (chargementEnCours) return chargementEnCours;
    if (get().statut !== "pret") set({ statut: "chargement", erreur: null });

    chargementEnCours = api.parametres
      .obtenirBoutique()
      .then((boutique) => {
        definirDevise(boutique.devise);
        definirTauxTva(boutique.tva);
        set({ boutique, statut: "pret", erreur: null });
      })
      .catch((e: unknown) =>
        set((etat) => ({
          statut: etat.boutique ? "pret" : "erreur",
          erreur: messageErreur(e),
        })),
      )
      .finally(() => {
        chargementEnCours = null;
      });
    return chargementEnCours;
  },

  enregistrer: async (parametres) => {
    const boutique = await api.parametres.definirBoutique(parametres);
    definirDevise(boutique.devise);
    definirTauxTva(boutique.tva);
    set({ boutique, statut: "pret" });
  },
}));
