import { Router } from "express";

import { statutStock } from "../domain/catalogue.js";
import { requireAdmin } from "../middleware/auth.js";
import { arrondir, decalerJour, jourLocal, moisLocal, moisPrecedent } from "../utils/dates.js";

const variationPct = (valeur, precedent) =>
  precedent > 0 ? arrondir(((valeur - precedent) / precedent) * 100) : null;

/** Agrège les indicateurs du dashboard propriétaire. */
export function calculerDashboard({ produits, commandes, timezone, maintenant = new Date() }) {
  const moisCourant = moisLocal(maintenant, timezone);
  const moisPrec = moisPrecedent(moisCourant);
  const aujourdhui = jourLocal(maintenant, timezone);

  // 70 jours couvrent le mois précédent complet et les 7 derniers jours.
  const depuis = new Date(maintenant.getTime() - 70 * 24 * 3600 * 1000).toISOString();
  const lignes = commandes.depuis(depuis).map((c) => {
    const date = new Date(c.cree_le);
    return { total: c.total, jour: jourLocal(date, timezone), mois: moisLocal(date, timezone) };
  });

  const agreger = (mois) => {
    const doMois = lignes.filter((l) => l.mois === mois);
    const ca = arrondir(doMois.reduce((s, l) => s + l.total, 0));
    return { ca, nb: doMois.length, panierMoyen: doMois.length ? arrondir(ca / doMois.length) : 0 };
  };
  const courant = agreger(moisCourant);
  const precedent = agreger(moisPrec);

  const ventes7Jours = Array.from({ length: 7 }, (_, i) => {
    const date = decalerJour(aujourdhui, i - 6);
    const valeur = arrondir(lignes.filter((l) => l.jour === date).reduce((s, l) => s + l.total, 0));
    return { date, valeur };
  });

  const alertes = produits
    .list()
    .map((p) => ({ produit: p, statut: statutStock(p) }))
    .filter(({ statut }) => statut.niveau !== "disponible")
    .map(({ produit, statut }) => ({
      id: produit.id,
      ref: produit.ref,
      nom: produit.nom,
      cat: produit.cat,
      stock: produit.stock,
      niveau: statut.niveau,
    }));

  return {
    date: maintenant.toISOString(),
    tuiles: {
      caMois: { valeur: courant.ca, precedent: precedent.ca, variationPct: variationPct(courant.ca, precedent.ca) },
      commandes: { valeur: courant.nb, precedent: precedent.nb, variation: courant.nb - precedent.nb },
      panierMoyen: {
        valeur: courant.panierMoyen,
        precedent: precedent.panierMoyen,
        variationPct: variationPct(courant.panierMoyen, precedent.panierMoyen),
      },
      stockFaible: { valeur: alertes.length },
    },
    ventes7Jours,
    alertesStock: alertes,
    commandesRecentes: commandes.recentes(5).map((c) => ({
      reference: c.reference,
      client: c.nom,
      date: c.creeLe,
      total: c.total,
      statut: c.statut,
    })),
  };
}

export function dashboardRouter({ config, produits, commandes }) {
  const router = Router();
  router.get("/", requireAdmin(config), (_req, res) => {
    res.json(calculerDashboard({ produits, commandes, timezone: config.timezone }));
  });
  return router;
}
