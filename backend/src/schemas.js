import { z } from "zod";

import {
  CATEGORIES,
  ILLUSTRATIONS,
  PLAGES_PRIX,
  TRIS,
} from "./domain/catalogue.js";
import { MOYENS_PAIEMENT, STATUTS_COMMANDE } from "./domain/commandes.js";
import { arrondir } from "./utils/dates.js";

// Messages d'erreur de validation en français.
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return {
        message:
          issue.received === "undefined"
            ? "Champ requis"
            : "Type de valeur invalide",
      };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return {
          message:
            issue.minimum === 1
              ? "Champ requis"
              : `${issue.minimum} caractères minimum`,
        };
      }
      if (issue.type === "array")
        return { message: `Au moins ${issue.minimum} élément(s) requis` };
      return { message: `Doit être supérieur ou égal à ${issue.minimum}` };
    case z.ZodIssueCode.too_big:
      if (issue.type === "string")
        return { message: `${issue.maximum} caractères maximum` };
      if (issue.type === "array")
        return { message: `${issue.maximum} éléments maximum` };
      return { message: `Doit être inférieur ou égal à ${issue.maximum}` };
    case z.ZodIssueCode.invalid_string:
      return {
        message:
          issue.validation === "email"
            ? "Adresse e-mail invalide"
            : "Format invalide",
      };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: `Valeur attendue : ${issue.options.join(", ")}` };
    default:
      return { message: ctx.defaultError };
  }
});

const texte = (max) => z.string().trim().min(1).max(max);
const prix = z.number().min(0).max(1_000_000).transform(arrondir);

// --- Auth
export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  motDePasse: z.string().min(1).max(200),
  resterConnecte: z.boolean().default(false),
});

// --- Produits
const ficheSchema = z
  .record(z.string().trim().min(1).max(60), z.string().trim().max(200))
  .refine((f) => Object.keys(f).length <= 30, "30 caractéristiques maximum");

const produitChamps = {
  nom: texte(120),
  ref: texte(40).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "Lettres, chiffres, « . », « - » et « _ » uniquement",
  ),
  cat: z.enum(CATEGORIES),
  prix,
  prixBarre: prix.nullable().optional(),
  spec: z.string().trim().max(200).optional(),
  stock: z.number().int().min(0).max(1_000_000),
  illu: z.enum(ILLUSTRATIONS).optional(),
  desc: z.string().trim().max(2000).optional(),
  fiche: ficheSchema.optional(),
};

/** Création et remplacement (PUT) : nom, ref, cat, prix et stock sont obligatoires. */
export const produitSchema = z.object(produitChamps);
/** Modification partielle (PATCH). */
export const produitPartielSchema = z.object(produitChamps).partial();

/** Valeurs appliquées à la création quand le formulaire ne les fournit pas. */
export const PRODUIT_DEFAUTS = {
  spec: "Nouveau produit",
  illu: "ssd",
  desc: "",
  fiche: { Garantie: "2 ans" },
};

const listeEnum = (valeurs) =>
  z.preprocess(
    (v) =>
      v === undefined
        ? []
        : [v]
            .flat()
            .flatMap((s) => String(s).split(","))
            .map((s) => s.trim())
            .filter(Boolean),
    z.array(z.enum(valeurs)),
  );

export const listeProduitsQuery = z.object({
  q: z.string().trim().max(100).optional(),
  cat: listeEnum(CATEGORIES),
  prix: z.enum(PLAGES_PRIX).optional(),
  stockSeul: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  tri: z.enum(TRIS).default("pertinence"),
});

// --- Commandes
const lignesSchema = z
  .array(
    z.object({
      produitId: texte(60),
      quantite: z.number().int().min(1).max(99),
    }),
  )
  .min(1)
  .max(50);

/** Vente passée directement en caisse par le propriétaire : pas de coordonnées client. */
export const venteSchema = z.object({
  paiement: z.enum(MOYENS_PAIEMENT).default("especes"),
  lignes: lignesSchema,
});

export const commandeSchema = z.object({
  email: z.string().trim().email().max(200),
  tel: z.string().trim().max(30).optional(),
  nom: texte(120),
  adresse: texte(200),
  cp: texte(10),
  ville: texte(100),
  paiement: z.enum(MOYENS_PAIEMENT),
  lignes: lignesSchema,
});

export const statutSchema = z.object({ statut: z.enum(STATUTS_COMMANDE) });

export const listeCommandesQuery = z.object({
  statut: z.enum(STATUTS_COMMANDE).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// --- Clients
export const listeClientsQuery = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
