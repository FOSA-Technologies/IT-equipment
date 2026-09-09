import { formatPrix } from "@/domain/format";

interface CommandeRecente {
  ref: string;
  client: string;
  date: string;
  total: number;
  statut: "Payée" | "En préparation" | "Expédiée";
}

const COMMANDES: CommandeRecente[] = [
  { ref: "CMD-2026-0847", client: "Léa Marchand", date: "8 sept.", total: 247.9, statut: "Payée" },
  { ref: "CMD-2026-0846", client: "Karim Bensaid", date: "8 sept.", total: 119.9, statut: "En préparation" },
  { ref: "CMD-2026-0845", client: "Julie Petit", date: "7 sept.", total: 398.9, statut: "Expédiée" },
  { ref: "CMD-2026-0844", client: "Thomas Herlin", date: "7 sept.", total: 64.9, statut: "Payée" },
  { ref: "CMD-2026-0843", client: "Atelier Pixel", date: "6 sept.", total: 1037.6, statut: "Payée" },
];

const STYLES_STATUT: Record<
  CommandeRecente["statut"],
  { pilule: string; point: string }
> = {
  Payée: { pilule: "bg-vert-fond text-vert", point: "bg-vert" },
  "En préparation": { pilule: "bg-ambre-fond text-ambre", point: "bg-ambre" },
  Expédiée: { pilule: "bg-illu text-encre-2", point: "bg-encre-3" },
};

/** Tableau des cinq commandes les plus récentes (données fictives). */
export function RecentOrders() {
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
          {COMMANDES.map((commande) => {
            const style = STYLES_STATUT[commande.statut];
            return (
              <tr key={commande.ref} className="border-b border-ligne last:border-b-0">
                <td className="px-3.5 py-4 font-mono text-xs text-encre-3">
                  {commande.ref}
                </td>
                <td className="px-3.5 py-4 text-[14.5px]">{commande.client}</td>
                <td className="px-3.5 py-4 text-[14.5px]">{commande.date}</td>
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
