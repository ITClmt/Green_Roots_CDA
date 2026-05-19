import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { env } from "@/config/env";

const client = new SQL({
  hostname: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
});

export const db = drizzle(client);
