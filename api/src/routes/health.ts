import Elysia from "elysia";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { API_BASE, IS_DEV } from "@/config/constants";

const startTime = Date.now();
const DB_CACHE_TTL = 5000;

let dbCache: { status: "ok" | "error"; latency: number | null } | null = null;
let dbCacheAt = 0;

async function checkDatabase(): Promise<{ status: "ok" | "error"; latency: number | null }> {
  if (dbCache && Date.now() - dbCacheAt < DB_CACHE_TTL) return dbCache;

  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    dbCache = { status: "ok", latency: Date.now() - start };
  } catch {
    dbCache = { status: "error", latency: null };
  }
  dbCacheAt = Date.now();
  return dbCache;
}

export const healthRoute = new Elysia()
  .get(`${API_BASE}/health`, async ({ set }) => {
    const start = Date.now();
    const dbStatus = await checkDatabase();

    const status = dbStatus.status === "ok" ? "ok" : "degraded";
    if (dbStatus.status !== "ok") set.status = 503;

    return {
      status,
      uptime: Math.floor((Date.now() - startTime) / 1000),
      latency: Date.now() - start,
      db: dbStatus,
      ...(IS_DEV && { dev: true }),
    };
  });
