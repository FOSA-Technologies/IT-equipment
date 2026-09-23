import { PARAMETRES_BOUTIQUE_DEFAUT } from "../domain/parametres.js";

const CLE = "parametres_boutique";

export function createParametresRepo(db) {
  const select = db.prepare("SELECT value FROM meta WHERE key = ?");
  const upsert = db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  );

  return {
    /** Paramètres actuels, complétés avec les valeurs par défaut si absents. */
    obtenirBoutique() {
      const row = select.get(CLE);
      return row
        ? { ...PARAMETRES_BOUTIQUE_DEFAUT, ...JSON.parse(row.value) }
        : { ...PARAMETRES_BOUTIQUE_DEFAUT };
    },

    definirBoutique(parametres) {
      upsert.run(CLE, JSON.stringify(parametres));
      return parametres;
    },
  };
}
