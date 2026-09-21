import { requete } from "@/lib/http";
import type {
  CommandeCreee,
  Dashboard,
  NouvelleCommande,
  Produit,
  ReponseConnexion,
  SaisieProduit,
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
  },

  dashboard: {
    obtenir: () => requete<Dashboard>("/dashboard", { auth: true }),
  },
};
