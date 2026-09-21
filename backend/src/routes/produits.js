import { Router } from "express";

import { CATEGORIES, filtrerProduits } from "../domain/catalogue.js";
import { requireAdmin } from "../middleware/auth.js";
import { parse } from "../middleware/validate.js";
import {
  PRODUIT_DEFAUTS,
  listeProduitsQuery,
  produitPartielSchema,
  produitSchema,
} from "../schemas.js";
import { HttpError, notFound } from "../utils/httpError.js";

function verifierPrixBarre(produit) {
  if (produit.prixBarre != null && produit.prixBarre <= produit.prix) {
    throw new HttpError(400, "VALIDATION_ERROR", "Données invalides", [
      { champ: "prixBarre", message: "Doit être supérieur au prix" },
    ]);
  }
}

export function produitsRouter({ config, produits }) {
  const router = Router();
  const admin = requireAdmin(config);

  router.get("/categories", (_req, res) => res.json(CATEGORIES));

  router.get("/", (req, res) => {
    const { q, cat, prix, stockSeul, tri } = parse(listeProduitsQuery, req.query);
    res.json(filtrerProduits(produits.list(), { q, categories: cat, prix, stockSeul, tri }));
  });

  router.get("/:id", (req, res) => {
    const produit = produits.get(req.params.id);
    if (!produit) throw notFound("Produit introuvable");
    res.json(produit);
  });

  router.post("/", admin, (req, res) => {
    const saisie = { ...PRODUIT_DEFAUTS, ...parse(produitSchema, req.body) };
    verifierPrixBarre(saisie);
    res.status(201).json(produits.create(saisie));
  });

  // PUT : remplace les champs du formulaire, conserve ceux non fournis (spec, illu, fiche…).
  router.put("/:id", admin, (req, res) => {
    const modifs = parse(produitSchema, req.body);
    const existant = produits.get(req.params.id);
    if (!existant) throw notFound("Produit introuvable");
    verifierPrixBarre({ ...existant, ...modifs });
    res.json(produits.update(req.params.id, modifs));
  });

  router.patch("/:id", admin, (req, res) => {
    const modifs = parse(produitPartielSchema, req.body);
    const existant = produits.get(req.params.id);
    if (!existant) throw notFound("Produit introuvable");
    verifierPrixBarre({ ...existant, ...modifs });
    res.json(produits.update(req.params.id, modifs));
  });

  router.delete("/:id", admin, (req, res) => {
    if (!produits.delete(req.params.id)) throw notFound("Produit introuvable");
    res.status(204).end();
  });

  return router;
}
