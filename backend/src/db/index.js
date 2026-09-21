import fs from "node:fs";
import path from "node:path";

import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  mot_de_passe_hash TEXT NOT NULL,
  cree_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produits (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nom TEXT NOT NULL,
  cat TEXT NOT NULL,
  prix REAL NOT NULL CHECK (prix >= 0),
  prix_barre REAL,
  spec TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL CHECK (stock >= 0),
  illu TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  fiche TEXT NOT NULL DEFAULT '{}',
  cree_le TEXT NOT NULL,
  modifie_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  tel TEXT NOT NULL DEFAULT '',
  nom TEXT NOT NULL,
  adresse TEXT NOT NULL,
  cp TEXT NOT NULL,
  ville TEXT NOT NULL,
  paiement TEXT NOT NULL,
  statut TEXT NOT NULL,
  total REAL NOT NULL,
  nb_articles INTEGER NOT NULL,
  cree_le TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_commandes_cree_le ON commandes (cree_le);

-- Les lignes conservent un instantané (réf., nom, prix) : l'historique reste
-- valide même si le produit est modifié ou supprimé ensuite.
CREATE TABLE IF NOT EXISTS commande_lignes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commande_id INTEGER NOT NULL REFERENCES commandes (id) ON DELETE CASCADE,
  produit_id TEXT NOT NULL,
  ref TEXT NOT NULL,
  nom TEXT NOT NULL,
  prix_unitaire REAL NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0)
);
CREATE INDEX IF NOT EXISTS idx_lignes_commande ON commande_lignes (commande_id);
`;

/**
 * Transaction synchrone (BEGIN IMMEDIATE / COMMIT, ROLLBACK si la fonction lève).
 * Remplace `db.transaction()` de better-sqlite3 : `node:sqlite` n'en fournit pas.
 */
export function transaction(db, fn) {
  return (...args) => {
    db.exec("BEGIN IMMEDIATE");
    try {
      const resultat = fn(...args);
      db.exec("COMMIT");
      return resultat;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  };
}

/** Ouvre la base SQLite (fichier ou ":memory:") et applique le schéma. */
export function openDatabase(dbPath) {
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  return db;
}
