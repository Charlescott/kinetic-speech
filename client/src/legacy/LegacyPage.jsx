import { useEffect, useRef } from "react";
import useLegacyStyles from "./useLegacyStyles.js";
import { setTitleAndDescription } from "../lib/seo.js";

export default function LegacyPage({ page, titleOverride, childrenAfter }) {
  const shellRef = useRef(null);
  useLegacyStyles(page?.stylesheets);

  useEffect(() => {
    if (!page) return;
    setTitleAndDescription({
      title: titleOverride || page.title || "Kinetic Speech Services, PLLC",
      description: page.description || undefined,
    });
  }, [page, titleOverride]);

  useEffect(() => {
    if (!page) return;

    const prevId = document.body.id;
    const prevClassName = document.body.className;

    document.body.className = "legacy-mode";
    if (page.bodyClassName) document.body.className = `${page.bodyClassName} legacy-mode`.trim();
    if (page.bodyId) document.body.id = page.bodyId;

    return () => {
      document.body.id = prevId;
      document.body.className = prevClassName;
    };
  }, [page]);

  if (!page) {
    return <p>Legacy content was not found for this page.</p>;
  }

  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;

    // Squarespace sometimes lazy-loads by keeping the real URL in data-src / data-srcset.
    for (const img of root.querySelectorAll("img[data-src]")) {
      const dataSrc = img.getAttribute("data-src");
      if (!dataSrc) continue;
      const src = img.getAttribute("src");
      if (!src || src.startsWith("data:")) {
        img.setAttribute("src", dataSrc);
      }
    }

    for (const source of root.querySelectorAll("source[data-srcset]")) {
      const dataSrcset = source.getAttribute("data-srcset");
      if (!dataSrcset) continue;
      const srcset = source.getAttribute("srcset");
      if (!srcset) source.setAttribute("srcset", dataSrcset);
    }
  }, [page]);

  return (
    <div ref={shellRef} className="legacyShell" aria-label="Legacy page shell">
      <div className="legacy" dangerouslySetInnerHTML={{ __html: page.bodyInnerHtml || "" }} />
      {childrenAfter ? <div className="legacyAfter">{childrenAfter}</div> : null}
    </div>
  );
}
