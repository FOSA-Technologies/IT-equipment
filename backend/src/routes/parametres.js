import { Router } from "express";

import { requireAdmin } from "../middleware/auth.js";
import { parse } from "../middleware/validate.js";
import { parametresBoutiqueSchema } from "../schemas.js";

export function parametresRouter({ config, parametres }) {
  const router = Router();
  const admin = requireAdmin(config);

  // Public : la devise et la TVA affectent l'affichage des prix en boutique.
  router.get("/boutique", (_req, res) => {
    res.json(parametres.obtenirBoutique());
  });

  router.put("/boutique", admin, (req, res) => {
    const donnees = parse(parametresBoutiqueSchema, req.body);
    res.json(parametres.definirBoutique(donnees));
  });

  return router;
}
