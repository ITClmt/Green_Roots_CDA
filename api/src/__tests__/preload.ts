Object.assign(process.env, {
  NODE_ENV: "test",
  PORT: "3001",
  POSTGRES_USER: "postgres",
  POSTGRES_PASSWORD: "changeme",
  POSTGRES_HOST: "postgres",
  POSTGRES_PORT: "5432",
  POSTGRES_DB: "greenroots_test",
  JWT_SECRET: "test-jwt-secret-at-least-32-characters-long!",
  CORS_ORIGIN: "*",
  LOG_LEVEL: "silent",
});
