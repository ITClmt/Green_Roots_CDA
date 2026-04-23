# Green Roots API

Bun + Elysia + Drizzle ORM + PostgreSQL REST API.

## Development

```bash
bun dev           # start with hot reload
bun lint          # eslint
bun db:generate   # generate migration after schema changes
bun db:migrate    # apply migrations
bun db:studio     # drizzle studio
```

## Architecture

```
src/
  config/       env validation, constants
  db/           schema, client, helpers
  models/       zod schemas + dto types
  services/     business logic
  controllers/  route handlers
  middlewares/  auth, error, logging
  routes/       health, aggregator
  utils/        errors, response helpers, logger
```

## Tech notes

- **Zod v4** — standalone validators (`z.email()`, `z.uuid()`, `z.url()`)
- **Auth** — JWT access token (15 min) + refresh token rotation with reuse detection
- **Rate limiting** — 10 req/min on `/auth/*`
