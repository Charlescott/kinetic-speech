(function () {
  function hydrateLazyImages(root) {
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

  function hydrateSectionDividers(root) {
    const scope = root || document;

    // Squarespace normally computes these paths at runtime. In our local mirror, that code
    // can fail (missing runtime init), leaving paths as "M0,0" and effectively hiding the divider.
    // Provide a reasonable default "wavy" path so the dividers show.
    // Important: for bottom dividers, the clip path should include the area ABOVE the wave.
    // The original Squarespace "wavy" divider uses a repeated cubic-bezier pattern that reads smoother
    // than a single large curve; use that as our fallback.
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

    for (const path of scope.querySelectorAll(
      "svg.section-divider-svg-clip path.section-divider-clip",
    )) {
      const d = path.getAttribute("d") || "";
      const trimmed = d.trim();
      if (trimmed === "M0,0" || trimmed.length < 8) path.setAttribute("d", waveClip);
    }

    for (const path of scope.querySelectorAll(
      "svg.section-divider-svg-stroke path.section-divider-stroke",
    )) {
      const d = path.getAttribute("d") || "";
      const trimmed = d.trim();
      if (trimmed === "M0,0" || trimmed.length < 8) path.setAttribute("d", waveStroke);
    }
  }

  function setMenuOpen(open) {
    if (open) document.body.classList.add("legacy-menu-open");
    else document.body.classList.remove("legacy-menu-open");
    for (const btn of document.querySelectorAll(".header-burger-btn")) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  function toggleMenu() {
    const open = document.body.classList.contains("legacy-menu-open");
    setMenuOpen(!open);
  }

  function wireBurgerButtons() {
    const burgers = document.querySelectorAll(".header-burger-btn");
    for (const btn of burgers) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Prevent any partially-loaded Squarespace handlers from running.
        if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
        toggleMenu();
      });
      btn.setAttribute("aria-expanded", "false");
    }

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });

    // Close when clicking any menu link
    document.addEventListener("click", (e) => {
      const anchor = e.target?.closest?.(".header-menu a");
      if (anchor) setMenuOpen(false);
    });
  }

  function wireImageErrorFallback() {
    document.addEventListener(
      "error",
      (e) => {
        const el = e.target;
        if (!el || el.tagName !== "IMG") return;
        const src = el.getAttribute("src") || "";
        if (!src.startsWith("/legacy/")) return;
        el.setAttribute("src", "/legacy-missing.svg");
        el.removeAttribute("srcset");
        el.removeAttribute("data-src");
        el.removeAttribute("data-srcset");
      },
      true,
    );
  }

  function init() {
    wireBurgerButtons();
    wireImageErrorFallback();
    hydrateLazyImages();
    hydrateSectionDividers();

    // Some assets/dividers are inserted a tick later; run again shortly.
    setTimeout(() => {
      hydrateLazyImages();
      hydrateSectionDividers();
    }, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
