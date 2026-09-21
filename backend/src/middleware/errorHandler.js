import { HttpError } from "../utils/httpError.js";

export function notFoundHandler(_req, _res, next) {
  next(new HttpError(404, "NOT_FOUND", "Route introuvable"));
}

// Express identifie un gestionnaire d'erreurs à ses 4 arguments.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.details && { details: err.details }) },
    });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: { code: "JSON_INVALIDE", message: "Corps JSON invalide" } });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: { code: "CORPS_TROP_GROS", message: "Corps de requête trop volumineux" } });
  }
  console.error(err);
  return res.status(500).json({ error: { code: "ERREUR_INTERNE", message: "Erreur interne du serveur" } });
}
