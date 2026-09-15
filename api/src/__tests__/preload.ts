/**
 * Preload execute par Bun avant chaque suite de tests (cf. bunfig.toml).
 *
 * Deux regles :
 *  - NODE_ENV et POSTGRES_DB sont forces, jamais herites. C'est le garde-fou
 *    qui garantit qu'une suite de tests ne peut pas s'executer par erreur sur
 *    la base de developpement ou de production.
 *  - Les autres variables sont des valeurs par defaut : l'environnement
 *    d'execution peut les surcharger. Cela permet a la CI GitHub Actions de
 *    pointer sur son service PostgreSQL (localhost) la ou le conteneur de
 *    developpement pointe sur l'hote "postgres".
 */

// Valeurs imposees : aucune surcharge possible.
process.env["NODE_ENV"] = "test";
process.env["POSTGRES_DB"] = "greenroots_test";

// Valeurs par defaut : conservees seulement si la variable n'est pas definie.
const defaults: Record<string, string> = {
  PORT: "3001",
  POSTGRES_USER: "postgres",
  POSTGRES_PASSWORD: "changeme",
  POSTGRES_HOST: "postgres",
  POSTGRES_PORT: "5432",
  JWT_SECRET: "test-jwt-secret-at-least-32-characters-long!",
  CORS_ORIGIN: "*",
  LOG_LEVEL: "silent",
  STRIPE_SECRET_KEY: "sk_test_placeholder",
  STRIPE_WEBHOOK_SECRET: "whsec_test_placeholder",
  WEB_URL: "http://localhost:5173",
};

for (const [key, value] of Object.entries(defaults)) {
  process.env[key] ??= value;
}
