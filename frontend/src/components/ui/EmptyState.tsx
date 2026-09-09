import type { ReactNode } from "react";

interface EmptyStateProps {
  titre: string;
  texte: string;
  children?: ReactNode;
}

/** État vide : explique la situation et propose une action. */
export function EmptyState({ titre, texte, children }: EmptyStateProps) {
  return (
    <div className="rounded-[10px] border border-dashed border-ligne bg-white px-6 py-16 text-center">
      <h2 className="mb-2 text-[22px] font-bold">{titre}</h2>
      <p className="mb-5 text-encre-2">{texte}</p>
      {children}
    </div>
  );
}
