import { useEffect } from "react";
import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";

export default function Layout({ title, children }) {
  useEffect(() => {
    document.body.className = "";
    document.body.id = "";
  }, []);

  return (
    <div className="siteShell">
      <SiteHeader />
      <main className="siteMain">
        {title ? <h1 className="pageTitle">{title}</h1> : null}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
