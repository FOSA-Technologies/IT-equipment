import { formatPrix } from "@/domain/format";
import type { Client } from "@/types";

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface ClientsTableProps {
  clients: Client[];
  onOuvrir: (email: string) => void;
}

/** Tableau des clients, agrégés par e-mail à partir de leurs commandes. */
export function ClientsTable({ clients, onOuvrir }: ClientsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[
              "Client",
              "Téléphone",
              "Commandes",
              "Total dépensé",
              "Dernier achat",
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
          {clients.map((c) => (
            <tr key={c.email} className="border-b border-ligne last:border-b-0">
              <td className="px-3.5 py-4">
                <p className="text-[14.5px] font-semibold">{c.nom}</p>
                <p className="text-xs text-encre-3">{c.email}</p>
              </td>
              <td className="px-3.5 py-4 text-[14.5px]">{c.tel || "—"}</td>
              <td className="px-3.5 py-4 font-mono text-[14.5px]">
                {c.nbCommandes}
              </td>
              <td className="px-3.5 py-4 font-mono font-semibold">
                {formatPrix(c.totalDepense)}
              </td>
              <td className="whitespace-nowrap px-3.5 py-4 text-[14.5px]">
                {FORMAT_DATE.format(new Date(c.derniereCommande))}
              </td>
              <td className="px-3.5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onOuvrir(c.email)}
                  aria-label={`Voir la fiche de ${c.nom}`}
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
