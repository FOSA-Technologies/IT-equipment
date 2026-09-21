export function createUtilisateursRepo(db) {
  const byEmail = db.prepare("SELECT * FROM utilisateurs WHERE email = ?");
  const insert = db.prepare(
    "INSERT INTO utilisateurs (email, mot_de_passe_hash, cree_le) VALUES (?, ?, ?)",
  );
  const count = db.prepare("SELECT COUNT(*) AS n FROM utilisateurs");

  return {
    findByEmail: (email) => byEmail.get(email.trim().toLowerCase()) ?? null,
    count: () => count.get().n,
    create: (email, hash) => insert.run(email.trim().toLowerCase(), hash, new Date().toISOString()),
  };
}
