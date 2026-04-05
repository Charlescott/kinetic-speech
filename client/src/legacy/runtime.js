function normalizePathname(pathname) {
  if (!pathname) return "/";

  let normalized = pathname;

  if (normalized.endsWith(".html")) normalized = normalized.slice(0, -5);
  if (normalized === "/index") normalized = "/";
  if (normalized === "/our-services-1") normalized = "/our-services";
  if (normalized === "/blog572f") normalized = "/blog";

  return normalized || "/";
}

export function normalizeLegacyHref(rawHref) {
  if (!rawHref) return null;
  if (
    rawHref.startsWith("#") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("tel:") ||
    rawHref.startsWith("javascript:")
  ) {
    return null;
  }

  let url;

  try {
    url = new URL(rawHref, window.location.origin);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  if (url.pathname.startsWith("/legacy/")) return null;
  if (url.pathname.startsWith("/assets/")) return null;
  if (url.pathname.startsWith("/api/")) return null;

  const pathname = normalizePathname(url.pathname);
  return `${pathname}${url.search}${url.hash}`;
}

export function hydrateLazyImages(root) {
  const scope = root || document;

  for (const img of scope.querySelectorAll("img[data-src]")) {
    const dataSrc = img.getAttribute("data-src");
    if (!dataSrc) continue;
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:") || src.includes("data:image")) {
      img.setAttribute("src", dataSrc);
    }
  }

  for (const source of scope.querySelectorAll("source[data-srcset]")) {
    const dataSrcset = source.getAttribute("data-srcset");
    if (!dataSrcset) continue;
    const srcset = source.getAttribute("srcset");
    if (!srcset) source.setAttribute("srcset", dataSrcset);
  }
}

export function hydrateSectionDividers(root) {
  const scope = root || document;
  const waveClip =
    "M-1.006,0.878 L-1.006,0.939 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "L1,-1 L0,-1 Z";

  const waveStroke =
    "M-1.006,0.878 L-1.006,0.939 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0 " +
    "c0.251,-0.07808 0.251,-0.07808 0.502,0 s0.251,0.07808 0.502,0";

  for (const path of scope.querySelectorAll("svg.section-divider-svg-clip path.section-divider-clip")) {
    const d = (path.getAttribute("d") || "").trim();
    if (d === "M0,0" || d.length < 8) path.setAttribute("d", waveClip);
  }

  for (const path of scope.querySelectorAll("svg.section-divider-svg-stroke path.section-divider-stroke")) {
    const d = (path.getAttribute("d") || "").trim();
    if (d === "M0,0" || d.length < 8) path.setAttribute("d", waveStroke);
  }
}

export function setLegacyMenuOpen(open) {
  if (open) document.body.classList.add("legacy-menu-open");
  else document.body.classList.remove("legacy-menu-open");

  for (const button of document.querySelectorAll(".header-burger-btn")) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

export function hydrateLegacyContent(root) {
  hydrateLazyImages(root);
  hydrateSectionDividers(root);
}
