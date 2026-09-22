import { Router } from "express";

import { requireAdmin } from "../middleware/auth.js";
import { parse } from "../middleware/validate.js";
import { listeClientsQuery } from "../schemas.js";
import { notFound } from "../utils/httpError.js";

export function clientsRouter({ config, clients }) {
  const router = Router();
  const admin = requireAdmin(config);

  router.get("/", admin, (req, res) => {
    res.json(clients.liste(parse(listeClientsQuery, req.query)));
  });

  router.get("/:email", admin, (req, res) => {
    const client = clients.detail(req.params.email);
    if (!client) throw notFound("Client introuvable");
    res.json(client);
  });

  return router;
}
