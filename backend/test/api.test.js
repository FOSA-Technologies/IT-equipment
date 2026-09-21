import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createApp } from "../src/app.js";
import { bootstrap } from "../src/bootstrap.js";
import { loadConfig } from "../src/config/index.js";

const config = loadConfig({
  NODE_ENV: "test",
  DB_PATH: ":memory:",
  JWT_SECRET: "secret-de-test-suffisamment-long",
  ADMIN_EMAIL: "proprietaire@it-equipment.fr",
  ADMIN_PASSWORD: "motdepasse-test",
});

let server;
let base;
let token;

const api = async (method, path, { body, auth = false } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(auth && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};

const commande = (lignes) => ({
  email: "client@example.fr",
  nom: "Alex Martin",
  adresse: "12 rue des Composants",
  cp: "75011",
  ville: "Paris",
  paiement: "carte",
  lignes,
});

before(async () => {
  const db = bootstrap(config);
  server = createApp({ config, db }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  const res = await api("POST", "/api/auth/login", {
    body: { email: config.adminEmail, motDePasse: config.adminPassword },
  });
  token = res.body.token;
});

after(() => server.close());

describe("auth", () => {
  it("refuse de mauvais identifiants", async () => {
    const res = await api("POST", "/api/auth/login", {
      body: { email: config.adminEmail, motDePasse: "faux-mot-de-passe" },
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, "IDENTIFIANTS_INVALIDES");
  });

  it("renvoie un jeton exploitable par /me", async () => {
    assert.ok(token);
    const res = await api("GET", "/api/auth/me", { auth: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.utilisateur.email, config.adminEmail);
  });

  it("protège les routes propriétaire", async () => {
    assert.equal((await api("GET", "/api/dashboard")).status, 401);
    assert.equal((await api("GET", "/api/commandes")).status, 401);
    assert.equal((await api("DELETE", "/api/produits/clv-k65")).status, 401);
  });
});

describe("produits", () => {
  it("liste le catalogue initial (10 produits)", async () => {
    const res = await api("GET", "/api/produits");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 10);
    assert.equal(res.body[0].id, "clv-mx87");
    assert.equal(res.body[0].prixBarre, 94);
  });

  it("filtre par catégorie, prix, stock et tri", async () => {
    const res = await api("GET", "/api/produits?cat=Stockage,Composants&stockSeul=true&tri=prix-desc");
    assert.equal(res.status, 200);
    const noms = res.body.map((p) => p.ref);
    assert.deepEqual(noms, ["CMR-B650", "SSV-P41-2T", "DDW-4T", "SSV-S1T"]); // ALM-G750 en rupture exclu
    const petits = await api("GET", "/api/produits?prix=0-75&q=souris");
    assert.deepEqual(petits.body.map((p) => p.ref), ["SRS-WL2"]);
  });

  it("rejette une catégorie inconnue", async () => {
    const res = await api("GET", "/api/produits?cat=Inconnue");
    assert.equal(res.status, 400);
  });

  it("cycle création / modification / suppression", async () => {
    const creation = await api("POST", "/api/produits", {
      auth: true,
      body: { nom: "Webcam HD", ref: "CAM-HD1", cat: "Périphériques", prix: 39.9, stock: 5, desc: "Webcam 1080p" },
    });
    assert.equal(creation.status, 201);
    assert.equal(creation.body.id, "cam-hd1");
    assert.equal(creation.body.spec, "Nouveau produit");
    assert.deepEqual(creation.body.fiche, { Garantie: "2 ans" });

    const liste = await api("GET", "/api/produits");
    assert.equal(liste.body[0].ref, "CAM-HD1"); // le plus récent d'abord

    const doublon = await api("POST", "/api/produits", {
      auth: true,
      body: { nom: "Autre", ref: "cam-hd1", cat: "Périphériques", prix: 10, stock: 1 },
    });
    assert.equal(doublon.status, 409);

    const maj = await api("PUT", "/api/produits/cam-hd1", {
      auth: true,
      body: { nom: "Webcam Full HD", ref: "CAM-HD1", cat: "Périphériques", prix: 44.9, stock: 8, desc: "MAJ" },
    });
    assert.equal(maj.status, 200);
    assert.equal(maj.body.nom, "Webcam Full HD");
    assert.equal(maj.body.spec, "Nouveau produit"); // champs non fournis conservés

    const patch = await api("PATCH", "/api/produits/cam-hd1", { auth: true, body: { stock: 2 } });
    assert.equal(patch.body.stock, 2);

    assert.equal((await api("DELETE", "/api/produits/cam-hd1", { auth: true })).status, 204);
    assert.equal((await api("GET", "/api/produits/cam-hd1")).status, 404);
  });

  it("valide les données saisies", async () => {
    const res = await api("POST", "/api/produits", {
      auth: true,
      body: { nom: "", ref: "réf invalide", cat: "Claviers", prix: -1, stock: 1.5 },
    });
    assert.equal(res.status, 400);
    const champs = res.body.error.details.map((d) => d.champ).sort();
    assert.deepEqual(champs, ["nom", "prix", "ref", "stock"]);
  });
});

describe("commandes", () => {
  it("crée une commande, recalcule le total et décrémente le stock", async () => {
    const avant = (await api("GET", "/api/produits/ssv-s1t")).body.stock;
    const res = await api("POST", "/api/commandes", {
      body: commande([
        { produitId: "ssv-s1t", quantite: 2 },
        { produitId: "srs-wl2", quantite: 1 },
        { produitId: "ssv-s1t", quantite: 1 }, // fusionnée avec la première ligne
      ]),
    });
    assert.equal(res.status, 201);
    assert.match(res.body.reference, /^CMD-\d{4}-0001$/);
    assert.equal(res.body.nbArticles, 4);
    assert.equal(res.body.total, 256.9); // 3 × 69 + 49,90
    assert.equal(res.body.statut, "Payée");
    assert.match(res.body.livraisonEstimee, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(res.body.lignes.length, 2);

    const apres = (await api("GET", "/api/produits/ssv-s1t")).body.stock;
    assert.equal(apres, avant - 3);

    const suivante = await api("POST", "/api/commandes", { body: commande([{ produitId: "srs-wl2", quantite: 1 }]) });
    assert.match(suivante.body.reference, /-0002$/);
  });

  it("refuse une commande en rupture ou avec produit inconnu, sans toucher au stock", async () => {
    const avant = (await api("GET", "/api/produits/ddw-4t")).body.stock;
    const res = await api("POST", "/api/commandes", {
      body: commande([
        { produitId: "ddw-4t", quantite: 1 },
        { produitId: "alm-g750", quantite: 1 },
        { produitId: "fantome", quantite: 1 },
      ]),
    });
    assert.equal(res.status, 409);
    assert.equal(res.body.error.code, "STOCK_INDISPONIBLE");
    assert.deepEqual(res.body.error.details.map((d) => d.raison).sort(), ["introuvable", "stock_insuffisant"]);
    assert.equal((await api("GET", "/api/produits/ddw-4t")).body.stock, avant);
  });

  it("valide le formulaire de commande", async () => {
    const res = await api("POST", "/api/commandes", { body: { ...commande([]), email: "pas-un-mail", paiement: "cheque" } });
    assert.equal(res.status, 400);
  });

  it("liste, consulte et fait évoluer les commandes (propriétaire)", async () => {
    const liste = await api("GET", "/api/commandes?limit=1", { auth: true });
    assert.equal(liste.status, 200);
    assert.equal(liste.body.total, 2);
    assert.equal(liste.body.items.length, 1);
    assert.equal(liste.body.items[0].reference.endsWith("0002"), true);

    const ref = liste.body.items[0].reference;
    const detail = await api("GET", `/api/commandes/${ref}`, { auth: true });
    assert.equal(detail.body.lignes[0].ref, "SRS-WL2");

    const maj = await api("PATCH", `/api/commandes/${ref}/statut`, { auth: true, body: { statut: "Expédiée" } });
    assert.equal(maj.body.statut, "Expédiée");
    assert.equal((await api("PATCH", `/api/commandes/${ref}/statut`, { auth: true, body: { statut: "Perdue" } })).status, 400);
    assert.equal((await api("GET", "/api/commandes/CMD-2000-0001", { auth: true })).status, 404);
  });
});

describe("dashboard", () => {
  it("agrège indicateurs, ventes 7 jours, alertes et commandes récentes", async () => {
    const res = await api("GET", "/api/dashboard", { auth: true });
    assert.equal(res.status, 200);
    const d = res.body;
    assert.equal(d.tuiles.commandes.valeur, 2);
    assert.equal(d.tuiles.caMois.valeur, 306.8); // 256,90 + 49,90
    assert.equal(d.tuiles.panierMoyen.valeur, 153.4);
    assert.equal(d.tuiles.caMois.variationPct, null); // pas de mois précédent
    assert.equal(d.ventes7Jours.length, 7);
    assert.equal(d.ventes7Jours.at(-1).valeur, 306.8);
    assert.equal(d.tuiles.stockFaible.valeur, d.alertesStock.length);
    assert.ok(d.alertesStock.some((a) => a.ref === "ALM-G750" && a.niveau === "rupture"));
    assert.equal(d.commandesRecentes.length, 2);
    assert.equal(d.commandesRecentes[0].client, "Alex Martin");
  });
});

describe("divers", () => {
  it("répond sur /api/health et renvoie 404 JSON ailleurs", async () => {
    assert.deepEqual((await api("GET", "/api/health")).body, { status: "ok" });
    const res = await api("GET", "/api/nimporte-quoi");
    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, "NOT_FOUND");
  });
});
