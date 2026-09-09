import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LignePanier } from "@/types";

interface PanierState {
  lignes: LignePanier[];
  ajouter: (produitId: string, quantite?: number) => void;
  incrementer: (produitId: string) => void;
  decrementer: (produitId: string) => void;
  retirer: (produitId: string) => void;
  vider: () => void;
}

/**
 * Panier du client. Les calculs (totaux, nombre d'articles) restent
 * dans domain/panier.ts ; ce store ne gère que l'état brut.
 */
export const usePanierStore = create<PanierState>()(
  persist(
    (set) => ({
      lignes: [],

      ajouter: (produitId, quantite = 1) =>
        set((etat) => {
          const existante = etat.lignes.find(
            (l) => l.produitId === produitId,
          );
          if (existante) {
            return {
              lignes: etat.lignes.map((l) =>
                l.produitId === produitId
                  ? { ...l, quantite: l.quantite + quantite }
                  : l,
              ),
            };
          }
          return {
            lignes: [...etat.lignes, { produitId, quantite }],
          };
        }),

      incrementer: (produitId) =>
        set((etat) => ({
          lignes: etat.lignes.map((l) =>
            l.produitId === produitId
              ? { ...l, quantite: l.quantite + 1 }
              : l,
          ),
        })),

      decrementer: (produitId) =>
        set((etat) => ({
          lignes: etat.lignes.map((l) =>
            l.produitId === produitId && l.quantite > 1
              ? { ...l, quantite: l.quantite - 1 }
              : l,
          ),
        })),

      retirer: (produitId) =>
        set((etat) => ({
          lignes: etat.lignes.filter((l) => l.produitId !== produitId),
        })),

      vider: () => set({ lignes: [] }),
    }),
    { name: "it-equipment-panier", version: 1 },
  ),
);
