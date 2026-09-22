import { Router } from "express";
import rateLimit from "express-rate-limit";

import { CLIENT_COMPTOIR } from "../domain/commandes.js";
import { requireAdmin } from "../middleware/auth.js";
import { parse } from "../middleware/validate.js";
import {
  commandeSchema,
  listeCommandesQuery,
  statutSchema,
  venteSchema,
} from "../schemas.js";
import { HttpError, notFound } from "../utils/httpError.js";

export function commandesRouter({ config, commandes }) {
  const router = Router();
  const admin = requireAdmin(config);

  const limiteur = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => config.nodeEnv === "test",
    handler: (_req, _res, next) =>
      next(
        new HttpError(
          429,
          "TROP_DE_REQUETES",
          "Trop de commandes, réessayez plus tard.",
        ),
      ),
  });

  // Public : passage de commande depuis la boutique.
  router.post("/", limiteur, (req, res) => {
    const commande = commandes.creer(parse(commandeSchema, req.body));
    res.status(201).json(commande);
  });

  // Vente au comptoir (caisse propriétaire) : pas de coordonnées client,
  // articles remis immédiatement, donc statut "Expédiée" dès la création.
  router.post("/vente", admin, (req, res) => {
    const { paiement, lignes } = parse(venteSchema, req.body);
    const commande = commandes.creer({
      ...CLIENT_COMPTOIR,
      paiement,
      statut: "Expédiée",
      lignes,
    });
    res.status(201).json(commande);
  });

  router.get("/", admin, (req, res) => {
    res.json(commandes.liste(parse(listeCommandesQuery, req.query)));
  });

  router.get("/:reference", admin, (req, res) => {
    const commande = commandes.get(req.params.reference);
    if (!commande) throw notFound("Commande introuvable");
    res.json(commande);
  });

  router.patch("/:reference/statut", admin, (req, res) => {
    const { statut } = parse(statutSchema, req.body);
    res.json(commandes.changerStatut(req.params.reference, statut));
  });

  return router;
}
