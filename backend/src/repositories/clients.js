import { arrondir } from "../utils/dates.js";

// L'e-mail n'est pas normalisé à la saisie (commandeSchema ne force pas la casse) :
// on regroupe donc par LOWER(email) pour qu'un même client ne soit jamais scindé.
const AGREGAT = `
  SELECT
    (SELECT email FROM commandes c2
       WHERE LOWER(c2.email) = LOWER(c1.email) ORDER BY cree_le DESC LIMIT 1) AS email,
    (SELECT nom FROM commandes c2
       WHERE LOWER(c2.email) = LOWER(c1.email) ORDER BY cree_le DESC LIMIT 1) AS nom,
    (SELECT tel FROM commandes c2
       WHERE LOWER(c2.email) = LOWER(c1.email) ORDER BY cree_le DESC LIMIT 1) AS tel,
    COUNT(*) AS nb_commandes,
    SUM(c1.total) AS total_depense,
    MIN(c1.cree_le) AS premiere_commande,
    MAX(c1.cree_le) AS derniere_commande
  FROM commandes c1
`;

const versClient = (r) => ({
  email: r.email,
  nom: r.nom,
  tel: r.tel,
  nbCommandes: r.nb_commandes,
  totalDepense: arrondir(r.total_depense),
  premiereCommande: r.premiere_commande,
  derniereCommande: r.derniere_commande,
});

const versCommande = (r) => ({
  reference: r.reference,
  statut: r.statut,
  total: r.total,
  nbArticles: r.nb_articles,
  creeLe: r.cree_le,
  adresse: r.adresse,
  cp: r.cp,
  ville: r.ville,
  paiement: r.paiement,
});

export function createClientsRepo(db) {
  const parCommande = db.prepare(
    "SELECT reference, statut, total, nb_articles, cree_le, adresse, cp, ville, paiement FROM commandes WHERE LOWER(email) = LOWER(?) ORDER BY cree_le DESC",
  );

  return {
    /** Liste agrégée des clients (un par e-mail), triée par activité récente. */
    liste({ q, page, limit }) {
      const where = q ? "WHERE LOWER(c1.email) LIKE ? OR LOWER(c1.nom) LIKE ?" : "";
      const params = q ? [`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`] : [];

      const total = db
        .prepare(`SELECT COUNT(DISTINCT LOWER(email)) AS n FROM commandes c1 ${where}`)
        .get(...params).n;

      const rows = db
        .prepare(
          `${AGREGAT} ${where} GROUP BY LOWER(c1.email) ORDER BY derniere_commande DESC LIMIT ? OFFSET ?`,
        )
        .all(...params, limit, (page - 1) * limit);

      return { items: rows.map(versClient), total, page, limit };
    },

    /** Détail d'un client (agrégats + historique de ses commandes), ou null. */
    detail(email) {
      const row = db
        .prepare(`${AGREGAT} WHERE LOWER(c1.email) = LOWER(?) GROUP BY LOWER(c1.email)`)
        .get(email);
      if (!row) return null;
      return { ...versClient(row), commandes: parCommande.all(email).map(versCommande) };
    },
  };
}
