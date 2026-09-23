export function createUtilisateursRepo(db) {
  const byId = db.prepare("SELECT * FROM utilisateurs WHERE id = ?");
  const byEmail = db.prepare("SELECT * FROM utilisateurs WHERE email = ?");
  const insert = db.prepare(
    "INSERT INTO utilisateurs (email, nom, mot_de_passe_hash, cree_le) VALUES (?, ?, ?, ?)",
  );
  const count = db.prepare("SELECT COUNT(*) AS n FROM utilisateurs");
  const majNom = db.prepare("UPDATE utilisateurs SET nom = ? WHERE id = ?");
  const majMotDePasse = db.prepare(
    "UPDATE utilisateurs SET mot_de_passe_hash = ? WHERE id = ?",
  );

  return {
    findById: (id) => byId.get(id) ?? null,
    findByEmail: (email) => byEmail.get(email.trim().toLowerCase()) ?? null,
    count: () => count.get().n,
    create: (email, nom, hash) =>
      insert.run(
        email.trim().toLowerCase(),
        nom,
        hash,
        new Date().toISOString(),
      ),
    updateNom: (id, nom) => majNom.run(nom, id),
    updateMotDePasse: (id, hash) => majMotDePasse.run(hash, id),
  };
}
