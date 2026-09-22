import { StatutPilule } from "@/components/admin/StatutPilule";
import { formatPrix } from "@/domain/format";
import type { Commande } from "@/types";

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface OrdersTableProps {
  commandes: Commande[];
  onOuvrir: (reference: string) => void;
}

/** Tableau des commandes (côté propriétaire). Clic sur une ligne : détail. */
export function OrdersTable({ commandes, onOuvrir }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[
              "Référence",
              "Client",
              "Date",
              "Articles",
              "Total",
              "Statut",
              "",
            ].map((entete, i) => (
              <th
                key={i}
                className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
              >
                {entete}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {commandes.map((c) => (
            <tr
              key={c.reference}
              className="border-b border-ligne last:border-b-0"
            >
              <td className="px-3.5 py-4 font-mono text-xs text-encre-3">
                {c.reference}
              </td>
              <td className="px-3.5 py-4">
                <p className="text-[14.5px] font-semibold">{c.nom}</p>
                <p className="text-xs text-encre-3">{c.email}</p>
              </td>
              <td className="whitespace-nowrap px-3.5 py-4 text-[14.5px]">
                {FORMAT_DATE.format(new Date(c.creeLe))}
              </td>
              <td className="px-3.5 py-4 font-mono text-[14.5px]">
                {c.nbArticles}
              </td>
              <td className="px-3.5 py-4 font-mono font-semibold">
                {formatPrix(c.total)}
              </td>
              <td className="px-3.5 py-4">
                <StatutPilule statut={c.statut} />
              </td>
              <td className="px-3.5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onOuvrir(c.reference)}
                  aria-label={`Voir la commande ${c.reference}`}
                  className="text-[13.5px] text-cuivre underline underline-offset-4"
                >
                  Détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
