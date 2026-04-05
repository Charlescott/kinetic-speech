import { NavLink } from "react-router-dom";
import { useState } from "react";
import { siteNav } from "../content/site.js";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="siteHeader">
      <div className="siteHeader__inner">
        <NavLink
          to="/"
          className="siteHeader__brand"
          onClick={() => setMenuOpen(false)}
          aria-label="Kinetic Speech Services, PLLC"
        >
          <img
            src="/legacy/images.squarespace-cdn.com/content/v1/644281148cd62262058dd198/23065333-bf06-4921-be43-34026d1a71e7/KSS+Logo26f7.png"
            alt="Kinetic Speech Services, PLLC"
          />
        </NavLink>

        <button
          type="button"
          className="siteHeader__menuButton"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav className={`siteHeader__nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {siteNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
