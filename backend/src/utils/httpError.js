/** Erreur applicative convertie en réponse JSON par le middleware d'erreurs. */
export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (message = "Ressource introuvable") =>
  new HttpError(404, "NOT_FOUND", message);
