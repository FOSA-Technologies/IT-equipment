import { useEffect, type ReactNode } from "react";

interface ModalProps {
  ouvert: boolean;
  onFermer: () => void;
  titreId: string;
  largeur?: "normale" | "petite";
  children: ReactNode;
}

/** Fenêtre modale accessible : fermeture par Échap ou clic sur le voile. */
export function Modal({
  ouvert,
  onFermer,
  titreId,
  largeur = "normale",
  children,
}: ModalProps) {
  useEffect(() => {
    if (!ouvert) return;
    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  const largeurClasse = largeur === "petite" ? "w-[420px]" : "w-[520px]";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-sombre/45 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFermer();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titreId}
        className={`max-h-[90vh] max-w-full overflow-auto rounded-xl bg-white p-7 ${largeurClasse}`}
      >
        {children}
      </div>
    </div>
  );
}
