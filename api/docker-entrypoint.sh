#!/bin/sh
set -e

if [ -f "drizzle/meta/_journal.json" ]; then
  echo "Running database migrations..."
  bun run db:migrate
fi

exec "$@"
