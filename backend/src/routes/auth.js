import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import { requireAdmin } from "../middleware/auth.js";
import { parse } from "../middleware/validate.js";
import { loginSchema, majCompteSchema } from "../schemas.js";
import { HttpError, notFound } from "../utils/httpError.js";

// Hash factice comparé quand l'e-mail est inconnu, pour ne pas révéler son existence par le temps de réponse.
const HASH_FACTICE = bcrypt.hashSync("mot-de-passe-factice", 10);

const versUtilisateur = (u) => ({ email: u.email, nom: u.nom });

export function authRouter({ config, utilisateurs }) {
  const router = Router();

  const limiteur = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => config.nodeEnv === "test",
    handler: (_req, _res, next) =>
      next(
        new HttpError(
          429,
          "TROP_DE_TENTATIVES",
          "Trop de tentatives, réessayez dans quelques minutes.",
        ),
      ),
  });

  router.post("/login", limiteur, async (req, res) => {
    const { email, motDePasse, resterConnecte } = parse(loginSchema, req.body);
    const utilisateur = utilisateurs.findByEmail(email);
    const valide = await bcrypt.compare(
      motDePasse,
      utilisateur?.mot_de_passe_hash ?? HASH_FACTICE,
    );
    if (!utilisateur || !valide) {
      throw new HttpError(
        401,
        "IDENTIFIANTS_INVALIDES",
        "Adresse e-mail ou mot de passe incorrect",
      );
    }

    const expiresIn = resterConnecte
      ? config.jwtExpiresInLong
      : config.jwtExpiresIn;
    const token = jwt.sign({ email: utilisateur.email }, config.jwtSecret, {
      algorithm: "HS256",
      subject: String(utilisateur.id),
      expiresIn,
    });
    res.json({ token, expiresIn, utilisateur: versUtilisateur(utilisateur) });
  });

  router.get("/me", requireAdmin(config), (req, res) => {
    const utilisateur = utilisateurs.findById(req.user.id);
    if (!utilisateur) throw notFound("Compte introuvable");
    res.json({ utilisateur: versUtilisateur(utilisateur) });
  });

  // Modifie le nom et/ou le mot de passe du compte propriétaire connecté.
  router.patch("/me", requireAdmin(config), async (req, res) => {
    const { nom, motDePasseActuel, nouveauMotDePasse } = parse(
      majCompteSchema,
      req.body,
    );
    const utilisateur = utilisateurs.findById(req.user.id);
    if (!utilisateur) throw notFound("Compte introuvable");

    if (nouveauMotDePasse) {
      const valide = await bcrypt.compare(
        motDePasseActuel,
        utilisateur.mot_de_passe_hash,
      );
      if (!valide) {
        throw new HttpError(
          401,
          "MOT_DE_PASSE_INCORRECT",
          "Mot de passe actuel incorrect",
        );
      }
      utilisateurs.updateMotDePasse(
        utilisateur.id,
        bcrypt.hashSync(nouveauMotDePasse, 12),
      );
    }
    if (nom !== undefined) utilisateurs.updateNom(utilisateur.id, nom);

    res.json({
      utilisateur: versUtilisateur(utilisateurs.findById(utilisateur.id)),
    });
  });

  return router;
}
