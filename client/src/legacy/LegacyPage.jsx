import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLegacyStyles from "./useLegacyStyles.js";
import { setTitleAndDescription } from "../lib/seo.js";
import { hydrateLegacyContent, normalizeLegacyHref, setLegacyMenuOpen } from "./runtime.js";

export default function LegacyPage({ page, titleOverride, childrenAfter }) {
  const shellRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    setLegacyMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const root = shellRef.current;
    if (!page || !root) return;
    hydrateLegacyContent(root);

    const timeoutId = window.setTimeout(() => hydrateLegacyContent(root), 250);

    const onClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (anchor.hasAttribute("download")) return;

      const nextHref = normalizeLegacyHref(anchor.getAttribute("href"));
      if (!nextHref) return;
      if (nextHref === `${location.pathname}${location.search}${location.hash}`) return;

      event.preventDefault();
      setLegacyMenuOpen(false);
      navigate(nextHref);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setLegacyMenuOpen(false);
    };

    const onBurgerClick = (event) => {
      const burger = event.target instanceof Element ? event.target.closest(".header-burger-btn") : null;
      if (!burger) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      const isOpen = document.body.classList.contains("legacy-menu-open");
      setLegacyMenuOpen(!isOpen);
    };

    const onImageError = (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      const src = image.getAttribute("src") || "";
      if (!src.startsWith("/legacy/")) return;
      image.setAttribute("src", "/legacy-missing.svg");
      image.removeAttribute("srcset");
      image.removeAttribute("data-src");
      image.removeAttribute("data-srcset");
    };

    root.addEventListener("click", onClick);
    root.addEventListener("click", onBurgerClick, true);
    root.addEventListener("error", onImageError, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      root.removeEventListener("click", onClick);
      root.removeEventListener("click", onBurgerClick, true);
      root.removeEventListener("error", onImageError, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [location.hash, location.pathname, location.search, navigate, page]);

  if (!page) {
    return <p>Legacy content was not found for this page.</p>;
  }

  return (
    <div ref={shellRef} className="legacyShell" aria-label="Legacy page shell">
      <div className="legacy" dangerouslySetInnerHTML={{ __html: page.bodyInnerHtml || "" }} />
      {childrenAfter ? <div className="legacyAfter">{childrenAfter}</div> : null}
    </div>
  );
}
