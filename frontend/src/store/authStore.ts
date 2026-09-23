import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  email: string | null;
  nom: string | null;
  ouvrirSession: (token: string, email: string, nom: string) => void;
  seDeconnecter: () => void;
  /** Reflète un changement de nom (PATCH /auth/me) sans rouvrir de session. */
  definirNom: (nom: string) => void;
}

interface EtatPersisteAnterieur {
  token?: string | null;
  email?: string | null;
  nom?: string | null;
}

/**
 * Session du propriétaire : jeton JWT délivré par le backend, conservé en
 * localStorage. Un jeton expiré est détecté par l'API (401), qui déconnecte.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      nom: null,
      ouvrirSession: (token, email, nom) => set({ token, email, nom }),
      seDeconnecter: () => set({ token: null, email: null, nom: null }),
      definirNom: (nom) => set({ nom }),
    }),
    {
      name: "it-equipment-auth",
      version: 3,
      migrate: (persiste, version) => {
        // v1 (authentification fictive) : on repart d'une session vide.
        if (version < 2) return { token: null, email: null, nom: null };
        // v2 : session valide, sans nom (champ ajouté en v3) — conservée telle quelle.
        const anterieur = persiste as EtatPersisteAnterieur;
        return {
          token: anterieur.token ?? null,
          email: anterieur.email ?? null,
          nom: anterieur.nom ?? null,
        };
      },
    },
  ),
);
