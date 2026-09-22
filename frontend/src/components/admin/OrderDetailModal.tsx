import { useEffect, useState } from "react";

import { StatutPilule } from "@/components/admin/StatutPilule";
import { BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { LIBELLES_PAIEMENT } from "@/domain/commandes";
import { formatPrix } from "@/domain/format";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import { useUiStore } from "@/store/uiStore";
import {
  STATUTS_COMMANDE,
  type CommandeDetail,
  type StatutCommande,
} from "@/types";

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

interface OrderDetailModalProps {
  /** Référence de la commande à afficher ; null = modale fermée. */
  reference: string | null;
  onFermer: () => void;
  /** Appelé après un changement de statut, pour rafraîchir la liste. */
  onModifiee: () => void;
}

function Bloc({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-[12.5px] font-semibold text-encre-3">{titre}</p>
      <div className="text-[14.5px] leading-snug">{children}</div>
    </div>
  );
}

/** Détail d'une commande : client, livraison, lignes, changement de statut. */
export function OrderDetailModal({
  reference,
  onFermer,
  onModifiee,
}: OrderDetailModalProps) {
  const afficherToast = useUiStore((s) => s.afficherToast);
  const [commande, setCommande] = useState<CommandeDetail | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (!reference) return;
    let annule = false;
    setCommande(null);
    setErreur(null);
    api.commandes
      .detail(reference)
      .then((c) => {
        if (!annule) setCommande(c);
      })
      .catch((e: unknown) => {
        if (!annule) setErreur(messageErreur(e));
      });
    return () => {
      annule = true;
    };
  }, [reference]);

  async function changerStatut(statut: StatutCommande) {
    if (!commande || enCours || statut === commande.statut) return;
    setEnCours(true);
    try {
      setCommande(
        await api.commandes.changerStatut(commande.reference, statut),
      );
      afficherToast(`${commande.reference} — ${statut}`);
      onModifiee();
    } catch (e) {
      afficherToast(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Modal
      ouvert={reference !== null}
      onFermer={onFermer}
      titreId="titre-detail-commande"
      largeur="large"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="titre-detail-commande" className="text-[19px] font-bold">
          Commande <span className="font-mono text-[17px]">{reference}</span>
        </h2>
        <BoutonIcone onClick={onFermer} aria-label="Fermer">
          <Icon name="croix" />
        </BoutonIcone>
      </div>

      {erreur && (
        <p role="alert" className="text-sm font-medium text-rouge">
          {erreur}
        </p>
      )}
      {!erreur && !commande && (
        <p className="text-sm text-encre-2">Chargement…</p>
      )}

      {commande && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-ligne bg-illu px-4 py-3">
            <StatutPilule statut={commande.statut} />
            <span className="font-mono text-xs text-encre-3">
              {FORMAT_DATE.format(new Date(commande.creeLe))}
            </span>
            <label className="ml-auto flex items-center gap-2 text-sm text-encre-2">
              Changer le statut
              <select
                value={commande.statut}
                disabled={enCours}
                onChange={(e) =>
                  void changerStatut(e.target.value as StatutCommande)
                }
                className="rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2 text-sm text-encre"
              >
                {STATUTS_COMMANDE.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-4 max-sm:grid-cols-1">
            <Bloc titre="Client">
              {commande.nom}
              <br />
              <a
                href={`mailto:${commande.email}`}
                className="text-cuivre underline underline-offset-4"
              >
                {commande.email}
              </a>
              {commande.tel && (
                <>
                  <br />
                  {commande.tel}
                </>
              )}
            </Bloc>
            <Bloc titre="Livraison">
              {commande.adresse}
              <br />
              {commande.cp} {commande.ville}
            </Bloc>
            <Bloc titre="Paiement">{LIBELLES_PAIEMENT[commande.paiement]}</Bloc>
          </div>

          <div className="overflow-x-auto rounded-[10px] border border-ligne">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Produit", "Prix unitaire", "Qté", "Total"].map(
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
                {commande.lignes.map((l) => (
                  <tr
                    key={l.produitId}
                    className="border-b border-ligne last:border-b-0"
                  >
                    <td className="px-3.5 py-3">
                      <p className="text-[14.5px] font-semibold">{l.nom}</p>
                      <p className="font-mono text-xs text-encre-3">{l.ref}</p>
                    </td>
                    <td className="px-3.5 py-3 font-mono text-[14px]">
                      {formatPrix(l.prixUnitaire)}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-[14px]">
                      {l.quantite}
                    </td>
                    <td className="px-3.5 py-3 font-mono font-semibold">
                      {formatPrix(l.prixUnitaire * l.quantite)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3.5 flex justify-between font-semibold">
            <span>
              Total ({commande.nbArticles} article
              {commande.nbArticles > 1 ? "s" : ""})
            </span>
            <span className="font-mono text-[19px]">
              {formatPrix(commande.total)}
            </span>
          </p>
        </>
      )}
    </Modal>
  );
}
