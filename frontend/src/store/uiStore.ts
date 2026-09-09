import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
}

interface UiState {
  toasts: Toast[];
  afficherToast: (message: string) => void;
  retirerToast: (id: number) => void;
}

let prochainId = 1;

/** État d'interface global : notifications (toasts). */
export const useUiStore = create<UiState>((set) => ({
  toasts: [],

  afficherToast: (message) =>
    set((etat) => ({
      toasts: [...etat.toasts, { id: prochainId++, message }],
    })),

  retirerToast: (id) =>
    set((etat) => ({
      toasts: etat.toasts.filter((t) => t.id !== id),
    })),
}));
