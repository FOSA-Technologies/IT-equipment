import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  email: string | null;
  ouvrirSession: (token: string, email: string) => void;
  seDeconnecter: () => void;
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
      ouvrirSession: (token, email) => set({ token, email }),
      seDeconnecter: () => set({ token: null, email: null }),
    }),
    {
      name: "it-equipment-auth",
      version: 2,
      // v1 (authentification fictive) : on repart d'une session vide.
      migrate: () => ({ token: null, email: null }),
    },
  ),
);
