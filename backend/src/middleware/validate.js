import { HttpError } from "../utils/httpError.js";

/** Valide `data` avec un schéma zod ; lève une HttpError 400 détaillée sinon. */
export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new HttpError(
    400,
    "VALIDATION_ERROR",
    "Données invalides",
    result.error.issues.map((i) => ({ champ: i.path.join("."), message: i.message })),
  );
}
