import { siteContact, socialLinks } from "../content/site.js";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooter__inner">
        <div className="siteFooter__column">
          <h3>{siteContact.officeName}</h3>
          <p>{siteContact.serviceArea}</p>
        </div>

        <div className="siteFooter__column">
          <h4>Contact</h4>
          {siteContact.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>Office: {siteContact.officePhone}</p>
          <p>Fax: {siteContact.fax}</p>
          <p>
            <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
          </p>
        </div>

        <div className="siteFooter__column">
          <h4>Follow Us</h4>
          <div className="siteFooter__socials">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                {link.shortLabel}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
