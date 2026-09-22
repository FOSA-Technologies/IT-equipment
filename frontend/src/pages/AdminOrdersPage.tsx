import { useCallback, useEffect, useState } from "react";

import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Bouton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import {
  STATUTS_COMMANDE,
  type PageCommandes,
  type StatutCommande,
} from "@/types";

const PAR_PAGE = 15;

/** Suivi des commandes : liste paginée, filtre par statut, détail. */
export function AdminOrdersPage() {
  const [statut, setStatut] = useState<StatutCommande | "">("");
  const [page, setPage] = useState(1);
  const [donnees, setDonnees] = useState<PageCommandes | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [rechargement, setRechargement] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;
    setErreur(null);
    api.commandes
      .liste({ statut: statut || undefined, page, limit: PAR_PAGE })
      .then((d) => {
        if (!annule) setDonnees(d);
      })
      .catch((e: unknown) => {
        if (!annule) setErreur(messageErreur(e));
      });
    return () => {
      annule = true;
    };
  }, [statut, page, rechargement]);

  const rafraichir = useCallback(() => setRechargement((n) => n + 1), []);
  const fermerDetail = useCallback(() => setSelection(null), []);

  const nbPages = donnees
    ? Math.max(1, Math.ceil(donnees.total / donnees.limit))
    : 1;

  return (
    <>
      <div className="mb-[26px] flex flex-wrap items-center gap-[18px]">
        <h1 className="text-[26px] font-bold">Commandes</h1>
        {donnees && (
          <span className="font-mono text-xs text-encre-3">
            {donnees.total} commande{donnees.total > 1 ? "s" : ""}
          </span>
        )}
        <select
          value={statut}
          onChange={(e) => {
            setStatut(e.target.value as StatutCommande | "");
            setPage(1);
          }}
          aria-label="Filtrer par statut"
          className="ml-auto h-[42px] rounded-lg border-[1.5px] border-ligne bg-white px-3.5 text-[14.5px] max-lg:ml-0"
        >
          <option value="">Tous les statuts</option>
          {STATUTS_COMMANDE.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {erreur ? (
        <EmptyState titre="Commandes indisponibles" texte={erreur}>
          <Bouton onClick={rafraichir}>Réessayer</Bouton>
        </EmptyState>
      ) : !donnees ? (
        <EmptyState titre="Chargement…" texte="Récupération des commandes." />
      ) : donnees.items.length === 0 ? (
        <EmptyState
          titre="Aucune commande"
          texte={
            statut
              ? "Aucune commande ne correspond à ce statut."
              : "Les commandes passées sur la boutique apparaîtront ici."
          }
        />
      ) : (
        <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
          <OrdersTable commandes={donnees.items} onOuvrir={setSelection} />

          {nbPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-ligne pt-4">
              <span className="mr-auto font-mono text-xs text-encre-3">
                Page {donnees.page} sur {nbPages}
              </span>
              <Bouton
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Précédent
              </Bouton>
              <Bouton
                disabled={page >= nbPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Bouton>
            </div>
          )}
        </div>
      )}

      <OrderDetailModal
        reference={selection}
        onFermer={fermerDetail}
        onModifiee={rafraichir}
      />
    </>
  );
}
