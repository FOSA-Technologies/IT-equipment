import { StatutPilule } from "@/components/admin/StatutPilule";
import { formatPrix } from "@/domain/format";
import type { CommandeRecente } from "@/types";

const FORMAT_JOUR = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

interface RecentOrdersProps {
  commandes: CommandeRecente[];
}

/** Tableau des commandes les plus récentes. */
export function RecentOrders({ commandes }: RecentOrdersProps) {
  if (commandes.length === 0) {
    return (
      <p className="text-sm text-encre-2">Aucune commande pour le moment.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Référence", "Client", "Date", "Total", "Statut"].map(
              (entete) => (
                <th
                  key={entete}
                  className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
                >
                  {entete}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => {
            return (
              <tr
                key={commande.reference}
                className="border-b border-ligne last:border-b-0"
              >
                <td className="px-3.5 py-4 font-mono text-xs text-encre-3">
                  {commande.reference}
                </td>
                <td className="px-3.5 py-4 text-[14.5px]">{commande.client}</td>
                <td className="px-3.5 py-4 text-[14.5px]">
                  {FORMAT_JOUR.format(new Date(commande.date))}
                </td>
                <td className="px-3.5 py-4 font-mono font-semibold">
                  {formatPrix(commande.total)}
                </td>
                <td className="px-3.5 py-4">
                  <StatutPilule statut={commande.statut} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
