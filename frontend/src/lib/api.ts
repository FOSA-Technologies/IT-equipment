import { requete } from "@/lib/http";
import type {
  ClientDetail,
  CommandeCreee,
  CommandeDetail,
  LignePanier,
  Dashboard,
  MoyenPaiement,
  NouvelleCommande,
  PageClients,
  PageCommandes,
  Produit,
  ReponseConnexion,
  SaisieProduit,
  StatutCommande,
  VenteCreee,
} from "@/types";

/** Endpoints du backend, typés. Voir backend/README.md. */
export const api = {
  auth: {
    connexion: (email: string, motDePasse: string, resterConnecte: boolean) =>
      requete<ReponseConnexion>("/auth/login", {
        method: "POST",
        body: { email, motDePasse, resterConnecte },
      }),
  },

  produits: {
    liste: () => requete<Produit[]>("/produits"),
    creer: (saisie: SaisieProduit) =>
      requete<Produit>("/produits", {
        method: "POST",
        body: saisie,
        auth: true,
      }),
    modifier: (id: string, saisie: SaisieProduit) =>
      requete<Produit>(`/produits/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: saisie,
        auth: true,
      }),
    supprimer: (id: string) =>
      requete<void>(`/produits/${encodeURIComponent(id)}`, {
        method: "DELETE",
        auth: true,
      }),
  },

  commandes: {
    creer: (commande: NouvelleCommande) =>
      requete<CommandeCreee>("/commandes", { method: "POST", body: commande }),
    /** Propriétaire : liste paginée, filtrable par statut. */
    liste: (params: {
      statut?: StatutCommande;
      page: number;
      limit: number;
    }) => {
      const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      if (params.statut) query.set("statut", params.statut);
      return requete<PageCommandes>(`/commandes?${query}`, { auth: true });
    },
    detail: (reference: string) =>
      requete<CommandeDetail>(`/commandes/${encodeURIComponent(reference)}`, {
        auth: true,
      }),
    changerStatut: (reference: string, statut: StatutCommande) =>
      requete<CommandeDetail>(
        `/commandes/${encodeURIComponent(reference)}/statut`,
        { method: "PATCH", body: { statut }, auth: true },
      ),
    /** Encaissement au comptoir (espace propriétaire) : pas de coordonnées client. */
    creerVente: (paiement: MoyenPaiement, lignes: LignePanier[]) =>
      requete<VenteCreee>("/commandes/vente", {
        method: "POST",
        body: { paiement, lignes },
        auth: true,
      }),
  },

  clients: {
    liste: (params: { q?: string; page: number; limit: number }) => {
      const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      if (params.q) query.set("q", params.q);
      return requete<PageClients>(`/clients?${query}`, { auth: true });
    },
    detail: (email: string) =>
      requete<ClientDetail>(`/clients/${encodeURIComponent(email)}`, {
        auth: true,
      }),
  },

  dashboard: {
    obtenir: () => requete<Dashboard>("/dashboard", { auth: true }),
  },
};
