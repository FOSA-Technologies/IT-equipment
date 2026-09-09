import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

import { formatPrix } from "@/domain/format";

interface VenteJour {
  jour: string;
  valeur: number;
}

const VENTES: VenteJour[] = [
  { jour: "Mer 3", valeur: 420 },
  { jour: "Jeu 4", valeur: 680 },
  { jour: "Ven 5", valeur: 540 },
  { jour: "Sam 6", valeur: 910 },
  { jour: "Dim 7", valeur: 720 },
  { jour: "Lun 8", valeur: 1150 },
  { jour: "Auj.", valeur: 830 },
];

const LARGEUR = 640;
const HAUTEUR = 210;
const MARGES = { haut: 18, droite: 12, bas: 30, gauche: 44 };
const MAX = 1200;
const LARGEUR_BARRE = 46;
const PIC = 1150;

/** Graphique des ventes sur 7 jours, dessiné en SVG (sans dépendance). */
export function SalesChart() {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<{
    x: number;
    y: number;
    libelle: string;
  } | null>(null);

  const plotW = LARGEUR - MARGES.gauche - MARGES.droite;
  const plotH = HAUTEUR - MARGES.haut - MARGES.bas;
  const yBase = MARGES.haut + plotH;
  const largeurColonne = plotW / VENTES.length;

  function survoler(e: ReactMouseEvent<SVGPathElement>, vente: VenteJour) {
    const rect = conteneurRef.current?.getBoundingClientRect();
    if (!rect) return;
    setInfo({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      libelle: `${vente.jour} — ${formatPrix(vente.valeur)}`,
    });
  }

  return (
    <div ref={conteneurRef} className="relative">
      <svg
        viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
        className="h-auto w-full"
        role="img"
        aria-label="Ventes des sept derniers jours, en euros"
      >
        {[0, 400, 800, MAX].map((v) => {
          const y = MARGES.haut + plotH - (v / MAX) * plotH;
          return (
            <g key={v}>
              <line
                x1={MARGES.gauche}
                y1={y}
                x2={LARGEUR - MARGES.droite}
                y2={y}
                stroke="#E3E6EB"
                strokeWidth="1"
              />
              <text
                x={MARGES.gauche - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-encre-3 font-mono text-[11px]"
              >
                {v}
              </text>
            </g>
          );
        })}

        {VENTES.map((vente, i) => {
          const x =
            MARGES.gauche + i * largeurColonne + (largeurColonne - LARGEUR_BARRE) / 2;
          const yH = MARGES.haut + plotH - (vente.valeur / MAX) * plotH;
          const estPartielle = i === VENTES.length - 1;

          return (
            <g key={vente.jour}>
              <path
                d={`M${x} ${yBase} V${yH + 4} Q${x} ${yH} ${x + 4} ${yH} H${x + 42} Q${x + 46} ${yH} ${x + 46} ${yH + 4} V${yBase} Z`}
                className={
                  estPartielle
                    ? "fill-cuivre-pale transition-colors hover:fill-cuivre-fonce"
                    : "fill-cuivre transition-colors hover:fill-cuivre-fonce"
                }
                onMouseMove={(e) => survoler(e, vente)}
                onMouseLeave={() => setInfo(null)}
              />
              {vente.valeur === PIC && (
                <text
                  x={x + 23}
                  y={yH - 8}
                  textAnchor="middle"
                  className="fill-encre font-mono text-[11px] font-semibold"
                >
                  1 150 €
                </text>
              )}
              <text
                x={x + 23}
                y={yBase + 18}
                textAnchor="middle"
                className="fill-encre-3 font-mono text-[11px]"
              >
                {vente.jour}
              </text>
            </g>
          );
        })}
      </svg>

      {info && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[115%] whitespace-nowrap rounded-md bg-sombre px-2.5 py-1.5 font-mono text-xs text-white"
          style={{ left: info.x, top: info.y }}
        >
          {info.libelle}
        </div>
      )}
    </div>
  );
}
