import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import LegacyIframe from "../legacy/LegacyIframe.jsx";

function toLegacyPreviewSrc(pathname) {
  const root = "/legacy-preview/www.kineticspeech.com";

  if (pathname === "/" || pathname === "") return `${root}/index.html`;

  const blogMatch = matchPath("/blog/:slug", pathname);
  if (blogMatch?.params?.slug) return `${root}/blog/${blogMatch.params.slug}.html`;

  const map = {
    "/about-us": "about-us.html",
    "/our-services": "our-services-1.html",
    "/our-services-1": "our-services-1.html",
    "/team": "team.html",
    "/contact-us": "contact-us.html",
    "/book-appointment": "book-appointment.html",
    "/blog": "blog.html",
    "/cart": "cart.html",
  };

  const file = map[pathname];
  if (file) return `${root}/${file}`;

  return null;
}

export default function LegacyPreview() {
  const { pathname } = useLocation();
  const src = useMemo(() => toLegacyPreviewSrc(pathname), [pathname]);

  if (!src) {
    return <p>That page doesn’t exist.</p>;
  }

  return <LegacyIframe title={pathname} src={src} />;
}

