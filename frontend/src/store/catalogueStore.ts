import { create } from "zustand";

import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import type { Produit, SaisieProduit } from "@/types";

export type StatutCatalogue = "inactif" | "chargement" | "pret" | "erreur";

interface CatalogueState {
  produits: Produit[];
  statut: StatutCatalogue;
  erreur: string | null;
  /** (Re)charge le catalogue depuis l'API. */
  charger: () => Promise<void>;
  ajouterProduit: (saisie: SaisieProduit) => Promise<void>;
  modifierProduit: (id: string, saisie: SaisieProduit) => Promise<void>;
  supprimerProduit: (id: string) => Promise<void>;
}

let chargementEnCours: Promise<void> | null = null;

/**
 * Catalogue partagé entre la boutique (lecture) et la gestion propriétaire
 * (écriture). La source de vérité est le backend : le store en garde une copie.
 * Les mutations attendent la réponse de l'API avant de modifier l'état ;
 * en cas d'erreur elles la propagent à l'appelant.
 */
export const useCatalogueStore = create<CatalogueState>()((set, get) => ({
  produits: [],
  statut: "inactif",
  erreur: null,

  charger: () => {
    if (chargementEnCours) return chargementEnCours;
    if (get().statut !== "pret") set({ statut: "chargement", erreur: null });

    chargementEnCours = api.produits
      .liste()
      .then((produits) => set({ produits, statut: "pret", erreur: null }))
      .catch((e: unknown) =>
        // On garde les données déjà chargées si un rafraîchissement échoue.
        set((etat) => ({
          statut: etat.produits.length > 0 ? "pret" : "erreur",
          erreur: messageErreur(e),
        })),
      )
      .finally(() => {
        chargementEnCours = null;
      });
    return chargementEnCours;
  },

  ajouterProduit: async (saisie) => {
    const produit = await api.produits.creer(saisie);
    set((etat) => ({ produits: [produit, ...etat.produits] }));
  },

  modifierProduit: async (id, saisie) => {
    const produit = await api.produits.modifier(id, saisie);
    set((etat) => ({
      produits: etat.produits.map((p) => (p.id === id ? produit : p)),
    }));
  },

  supprimerProduit: async (id) => {
    await api.produits.supprimer(id);
    set((etat) => ({ produits: etat.produits.filter((p) => p.id !== id) }));
  },
}));
