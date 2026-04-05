import fs from "node:fs/promises";
import path from "node:path";

const legacyPagesDir = path.resolve("legacy/httrack/KineticSpeech/www.kineticspeech.com");
const legacyBlogDir = path.resolve("legacy/httrack/KineticSpeech/www.kineticspeech.com/blog");
const outFile = path.resolve("client/public/_redirects");

function toRoute(filename) {
  if (filename === "index.html") return "/";
  if (!filename.endsWith(".html")) return null;
  if (filename.startsWith("blog")) return "/blog";
  const slug = filename.replace(/\\.html$/, "");
  // Preserve existing slugs, but strip trailing "-1" used by Squarespace duplicates.
  return `/${slug.replace(/-1$/, "")}`;
}

function toBlogRoute(filename) {
  if (!filename.endsWith(".html")) return null;
  const slug = filename.replace(/\\.html$/, "");
  return `/blog/${slug}`;
}

async function run() {
  const entries = await fs.readdir(legacyPagesDir, { withFileTypes: true });
  const htmlFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".html"))
    .map((e) => e.name)
    .sort();

  const lines = [];
  lines.push("# Generated from legacy HTTrack pages");

  for (const file of htmlFiles) {
    const route = toRoute(file);
    if (!route) continue;
    lines.push(`/${file} ${route} 301`);
  }

  const blogEntries = await fs.readdir(legacyBlogDir, { withFileTypes: true }).catch(() => []);
  const blogFiles = blogEntries
    .filter((e) => e.isFile() && e.name.endsWith(".html"))
    .map((e) => e.name)
    .sort();

  for (const file of blogFiles) {
    const route = toBlogRoute(file);
    if (!route) continue;
    lines.push(`/blog/${file} ${route} 301`);
  }

  lines.push("");
  lines.push("# SPA fallback");
  lines.push("/* /index.html 200");
  lines.push("");

  await fs.writeFile(outFile, lines.join("\n"), "utf8");
  console.log(`[redirects] wrote ${outFile}`);
}

run().catch((err) => {
  console.error("[redirects] failed:", err.message);
  process.exitCode = 1;
});
