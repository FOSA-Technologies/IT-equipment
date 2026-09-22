import { useEffect, useState } from "react";

import { StatutPilule } from "@/components/admin/StatutPilule";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { formatPrix } from "@/domain/format";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import type { ClientDetail } from "@/types";

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });
const FORMAT_DATE_HEURE = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

interface ClientDetailModalProps {
  /** E-mail du client à afficher ; null = modale fermée. */
  email: string | null;
  onFermer: () => void;
  /** Ouvre le détail d'une commande (modale gérée par la page parente). */
  onOuvrirCommande: (reference: string) => void;
}

function Stat({ etiquette, valeur }: { etiquette: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-ligne bg-illu px-3.5 py-3">
      <p className="text-[12px] text-encre-3">{etiquette}</p>
      <p className="mt-0.5 font-mono text-[15px] font-semibold">{valeur}</p>
    </div>
  );
}

/** Fiche client : coordonnées, statistiques et historique de ses commandes. */
export function ClientDetailModal({
  email,
  onFermer,
  onOuvrirCommande,
}: ClientDetailModalProps) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    let annule = false;
    setClient(null);
    setErreur(null);
    api.clients
      .detail(email)
      .then((c) => {
        if (!annule) setClient(c);
      })
      .catch((e: unknown) => {
        if (!annule) setErreur(messageErreur(e));
      });
    return () => {
      annule = true;
    };
  }, [email]);

  return (
    <Modal
      ouvert={email !== null}
      onFermer={onFermer}
      titreId="titre-detail-client"
      largeur="large"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 id="titre-detail-client" className="text-[19px] font-bold">
            {client?.nom ?? "Fiche client"}
          </h2>
          {client && (
            <a
              href={`mailto:${client.email}`}
              className="text-[13.5px] text-cuivre underline underline-offset-4"
            >
              {client.email}
            </a>
          )}
        </div>
        <BoutonIcone onClick={onFermer} aria-label="Fermer">
          <Icon name="croix" />
        </BoutonIcone>
      </div>

      {erreur && (
        <p role="alert" className="text-sm font-medium text-rouge">
          {erreur}
        </p>
      )}
      {!erreur && !client && (
        <p className="text-sm text-encre-2">Chargement…</p>
      )}

      {client && (
        <>
          <div className="mb-5 grid grid-cols-4 gap-3 max-sm:grid-cols-2">
            <Stat etiquette="Commandes" valeur={String(client.nbCommandes)} />
            <Stat
              etiquette="Total dépensé"
              valeur={formatPrix(client.totalDepense)}
            />
            <Stat
              etiquette="Client depuis"
              valeur={FORMAT_DATE.format(new Date(client.premiereCommande))}
            />
            <Stat etiquette="Téléphone" valeur={client.tel || "—"} />
          </div>

          <h3 className="mb-2.5 text-[14.5px] font-bold">
            Historique des commandes
          </h3>
          <div className="overflow-x-auto rounded-[10px] border border-ligne">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Référence", "Date", "Articles", "Total", "Statut", ""].map(
                    (entete, i) => (
                      <th
                        key={i}
                        className="border-b border-ligne px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-encre-3"
                      >
                        {entete}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {client.commandes.map((c) => (
                  <tr
                    key={c.reference}
                    className="border-b border-ligne last:border-b-0"
                  >
                    <td className="px-3.5 py-3 font-mono text-xs text-encre-3">
                      {c.reference}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-[14px]">
                      {FORMAT_DATE_HEURE.format(new Date(c.creeLe))}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-[14px]">
                      {c.nbArticles}
                    </td>
                    <td className="px-3.5 py-3 font-mono font-semibold">
                      {formatPrix(c.total)}
                    </td>
                    <td className="px-3.5 py-3">
                      <StatutPilule statut={c.statut} />
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOuvrirCommande(c.reference)}
                        className="text-[13px] text-cuivre underline underline-offset-4"
                      >
                        Détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
