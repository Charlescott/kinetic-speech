import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.resolve(__dirname, "../../../db/migrations");

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run migrations.");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.match(/\\.sql$/))
    .map((e) => e.name)
    .sort();

  try {
    await client.query("begin");

    for (const filename of files) {
      const already = await client.query("select 1 from schema_migrations where filename = $1", [
        filename,
      ]);
      if (already.rowCount) continue;

      const sql = await fs.readFile(path.join(migrationsDir, filename), "utf8");
      await client.query(sql);
      await client.query("insert into schema_migrations (filename) values ($1)", [filename]);
      // eslint-disable-next-line no-console
      console.log(`[db] applied ${filename}`);
    }

    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[db] migration failed:", err.message);
  process.exitCode = 1;
});

