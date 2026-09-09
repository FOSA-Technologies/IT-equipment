/**
 * Motif signature du site : une trace de circuit imprimé (ligne cuivre
 * terminée par deux pastilles de soudure), placée au-dessus des titres.
 */
export function Trace({ className = "w-14" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative mb-3.5 h-0.5 bg-cuivre before:absolute before:-left-0.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-cuivre before:content-[''] after:absolute after:-right-0.5 after:top-1/2 after:h-1.5 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-cuivre after:content-[''] ${className}`}
    />
  );
}
