import { useCallback, useEffect, useState } from "react";

import { ClientDetailModal } from "@/components/admin/ClientDetailModal";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { Bouton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import type { PageClients } from "@/types";

const PAR_PAGE = 15;
const DELAI_RECHERCHE = 300;

/** Clients : liste agrégée par e-mail, recherche, fiche détaillée. */
export function AdminClientsPage() {
  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [donnees, setDonnees] = useState<PageClients | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [rechargement, setRechargement] = useState(0);
  const [clientSelectionne, setClientSelectionne] = useState<string | null>(
    null,
  );
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<
    string | null
  >(null);

  // Recherche différée : évite une requête à chaque frappe.
  useEffect(() => {
    const minuterie = setTimeout(() => {
      setQ(recherche.trim());
      setPage(1);
    }, DELAI_RECHERCHE);
    return () => clearTimeout(minuterie);
  }, [recherche]);

  useEffect(() => {
    let annule = false;
    setErreur(null);
    api.clients
      .liste({ q: q || undefined, page, limit: PAR_PAGE })
      .then((d) => {
        if (!annule) setDonnees(d);
      })
      .catch((e: unknown) => {
        if (!annule) setErreur(messageErreur(e));
      });
    return () => {
      annule = true;
    };
  }, [q, page, rechargement]);

  const rafraichir = useCallback(() => setRechargement((n) => n + 1), []);
  const nbPages = donnees
    ? Math.max(1, Math.ceil(donnees.total / donnees.limit))
    : 1;

  return (
    <>
      <div className="mb-[26px] flex flex-wrap items-center gap-[18px]">
        <h1 className="text-[26px] font-bold">Clients</h1>
        {donnees && (
          <span className="font-mono text-xs text-encre-3">
            {donnees.total} client{donnees.total > 1 ? "s" : ""}
          </span>
        )}
        <span className="relative ml-auto w-[280px] max-w-full max-lg:ml-0 max-lg:w-full">
          <Icon
            name="loupe"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-encre-3"
          />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un client…"
            aria-label="Rechercher un client"
            className="h-[42px] w-full rounded-lg border-[1.5px] border-ligne bg-white pl-10 pr-3.5 text-[14.5px]"
          />
        </span>
      </div>

      {erreur ? (
        <EmptyState titre="Clients indisponibles" texte={erreur}>
          <Bouton onClick={rafraichir}>Réessayer</Bouton>
        </EmptyState>
      ) : !donnees ? (
        <EmptyState titre="Chargement…" texte="Récupération des clients." />
      ) : donnees.items.length === 0 ? (
        <EmptyState
          titre="Aucun client"
          texte={
            q
              ? "Aucun client ne correspond à cette recherche."
              : "Les clients apparaissent ici dès leur première commande."
          }
        />
      ) : (
        <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
          <ClientsTable
            clients={donnees.items}
            onOuvrir={setClientSelectionne}
          />

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

      <ClientDetailModal
        email={clientSelectionne}
        onFermer={() => setClientSelectionne(null)}
        onOuvrirCommande={setCommandeSelectionnee}
      />
      <OrderDetailModal
        reference={commandeSelectionnee}
        onFermer={() => setCommandeSelectionnee(null)}
        onModifiee={rafraichir}
      />
    </>
  );
}
