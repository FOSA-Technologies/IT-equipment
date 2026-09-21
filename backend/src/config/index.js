/**
 * Lecture et validation de la configuration depuis les variables d'environnement.
 * Les valeurs sensibles sont obligatoires : aucun secret par défaut.
 */
export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV ?? "development";

  const jwtSecret = env.JWT_SECRET ?? "";
  if (jwtSecret.length < 16) {
    throw new Error("JWT_SECRET manquant ou trop court (16 caractères minimum).");
  }
  if (nodeEnv === "production" && jwtSecret.length < 32) {
    throw new Error("JWT_SECRET doit faire au moins 32 caractères en production.");
  }

  const adminPassword = env.ADMIN_PASSWORD ?? "";
  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD manquant ou trop court (8 caractères minimum).");
  }

  const port = Number.parseInt(env.PORT ?? "3000", 10);
  if (Number.isNaN(port)) throw new Error("PORT invalide.");

  return {
    nodeEnv,
    port,
    dbPath: env.DB_PATH ?? "./data/it-equipment.db",
    jwtSecret,
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? "8h",
    jwtExpiresInLong: env.JWT_EXPIRES_IN_LONG ?? "30d",
    adminEmail: (env.ADMIN_EMAIL ?? "proprietaire@it-equipment.fr").trim().toLowerCase(),
    adminPassword,
    corsOrigins: (env.CORS_ORIGINS ?? "http://localhost:5173")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    timezone: env.BUSINESS_TIMEZONE ?? "Europe/Paris",
  };
}
