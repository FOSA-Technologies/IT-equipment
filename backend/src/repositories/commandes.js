import { transaction } from "../db/index.js";
import {
  STATUT_INITIAL,
  dateLivraisonEstimee,
} from "../domain/commandes.js";
import { arrondir, jourLocal } from "../utils/dates.js";
import { HttpError, notFound } from "../utils/httpError.js";

const versCommande = (r, lignes) => ({
  reference: r.reference,
  statut: r.statut,
  email: r.email,
  tel: r.tel,
  nom: r.nom,
  adresse: r.adresse,
  cp: r.cp,
  ville: r.ville,
  paiement: r.paiement,
  nbArticles: r.nb_articles,
  total: r.total,
  creeLe: r.cree_le,
  ...(lignes && { lignes }),
});

const versLigne = (l) => ({
  produitId: l.produit_id,
  ref: l.ref,
  nom: l.nom,
  prixUnitaire: l.prix_unitaire,
  quantite: l.quantite,
});

export function createCommandesRepo(db, { timezone }) {
  const selectProduit = db.prepare("SELECT * FROM produits WHERE id = ?");
  const decrementer = db.prepare(
    "UPDATE produits SET stock = stock - @quantite, modifie_le = @now WHERE id = @id AND stock >= @quantite",
  );
  const dernierNumero = db.prepare(
    "SELECT MAX(CAST(substr(reference, 10) AS INTEGER)) AS n FROM commandes WHERE reference LIKE ?",
  );
  const insertCommande = db.prepare(`
    INSERT INTO commandes (reference, email, tel, nom, adresse, cp, ville, paiement, statut, total, nb_articles, cree_le)
    VALUES (@reference, @email, @tel, @nom, @adresse, @cp, @ville, @paiement, @statut, @total, @nbArticles, @creeLe)
  `);
  const insertLigne = db.prepare(`
    INSERT INTO commande_lignes (commande_id, produit_id, ref, nom, prix_unitaire, quantite)
    VALUES (@commandeId, @produitId, @ref, @nom, @prixUnitaire, @quantite)
  `);
  const selectByRef = db.prepare("SELECT * FROM commandes WHERE reference = ?");
  const selectLignes = db.prepare("SELECT * FROM commande_lignes WHERE commande_id = ? ORDER BY id");
  const updateStatut = db.prepare("UPDATE commandes SET statut = ? WHERE reference = ?");

  /**
   * Crée une commande dans une transaction : les prix viennent de la base (jamais
   * du client), le stock est vérifié puis décrémenté, la référence est séquentielle.
   */
  const creer = transaction(db, (saisie, maintenant) => {
    const quantites = new Map();
    for (const l of saisie.lignes) {
      quantites.set(l.produitId, (quantites.get(l.produitId) ?? 0) + l.quantite);
    }

    const problemes = [];
    const retenues = [];
    for (const [produitId, quantite] of quantites) {
      const produit = selectProduit.get(produitId);
      if (!produit) {
        problemes.push({ produitId, raison: "introuvable" });
      } else if (produit.stock < quantite) {
        problemes.push({ produitId, raison: "stock_insuffisant", disponible: produit.stock, demande: quantite });
      } else {
        retenues.push({ produit, quantite });
      }
    }
    if (problemes.length > 0) {
      throw new HttpError(
        409,
        "STOCK_INDISPONIBLE",
        "Certains articles sont introuvables ou en stock insuffisant.",
        problemes,
      );
    }

    const now = maintenant.toISOString();
    for (const { produit, quantite } of retenues) {
      const res = decrementer.run({ id: produit.id, quantite, now });
      if (res.changes !== 1) {
        throw new HttpError(409, "STOCK_INDISPONIBLE", "Stock insuffisant.", [
          { produitId: produit.id, raison: "stock_insuffisant" },
        ]);
      }
    }

    const annee = jourLocal(maintenant, timezone).slice(0, 4);
    const { n } = dernierNumero.get(`CMD-${annee}-%`);
    const reference = `CMD-${annee}-${String((n ?? 0) + 1).padStart(4, "0")}`;

    const total = arrondir(retenues.reduce((s, { produit, quantite }) => s + produit.prix * quantite, 0));
    const nbArticles = retenues.reduce((s, { quantite }) => s + quantite, 0);

    const { lastInsertRowid } = insertCommande.run({
      reference,
      email: saisie.email,
      tel: saisie.tel ?? "",
      nom: saisie.nom,
      adresse: saisie.adresse,
      cp: saisie.cp,
      ville: saisie.ville,
      paiement: saisie.paiement,
      statut: saisie.statut ?? STATUT_INITIAL,
      total,
      nbArticles,
      creeLe: now,
    });
    for (const { produit, quantite } of retenues) {
      insertLigne.run({
        commandeId: lastInsertRowid,
        produitId: produit.id,
        ref: produit.ref,
        nom: produit.nom,
        prixUnitaire: produit.prix,
        quantite,
      });
    }
    return reference;
  });

  const get = (reference) => {
    const row = selectByRef.get(reference);
    if (!row) return null;
    return versCommande(row, selectLignes.all(row.id).map(versLigne));
  };

  return {
    /** Crée la commande et renvoie sa représentation complète. */
    creer(saisie, maintenant = new Date()) {
      const reference = creer(saisie, maintenant);
      return { ...get(reference), livraisonEstimee: dateLivraisonEstimee(maintenant) };
    },

    get,

    liste({ statut, page, limit }) {
      const where = statut ? "WHERE statut = ?" : "";
      const params = statut ? [statut] : [];
      const total = db.prepare(`SELECT COUNT(*) AS n FROM commandes ${where}`).get(...params).n;
      const rows = db
        .prepare(`SELECT * FROM commandes ${where} ORDER BY cree_le DESC, id DESC LIMIT ? OFFSET ?`)
        .all(...params, limit, (page - 1) * limit);
      return { items: rows.map((r) => versCommande(r)), total, page, limit };
    },

    changerStatut(reference, statut) {
      if (updateStatut.run(statut, reference).changes === 0) throw notFound("Commande introuvable");
      return get(reference);
    },

    /** Commandes (date, total) créées depuis `depuisIso`, pour le dashboard. */
    depuis: (depuisIso) =>
      db.prepare("SELECT cree_le, total FROM commandes WHERE cree_le >= ?").all(depuisIso),

    recentes: (n) =>
      db.prepare("SELECT * FROM commandes ORDER BY cree_le DESC, id DESC LIMIT ?").all(n).map((r) => versCommande(r)),
  };
}
