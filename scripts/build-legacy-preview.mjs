import fs from "node:fs/promises";
import path from "node:path";

const srcRoot = path.resolve("legacy/httrack/KineticSpeech/www.kineticspeech.com");
const outRoot = path.resolve("client/public/legacy-preview/www.kineticspeech.com");

const rewritePairs = [
  ["../assets.squarespace.com/", "/legacy/assets.squarespace.com/"],
  ["../definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/"],
  ["../images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/"],
  ["../static1.squarespace.com/", "/legacy/static1.squarespace.com/"],

  ["https://assets.squarespace.com/", "/legacy/assets.squarespace.com/"],
  ["//assets.squarespace.com/", "/legacy/assets.squarespace.com/"],
  ["https://definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/"],
  ["//definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/"],
  ["https://images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/"],
  ["//images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/"],
  ["https://static1.squarespace.com/", "/legacy/static1.squarespace.com/"],
  ["//static1.squarespace.com/", "/legacy/static1.squarespace.com/"]
];

const publicRoot = path.resolve("client/public");
const dirCache = new Map();

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listDirFiles(dir) {
  if (dirCache.has(dir)) return dirCache.get(dir);
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  dirCache.set(dir, files);
  return files;
}

function isImagePath(p) {
  return /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(p);
}

async function repairImageExtMismatch(html) {
  // Handles cases where the HTML references .JPG/.PNG but the mirrored file is .jpg/.png (or vice versa).
  // Example: srcset entries often keep original casing.
  const re = /\/legacy\/images\.squarespace-cdn\.com\/[^\s"'()<>]+?\.(?:JPG|JPEG|PNG|WEBP|GIF|SVG|ICO)(?:\?[^\s"'()<>]+)?/g;
  const matches = [...html.matchAll(re)].map((m) => m[0]);
  if (matches.length === 0) return html;

  const unique = [...new Set(matches)];
  let out = html;

  for (const url of unique) {
    const [pathPart, queryPart] = url.split("?");
    const diskPath = path.join(publicRoot, pathPart.replace(/^\//, ""));
    try {
      await fs.access(diskPath);
      continue;
    } catch {
      // try lowercase extension
    }

    const dir = path.dirname(diskPath);
    const baseName = path.basename(diskPath, path.extname(diskPath));
    const files = await listDirFiles(dir);
    if (files.length === 0) continue;

    const candidate = files.find((f) => f.toLowerCase() === `${baseName}.jpg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.jpeg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.png`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.webp`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.gif`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.svg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.ico`);

    if (!candidate) continue;

    const repairedPathPart = path.posix.join(path.posix.dirname(pathPart), candidate);
    const repairedUrl = queryPart ? `${repairedPathPart}?${queryPart}` : repairedPathPart;
    out = out.split(url).join(repairedUrl);
  }

  // Also fix plain-case occurrences without /legacy prefix inside srcset chunks.
  // Example: /legacy/.../IMG.JPG?format=100w -> should be /legacy/.../IMG.jpg?format=100w
  for (const url of unique) {
    const [pathPart] = url.split("?");
    const dirPath = path.posix.dirname(pathPart);
    const base = path.posix.basename(pathPart, path.posix.extname(pathPart));
    const diskDir = path.join(publicRoot, dirPath.replace(/^\//, ""));
    const files = await listDirFiles(diskDir);
    if (files.length === 0) continue;
    const candidate = files.find((f) => f.toLowerCase() === `${base}.jpg`) ??
      files.find((f) => f.toLowerCase() === `${base}.jpeg`) ??
      files.find((f) => f.toLowerCase() === `${base}.png`);
    if (!candidate) continue;
    const fromExt = path.posix.extname(pathPart);
    if (!fromExt) continue;
    const fromToken = `${base}${fromExt}`;
    const toToken = candidate;
    out = out.split(fromToken).join(toToken);
  }

  return out;
}

async function repairMissingLocalAssets(html) {
  // Finds URLs like /legacy/images.squarespace-cdn.com/.../file.jpg?format=1500w
  const re = /\/legacy\/images\.squarespace-cdn\.com\/[^\s"'()<>]+/g;
  const matches = [...html.matchAll(re)].map((m) => m[0]);
  if (matches.length === 0) return html;

  const unique = [...new Set(matches)];
  let out = html;

  for (const url of unique) {
    const [pathPart, queryPart] = url.split("?");
    if (!isImagePath(pathPart)) continue;

    const diskPath = path.join(publicRoot, pathPart.replace(/^\//, ""));
    try {
      await fs.access(diskPath);
      continue;
    } catch {
      // missing; attempt best-effort repair
    }

    const dir = path.dirname(diskPath);
    const files = await listDirFiles(dir);
    if (files.length === 0) continue;

    const baseName = path.basename(diskPath, path.extname(diskPath));
    const preferredExts = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"];

    let candidate =
      files.find((f) => f.toLowerCase() === `${baseName}.png`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.jpg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.jpeg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.webp`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.gif`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.svg`) ??
      files.find((f) => f.toLowerCase() === `${baseName}.ico`);

    if (!candidate) {
      candidate = files.find((f) => preferredExts.some((ext) => f.toLowerCase().endsWith(ext)));
    }
    if (!candidate) continue;

    const repairedPathPart = path.posix.join(
      path.posix.dirname(pathPart),
      candidate.replaceAll("\\", "/"),
    );
    const repairedUrl = queryPart ? `${repairedPathPart}?${queryPart}` : repairedPathPart;
    out = out.split(url).join(repairedUrl);
  }

  return out;
}

function rewriteHtml(html) {
  let out = html;

  for (const [from, to] of rewritePairs) {
    out = out.split(from).join(to);
  }

  // Fix common entity encoding that breaks URL query params when used as an attribute value.
  out = out.replaceAll("&amp;", "&");

  // Load our local overrides last.
  if (out.includes("</head>") && !out.includes('href="/legacy-overrides.css"')) {
    out = out.replace(
      "</head>",
      '  <link rel="stylesheet" href="/legacy-overrides.css" />\n</head>',
    );
  }

  if (out.includes("</body>") && !out.includes('src="/legacy-overrides.js"')) {
    out = out.replace(
      "</body>",
      '  <script defer src="/legacy-overrides.js"></script>\n</body>',
    );
  }

  return out;
}

async function copyDirRecursive(srcDir, outDir) {
  await ensureDir(outDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const outPath = path.join(outDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, outPath);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      const html = await fs.readFile(srcPath, "utf8");
      let rewritten = rewriteHtml(html);
      rewritten = await repairImageExtMismatch(rewritten);
      rewritten = await repairMissingLocalAssets(rewritten);
      await fs.writeFile(outPath, rewritten, "utf8");
      continue;
    }

    await fs.copyFile(srcPath, outPath);
  }
}

async function run() {
  await copyDirRecursive(srcRoot, outRoot);
  console.log(`[legacy-preview] wrote ${outRoot}`);
}

run().catch((err) => {
  console.error("[legacy-preview] failed:", err);
  process.exitCode = 1;
});
