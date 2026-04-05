import { useEffect } from "react";

const loaded = new Set();
let overridesLoaded = false;

export default function useLegacyStyles(stylesheets) {
  useEffect(() => {
    if (!Array.isArray(stylesheets) || stylesheets.length === 0) return;

    for (const href of stylesheets) {
      if (!href || loaded.has(href)) continue;
      loaded.add(href);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.legacy = "true";
      document.head.appendChild(link);
    }

    if (!overridesLoaded) {
      overridesLoaded = true;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/legacy-overrides.css";
      link.dataset.legacy = "true";
      document.head.appendChild(link);
    }
  }, [stylesheets]);
}
