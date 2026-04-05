import pg from "pg";

const { Pool } = pg;

let pool = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
  });
}

export async function query(text, params) {
  if (!pool) {
    throw new Error("DATABASE_URL is not set (DB not configured).");
  }
  return pool.query(text, params);
}

