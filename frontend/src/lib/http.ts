import { useAuthStore } from "@/store/authStore";

const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export interface DetailErreur {
  champ: string;
  message: string;
}

/** Erreur renvoyée par l'API (ou réseau : status 0). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Joint le jeton de session ; une réponse 401 déconnecte l'utilisateur. */
  auth?: boolean;
}

export async function requete<T>(
  chemin: string,
  { method = "GET", body, auth = false }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new ApiError(401, "NON_AUTHENTIFIE", "Authentification requise");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let reponse: Response;
  try {
    reponse = await fetch(`${BASE}${chemin}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "RESEAU",
      "Serveur injoignable. Vérifiez que le backend est démarré.",
    );
  }

  if (reponse.status === 204) return undefined as T;

  const donnees = await reponse.json().catch(() => null);

  if (!reponse.ok) {
    if (auth && reponse.status === 401) {
      useAuthStore.getState().seDeconnecter();
    }
    const erreur = donnees?.error;
    throw new ApiError(
      reponse.status,
      erreur?.code ?? "ERREUR",
      erreur?.message ?? `Erreur ${reponse.status}`,
      erreur?.details,
    );
  }
  return donnees as T;
}

/** Message lisible pour l'utilisateur à partir d'une erreur quelconque. */
export function messageErreur(erreur: unknown): string {
  if (erreur instanceof ApiError) {
    if (erreur.code === "VALIDATION_ERROR" && Array.isArray(erreur.details)) {
      return (erreur.details as DetailErreur[])
        .map((d) => `${d.champ} : ${d.message}`)
        .join(" · ");
    }
    return erreur.message;
  }
  return "Une erreur est survenue.";
}
