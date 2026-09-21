import { formatPrix } from "@/domain/format";
import type { CommandeRecente } from "@/types";

const FORMAT_JOUR = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

const STYLES_STATUT: Record<
  CommandeRecente["statut"],
  { pilule: string; point: string }
> = {
  Payée: { pilule: "bg-vert-fond text-vert", point: "bg-vert" },
  "En préparation": { pilule: "bg-ambre-fond text-ambre", point: "bg-ambre" },
  Expédiée: { pilule: "bg-illu text-encre-2", point: "bg-encre-3" },
};

interface RecentOrdersProps {
  commandes: CommandeRecente[];
}

/** Tableau des commandes les plus récentes. */
export function RecentOrders({ commandes }: RecentOrdersProps) {
  if (commandes.length === 0) {
    return <p className="text-sm text-encre-2">Aucune commande pour le moment.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Référence", "Client", "Date", "Total", "Statut"].map((entete) => (
              <th
                key={entete}
                className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
              >
                {entete}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => {
            const style = STYLES_STATUT[commande.statut];
            return (
              <tr key={commande.reference} className="border-b border-ligne last:border-b-0">
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
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.75 py-1 text-[12.5px] font-medium ${style.pilule}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${style.point}`}
                      aria-hidden="true"
                    />
                    {commande.statut}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
