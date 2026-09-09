import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PRODUITS_INITIAUX } from "@/data/produits";
import { idDepuisReference } from "@/domain/catalogue";
import type { Produit, SaisieProduit } from "@/types";

interface CatalogueState {
  produits: Produit[];
  ajouterProduit: (saisie: SaisieProduit) => void;
  modifierProduit: (id: string, saisie: SaisieProduit) => void;
  supprimerProduit: (id: string) => void;
}

/**
 * Catalogue partagé entre la boutique (lecture) et la gestion
 * propriétaire (écriture). Persisté en localStorage tant que le
 * backend n'existe pas.
 */
export const useCatalogueStore = create<CatalogueState>()(
  persist(
    (set) => ({
      produits: PRODUITS_INITIAUX,

      ajouterProduit: (saisie) =>
        set((etat) => ({
          produits: [
            {
              ...saisie,
              id: idDepuisReference(saisie.ref),
              spec: "Nouveau produit",
              illu: "ssd",
              fiche: { Garantie: "2 ans" },
            },
            ...etat.produits,
          ],
        })),

      modifierProduit: (id, saisie) =>
        set((etat) => ({
          produits: etat.produits.map((p) =>
            p.id === id ? { ...p, ...saisie } : p,
          ),
        })),

      supprimerProduit: (id) =>
        set((etat) => ({
          produits: etat.produits.filter((p) => p.id !== id),
        })),
    }),
    { name: "it-equipment-catalogue", version: 1 },
  ),
);
