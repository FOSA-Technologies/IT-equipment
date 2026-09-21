import { idDepuisReference } from "../domain/catalogue.js";
import { HttpError } from "../utils/httpError.js";

const versProduit = (r) => ({
  id: r.id,
  ref: r.ref,
  nom: r.nom,
  cat: r.cat,
  prix: r.prix,
  ...(r.prix_barre != null && { prixBarre: r.prix_barre }),
  spec: r.spec,
  stock: r.stock,
  illu: r.illu,
  desc: r.description,
  fiche: JSON.parse(r.fiche),
});

function traduireContrainte(err) {
  // node:sqlite : `errcode` est le code SQLite étendu (19 = SQLITE_CONSTRAINT).
  const estContrainte = (err?.errcode & 0xff) === 19 || /constraint failed/i.test(err?.message ?? "");
  if (estContrainte) {
    return new HttpError(409, "REFERENCE_EXISTANTE", "Un produit avec cette référence existe déjà.");
  }
  return err;
}

export function createProduitsRepo(db) {
  const selectAll = db.prepare("SELECT * FROM produits ORDER BY cree_le DESC, rowid ASC");
  const selectOne = db.prepare("SELECT * FROM produits WHERE id = ?");
  const insert = db.prepare(`
    INSERT INTO produits (id, ref, nom, cat, prix, prix_barre, spec, stock, illu, description, fiche, cree_le, modifie_le)
    VALUES (@id, @ref, @nom, @cat, @prix, @prix_barre, @spec, @stock, @illu, @description, @fiche, @now, @now)
  `);
  const update = db.prepare(`
    UPDATE produits SET ref=@ref, nom=@nom, cat=@cat, prix=@prix, prix_barre=@prix_barre, spec=@spec,
      stock=@stock, illu=@illu, description=@description, fiche=@fiche, modifie_le=@now
    WHERE id=@id
  `);
  const remove = db.prepare("DELETE FROM produits WHERE id = ?");
  const count = db.prepare("SELECT COUNT(*) AS n FROM produits");

  const versLigne = (p) => ({
    ref: p.ref,
    nom: p.nom,
    cat: p.cat,
    prix: p.prix,
    prix_barre: p.prixBarre ?? null,
    spec: p.spec,
    stock: p.stock,
    illu: p.illu,
    description: p.desc,
    fiche: JSON.stringify(p.fiche),
  });

  return {
    list: () => selectAll.all().map(versProduit),

    get(id) {
      const row = selectOne.get(id);
      return row ? versProduit(row) : null;
    },

    count: () => count.get().n,

    /** Crée un produit ; l'id est dérivé de la référence, comme côté frontend. */
    create(saisie, now = new Date().toISOString()) {
      const id = idDepuisReference(saisie.ref);
      try {
        insert.run({ id, ...versLigne(saisie), now });
      } catch (err) {
        throw traduireContrainte(err);
      }
      return this.get(id);
    },

    /** Met à jour un produit ; l'id reste stable même si la référence change. */
    update(id, modifs, now = new Date().toISOString()) {
      const existant = this.get(id);
      if (!existant) return null;
      try {
        update.run({ id, ...versLigne({ ...existant, ...modifs }), now });
      } catch (err) {
        throw traduireContrainte(err);
      }
      return this.get(id);
    },

    delete: (id) => remove.run(id).changes > 0,
  };
}
