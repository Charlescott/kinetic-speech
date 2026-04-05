import fs from "node:fs/promises";
import path from "node:path";

const legacyRoot = path.resolve("legacy/httrack/KineticSpeech");
const legacySiteRoot = path.join(legacyRoot, "www.kineticspeech.com");
const legacyBlogRoot = path.join(legacySiteRoot, "blog");

const outDir = path.resolve("client/src/legacy/generated");
const outPages = path.join(outDir, "pages.json");
const outBlogPosts = path.join(outDir, "blog-posts.json");

function firstMatch(text, regex) {
  const match = text.match(regex);
  return match?.[1] ?? null;
}

function rewriteLegacyUrls(html) {
  if (!html) return html;

  let out = html;

  const legacyAssetDirs = [
    "assets.squarespace.com/",
    "definitions.sqspcdn.com/",
    "images.squarespace-cdn.com/",
    "static1.squarespace.com/",
  ];

  const absoluteDomainRewrites = [
    ["https://assets.squarespace.com/", "/legacy/assets.squarespace.com/"],
    ["//assets.squarespace.com/", "/legacy/assets.squarespace.com/"],
    ["https://definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/"],
    ["//definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/"],
    ["https://images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/"],
    ["//images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/"],
    ["https://static1.squarespace.com/", "/legacy/static1.squarespace.com/"],
    ["//static1.squarespace.com/", "/legacy/static1.squarespace.com/"],
  ];

  function mapDotDotPath(p) {
    const clean = p.replace(/^\.?\//, "");
    if (legacyAssetDirs.some((d) => clean.startsWith(d))) return `/legacy/${clean}`;

    // Internal navigation like ../about-us.html
    if (clean === "index.html") return "/";
    if (clean.endsWith(".html")) {
      const withoutExt = clean.replace(/\.html$/, "");
      return `/${withoutExt}`.replace(/^\/+/, "/");
    }

    // Anything else (rare): keep it relative to legacy tree.
    return `/legacy/${clean}`;
  }

  out = out.replace(/href=(["'])\.\.\/([^"']+)\1/g, (full, quote, p) => {
    return `href=${quote}${mapDotDotPath(p)}${quote}`;
  });
  out = out.replace(/src=(["'])\.\.\/([^"']+)\1/g, (full, quote, p) => {
    return `src=${quote}${mapDotDotPath(p)}${quote}`;
  });
  out = out.replace(/srcset=(["'])\.\.\/([^"']+)\1/g, (full, quote, p) => {
    return `srcset=${quote}${mapDotDotPath(p)}${quote}`;
  });

  // url(../...) inside inline CSS.
  out = out.replace(/url\(\.\.\/([^)]+)\)/g, (full, p) => `url(${mapDotDotPath(p)})`);

  // Convert internal .html navigation to React Router paths.
  // Examples:
  // - about-us.html -> /about-us
  // - blog/aphasia-book-club.html -> /blog/aphasia-book-club
  out = out.replace(
    /href=(["'])(?!https?:|\/\/|mailto:|tel:|#)([^"']+?\.html(?:[?#][^"']*)?)\1/g,
    (full, q, p) => {
      const normalized = p.startsWith("/") ? p : `/${p}`;
      if (normalized.startsWith("/index.html")) {
        return `href=${q}${normalized.replace(/^\/index\.html/, "/")}${q}`;
      }
      const withoutExt = normalized.replace(/\.html(?=([?#]|$))/g, "");
      const withoutDupSuffix = withoutExt.replace(/-1(?=([?#]|$))/g, "");
      return `href=${q}${withoutDupSuffix}${q}`;
    },
  );

  // Normalize /index.html if any slipped through.
  out = out.replace(/href="\/index\.html"/g, 'href="/"');
  out = out.replace(/href='\/index\.html'/g, "href='/'");

  // Rewrite absolute Squarespace CDN URLs to local mirrored assets.
  for (const [from, to] of absoluteDomainRewrites) {
    out = out.split(from).join(to);
  }

  return out;
}

function extractMainHtml(fullHtml) {
  const start = fullHtml.indexOf('<main id="page"');
  if (start === -1) return null;
  const end = fullHtml.indexOf("</main>", start);
  if (end === -1) return null;

  const mainBlock = fullHtml.slice(start, end + "</main>".length);
  const mainInner = firstMatch(mainBlock, /<main[^>]*>([\s\S]*?)<\/main>/i);
  return mainInner ? mainInner.trim() : null;
}

function extractBodyInnerHtml(fullHtml) {
  const bodyInner = firstMatch(fullHtml, /<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return bodyInner ? bodyInner.trim() : null;
}

function extractBodyAttrs(fullHtml) {
  const id = firstMatch(fullHtml, /<body[\s\S]*?\sid=["']([^"']+)["']/i);
  const classRaw = firstMatch(fullHtml, /<body[\s\S]*?\sclass=["']([\s\S]*?)["']/i);
  const className = classRaw ? classRaw.replace(/\s+/g, " ").trim() : null;
  return { bodyId: id?.trim() ?? null, bodyClassName: className };
}

function extractMeta(fullHtml, fallbackSlug) {
  const title = firstMatch(fullHtml, /<title>([\s\S]*?)<\/title>/i);
  const description = firstMatch(
    fullHtml,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/i,
  );
  const canonical = firstMatch(
    fullHtml,
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i,
  );
  const ogImage = firstMatch(
    fullHtml,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?>/i,
  );

  const ogImageRewritten =
    ogImage && ogImage.startsWith("../") ? `/legacy/${ogImage.slice(3)}` : ogImage;

  return {
    slug: fallbackSlug,
    title: title?.trim() ?? null,
    description: description?.trim() ?? null,
    canonical: canonical?.trim() ?? null,
    ogImage: ogImageRewritten?.trim() ?? null,
  };
}

function stripScripts(html) {
  if (!html) return html;
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function rewriteHrefValue(href) {
  if (!href) return href;
  if (href.startsWith("../")) return `/legacy/${href.slice(3)}`;
  if (href === "/index.html") return "/";

  // Internal .html links may include query/hash: about-us.html#foo
  if (!href.startsWith("http") && !href.startsWith("//") && href.includes(".html")) {
    const normalized = href.startsWith("/") ? href : `/${href}`;
    return normalized.replace(/\.html(?=([?#]|$))/g, "");
  }

  // Protocol-relative and absolute assets -> local mirrored assets.
  if (href.startsWith("//assets.squarespace.com/"))
    return href.replace("//assets.squarespace.com/", "/legacy/assets.squarespace.com/");
  if (href.startsWith("//definitions.sqspcdn.com/"))
    return href.replace("//definitions.sqspcdn.com/", "/legacy/definitions.sqspcdn.com/");
  if (href.startsWith("//images.squarespace-cdn.com/"))
    return href.replace("//images.squarespace-cdn.com/", "/legacy/images.squarespace-cdn.com/");
  if (href.startsWith("//static1.squarespace.com/"))
    return href.replace("//static1.squarespace.com/", "/legacy/static1.squarespace.com/");

  if (href.startsWith("https://assets.squarespace.com/"))
    return href.replace("https://assets.squarespace.com/", "/legacy/assets.squarespace.com/");
  if (href.startsWith("https://definitions.sqspcdn.com/"))
    return href.replace(
      "https://definitions.sqspcdn.com/",
      "/legacy/definitions.sqspcdn.com/",
    );
  if (href.startsWith("https://images.squarespace-cdn.com/"))
    return href.replace(
      "https://images.squarespace-cdn.com/",
      "/legacy/images.squarespace-cdn.com/",
    );
  if (href.startsWith("https://static1.squarespace.com/"))
    return href.replace("https://static1.squarespace.com/", "/legacy/static1.squarespace.com/");

  return href;
}

function extractStylesheets(fullHtml) {
  const links = [];
  const re = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const hrefRe = /href=["']([^"']+)["']/i;

  for (const match of fullHtml.matchAll(re)) {
    const tag = match[0];
    const href = firstMatch(tag, hrefRe);
    if (!href) continue;
    links.push(href);
  }

  // Deduplicate while preserving order.
  return [...new Set(links)];
}

async function readHtml(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".html"))
    .map((e) => e.name)
    .sort();
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function slugFromFilename(filename) {
  if (filename === "index.html") return "/";
  const base = filename.replace(/\.html$/, "");
  return `/${base.replace(/-1$/, "")}`;
}

function blogSlugFromFilename(filename) {
  return `/blog/${filename.replace(/\.html$/, "")}`;
}

async function run() {
  await ensureDir(outDir);

  const pageFiles = await listHtmlFiles(legacySiteRoot);
  const pages = {};

  for (const filename of pageFiles) {
    // Skip the Squarespace blog index variants; we’ll use /blog.
    if (filename.startsWith("blog") && filename !== "blog.html") continue;

    const filePath = path.join(legacySiteRoot, filename);
    const fullHtml = await readHtml(filePath);
    const routePath = slugFromFilename(filename);

    const meta = extractMeta(fullHtml, routePath);
    const body = extractBodyAttrs(fullHtml);
    const stylesheets = extractStylesheets(fullHtml).map((href) => rewriteHrefValue(href));
    const bodyInnerHtml = rewriteLegacyUrls(stripScripts(extractBodyInnerHtml(fullHtml) ?? ""));

    pages[routePath] = {
      ...meta,
      ...body,
      routePath,
      legacyFile: `www.kineticspeech.com/${filename}`,
      stylesheets,
      bodyInnerHtml,
    };
  }

  const blogFiles = await listHtmlFiles(legacyBlogRoot).catch(() => []);
  const blogPosts = {};

  for (const filename of blogFiles) {
    const filePath = path.join(legacyBlogRoot, filename);
    const fullHtml = await readHtml(filePath);
    const routePath = blogSlugFromFilename(filename);

    const meta = extractMeta(fullHtml, routePath);
    const body = extractBodyAttrs(fullHtml);
    const stylesheets = extractStylesheets(fullHtml).map((href) => rewriteHrefValue(href));
    const bodyInnerHtml = rewriteLegacyUrls(stripScripts(extractBodyInnerHtml(fullHtml) ?? ""));

    blogPosts[routePath] = {
      ...meta,
      ...body,
      routePath,
      legacyFile: `www.kineticspeech.com/blog/${filename}`,
      stylesheets,
      bodyInnerHtml,
    };
  }

  await fs.writeFile(outPages, JSON.stringify(pages, null, 2), "utf8");
  await fs.writeFile(outBlogPosts, JSON.stringify(blogPosts, null, 2), "utf8");

  console.log(`[import] wrote ${outPages}`);
  console.log(`[import] wrote ${outBlogPosts}`);
}

run().catch((err) => {
  console.error("[import] failed:", err);
  process.exitCode = 1;
});
