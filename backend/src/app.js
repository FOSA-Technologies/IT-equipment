import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { createClientsRepo } from "./repositories/clients.js";
import { createCommandesRepo } from "./repositories/commandes.js";
import { createProduitsRepo } from "./repositories/produits.js";
import { createUtilisateursRepo } from "./repositories/utilisateurs.js";
import { authRouter } from "./routes/auth.js";
import { clientsRouter } from "./routes/clients.js";
import { commandesRouter } from "./routes/commandes.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { produitsRouter } from "./routes/produits.js";

/** Construit l'application Express à partir d'une config et d'une base déjà initialisée. */
export function createApp({ config, db }) {
  const deps = {
    config,
    produits: createProduitsRepo(db),
    commandes: createCommandesRepo(db, { timezone: config.timezone }),
    clients: createClientsRepo(db),
    utilisateurs: createUtilisateursRepo(db),
  };

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  if (config.nodeEnv !== "test") {
    app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
  }
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRouter(deps));
  app.use("/api/produits", produitsRouter(deps));
  app.use("/api/commandes", commandesRouter(deps));
  app.use("/api/clients", clientsRouter(deps));
  app.use("/api/dashboard", dashboardRouter(deps));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
