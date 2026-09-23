import bcrypt from "bcryptjs";

import { PRODUITS_INITIAUX } from "./data/produits.js";
import { openDatabase, transaction } from "./db/index.js";
import { createProduitsRepo } from "./repositories/produits.js";
import { createUtilisateursRepo } from "./repositories/utilisateurs.js";

/**
 * Ouvre la base et l'initialise au premier démarrage :
 * catalogue de départ (une seule fois) et compte propriétaire (si aucun utilisateur).
 */
export function bootstrap(config) {
  const db = openDatabase(config.dbPath);

  const dejaInitialise = db
    .prepare("SELECT 1 FROM meta WHERE key = 'catalogue_initialise'")
    .get();
  if (!dejaInitialise) {
    const produits = createProduitsRepo(db);
    const now = new Date().toISOString();
    transaction(db, () => {
      for (const p of PRODUITS_INITIAUX) produits.create(p, now);
      db.prepare(
        "INSERT INTO meta (key, value) VALUES ('catalogue_initialise', ?)",
      ).run(now);
    })();
  }

  const utilisateurs = createUtilisateursRepo(db);
  if (utilisateurs.count() === 0) {
    utilisateurs.create(
      config.adminEmail,
      config.adminNom,
      bcrypt.hashSync(config.adminPassword, 12),
    );
  }

  return db;
}
