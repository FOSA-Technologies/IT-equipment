import { useEffect } from "react";

import { useUiStore, type Toast } from "@/store/uiStore";

function ToastItem({ toast }: { toast: Toast }) {
  const retirerToast = useUiStore((s) => s.retirerToast);

  useEffect(() => {
    const minuterie = setTimeout(() => retirerToast(toast.id), 2400);
    return () => clearTimeout(minuterie);
  }, [toast.id, retirerToast]);

  return (
    <div
      role="status"
      className="rounded-lg bg-sombre px-[18px] py-[10px] text-sm text-white shadow-[0_8px_24px_rgba(30,33,39,0.25)]"
    >
      {toast.message}
    </div>
  );
}

/** Affiche les notifications globales, alimentées par uiStore. */
export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
