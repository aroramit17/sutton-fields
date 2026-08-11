import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

// Lazy singleton — a top-level neon() call throws at build time before env
// vars exist. Never wrap this in a Proxy; it breaks libraries that inspect
// the client object (property/method checks silently fail through a Proxy).
export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
