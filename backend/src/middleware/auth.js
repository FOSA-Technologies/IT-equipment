import jwt from "jsonwebtoken";

import { HttpError } from "../utils/httpError.js";

/** Exige un JWT valide (en-tête « Authorization: Bearer <token> »). */
export function requireAdmin(config) {
  return (req, _res, next) => {
    const [schema, token] = (req.headers.authorization ?? "").split(" ");
    if (schema !== "Bearer" || !token) {
      throw new HttpError(401, "NON_AUTHENTIFIE", "Authentification requise");
    }
    try {
      const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
      req.user = { id: Number(payload.sub), email: payload.email };
      next();
    } catch {
      throw new HttpError(401, "TOKEN_INVALIDE", "Session invalide ou expirée");
    }
  };
}
