import { query } from "../db/pool.js";

export async function insertContactSubmission({ name, email, phone, message, pagePath, details = {} }) {
  // If DB isn't configured yet, accept the submission and return a stub so the UI can be wired up.
  if (!process.env.DATABASE_URL) {
    return {
      id: null,
      name,
      email,
      phone,
      message,
      pagePath,
      details,
      createdAt: new Date().toISOString(),
      persisted: false,
    };
  }

  const result = await query(
    `insert into form_submissions (kind, name, email, phone, message, page_path, details)
     values ($1, $2, $3, $4, $5, $6, $7::jsonb)
     returning id, kind, name, email, phone, message, page_path as "pagePath", details, created_at as "createdAt"`,
    ["contact", name, email, phone, message, pagePath, JSON.stringify(details)],
  );

  return { ...result.rows[0], persisted: true };
}
