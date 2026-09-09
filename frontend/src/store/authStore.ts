import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  connecte: boolean;
  seConnecter: () => void;
  seDeconnecter: () => void;
}

/**
 * Session du propriétaire. Authentification fictive en attendant le
 * backend : n'importe quel identifiant « fonctionne ».
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      connecte: false,
      seConnecter: () => set({ connecte: true }),
      seDeconnecter: () => set({ connecte: false }),
    }),
    { name: "it-equipment-auth", version: 1 },
  ),
);
