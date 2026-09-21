/**
 * Insère des commandes de démonstration réparties sur les 40 derniers jours,
 * pour alimenter le dashboard. Usage : npm run seed:demo
 * Sans effet si la base contient déjà des commandes.
 */
import "dotenv/config";

import { bootstrap } from "../bootstrap.js";
import { loadConfig } from "../config/index.js";
import { createCommandesRepo } from "../repositories/commandes.js";
import { createProduitsRepo } from "../repositories/produits.js";

const CLIENTS = [
  ["Léa Marchand", "lea.marchand@example.fr"],
  ["Karim Bensaid", "karim.bensaid@example.fr"],
  ["Julie Petit", "julie.petit@example.fr"],
  ["Thomas Herlin", "thomas.herlin@example.fr"],
  ["Atelier Pixel", "contact@atelier-pixel.example.fr"],
];
const STATUTS = ["Payée", "En préparation", "Expédiée"];

const config = loadConfig();
const db = bootstrap(config);
const commandes = createCommandesRepo(db, { timezone: config.timezone });
const produits = createProduitsRepo(db);

if (db.prepare("SELECT COUNT(*) AS n FROM commandes").get().n > 0) {
  console.log("Des commandes existent déjà : rien à faire.");
} else {
  const disponibles = produits.list().filter((p) => p.stock >= 3);
  const maintenant = Date.now();
  let creees = 0;
  for (let i = 0; i < 45; i++) {
    const [nom, email] = CLIENTS[i % CLIENTS.length];
    const quand = new Date(maintenant - (40 - (i * 40) / 45) * 24 * 3600 * 1000);
    const produit = disponibles[(i * 3) % disponibles.length];
    commandes.creer(
      {
        email,
        nom,
        adresse: "12 rue des Composants",
        cp: "75011",
        ville: "Paris",
        paiement: "carte",
        statut: STATUTS[i % STATUTS.length],
        lignes: [{ produitId: produit.id, quantite: 1 }],
      },
      quand,
    );
    creees += 1;
    // Réapprovisionne pour que la démo n'épuise pas le stock.
    db.prepare("UPDATE produits SET stock = stock + 1 WHERE id = ?").run(produit.id);
  }
  console.log(`${creees} commandes de démonstration créées.`);
}
db.close();
