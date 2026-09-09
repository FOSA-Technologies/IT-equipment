import type { ReactNode } from "react";

export type IconName =
  | "loupe"
  | "panier"
  | "plus"
  | "moins"
  | "croix"
  | "stylo"
  | "poubelle"
  | "check"
  | "utilisateur"
  | "colis"
  | "bouclier"
  | "retour"
  | "clavier"
  | "disque"
  | "ram"
  | "ecran"
  | "souris"
  | "chip"
  | "carte"
  | "banque"
  | "chevron";

const TRACES: Record<IconName, ReactNode> = {
  loupe: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  panier: (
    <>
      <path d="M3 4h2l2.3 12.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21.6 8H6.2" />
      <circle cx="9.5" cy="21" r="1.6" />
      <circle cx="17" cy="21" r="1.6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  moins: <path d="M5 12h14" />,
  croix: <path d="M6 6l12 12M18 6 6 18" />,
  stylo: <path d="M17 3l4 4L8 20l-5 1 1-5z" />,
  poubelle: <path d="M4 7h16M9 7V5h6v2M6.5 7l.8 13h9.4l.8-13M10 11v6M14 11v6" />,
  check: <path d="M5 13l4 4L19 7" />,
  utilisateur: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c1.6-4.2 4.4-6 7.5-6s5.9 1.8 7.5 6" />
    </>
  ),
  colis: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
    </>
  ),
  bouclier: (
    <>
      <path d="M12 3l7 3v5c0 4.6-2.9 8-7 10-4.1-2-7-5.4-7-10V6z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  retour: (
    <>
      <path d="M4 10h13a4 4 0 0 1 0 8h-4" />
      <path d="M8 6 4 10l4 4" />
    </>
  ),
  clavier: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M6 9h.01M9.5 9h.01M13 9h.01M16.5 9h.01M6 12h.01M9.5 12h.01M13 12h.01M16.5 12h.01M7.5 15h9" />
    </>
  ),
  disque: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="2.4" />
      <path d="M13 15.5h5M13 11.5h3" />
    </>
  ),
  ram: (
    <>
      <rect x="2.5" y="9" width="19" height="6" rx="1.5" />
      <path d="M5.5 11h1.6M8.9 11h1.6M12.3 11h1.6M15.7 11h1.6M19.1 11h1.6" />
    </>
  ),
  ecran: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </>
  ),
  souris: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="5" />
      <path d="M12 3v5" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
  carte: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  banque: (
    <>
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M5.5 12v6M10 12v6M14 12v6M18.5 12v6M3 21h18" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
};

interface IconProps {
  name: IconName;
  className?: string;
}

/** Icône de trait, hérite de la couleur du texte (currentColor). */
export function Icon({ name, className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round] ${className}`}
    >
      {TRACES[name]}
    </svg>
  );
}
