import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

import { formatPrix } from "@/domain/format";
import type { Dashboard } from "@/types";

type VenteJour = Dashboard["ventes7Jours"][number];

const LARGEUR = 640;
const HAUTEUR = 210;
const MARGES = { haut: 18, droite: 12, bas: 30, gauche: 44 };
const LARGEUR_BARRE = 46;
const NB_GRADUATIONS = 3;

const FORMAT_JOUR = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
});
const FORMAT_ENTIER = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/** « 2026-09-16 » → « Mer 16 » ; le dernier jour (partiel) devient « Auj. ». */
function libelleJour(date: string, estAujourdhui: boolean): string {
  if (estAujourdhui) return "Auj.";
  const texte = FORMAT_JOUR.format(new Date(`${date}T12:00:00`))
    .replace(".", "")
    .replace(/^./, (c) => c.toUpperCase());
  return texte;
}

/** Pas « rond » de graduation tel que NB_GRADUATIONS pas couvrent `max`. */
function pasGraduation(max: number): number {
  if (max <= 0) return 100;
  const brut = max / NB_GRADUATIONS;
  const puissance = 10 ** Math.floor(Math.log10(brut));
  const multiple = [1, 1.5, 2, 2.5, 3, 4, 5, 10].find(
    (m) => m * puissance >= brut,
  );
  return (multiple ?? 10) * puissance;
}

interface SalesChartProps {
  ventes: VenteJour[];
}

/** Graphique des ventes sur 7 jours, dessiné en SVG (sans dépendance). */
export function SalesChart({ ventes }: SalesChartProps) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<{
    x: number;
    y: number;
    libelle: string;
  } | null>(null);

  const maxValeur = Math.max(0, ...ventes.map((v) => v.valeur));
  const pas = pasGraduation(maxValeur);
  const plafond = pas * NB_GRADUATIONS;
  const graduations = Array.from({ length: NB_GRADUATIONS + 1 }, (_, i) => i * pas);

  const plotW = LARGEUR - MARGES.gauche - MARGES.droite;
  const plotH = HAUTEUR - MARGES.haut - MARGES.bas;
  const yBase = MARGES.haut + plotH;
  const largeurColonne = plotW / Math.max(ventes.length, 1);

  function survoler(e: ReactMouseEvent<SVGPathElement>, libelle: string) {
    const rect = conteneurRef.current?.getBoundingClientRect();
    if (!rect) return;
    setInfo({ x: e.clientX - rect.left, y: e.clientY - rect.top, libelle });
  }

  return (
    <div ref={conteneurRef} className="relative">
      <svg
        viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
        className="h-auto w-full"
        role="img"
        aria-label="Ventes des sept derniers jours, en euros"
      >
        {graduations.map((v) => {
          const y = yBase - (v / plafond) * plotH;
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
                {FORMAT_ENTIER.format(v)}
              </text>
            </g>
          );
        })}

        {ventes.map((vente, i) => {
          const estPartielle = i === ventes.length - 1;
          const jour = libelleJour(vente.date, estPartielle);
          const x =
            MARGES.gauche + i * largeurColonne + (largeurColonne - LARGEUR_BARRE) / 2;
          const yH = yBase - (vente.valeur / plafond) * plotH;
          const estPic = vente.valeur > 0 && vente.valeur === maxValeur;

          return (
            <g key={vente.date}>
              {vente.valeur > 0 && (
                <path
                  d={`M${x} ${yBase} V${yH + 4} Q${x} ${yH} ${x + 4} ${yH} H${x + 42} Q${x + 46} ${yH} ${x + 46} ${yH + 4} V${yBase} Z`}
                  className={
                    estPartielle
                      ? "fill-cuivre-pale transition-colors hover:fill-cuivre-fonce"
                      : "fill-cuivre transition-colors hover:fill-cuivre-fonce"
                  }
                  onMouseMove={(e) =>
                    survoler(e, `${jour} — ${formatPrix(vente.valeur)}`)
                  }
                  onMouseLeave={() => setInfo(null)}
                />
              )}
              {estPic && (
                <text
                  x={x + 23}
                  y={yH - 8}
                  textAnchor="middle"
                  className="fill-encre font-mono text-[11px] font-semibold"
                >
                  {FORMAT_ENTIER.format(vente.valeur)} €
                </text>
              )}
              <text
                x={x + 23}
                y={yBase + 18}
                textAnchor="middle"
                className="fill-encre-3 font-mono text-[11px]"
              >
                {jour}
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
