import { useEffect } from "react";
import { Link } from "react-router-dom";
import WaveDivider from "../components/WaveDivider.jsx";
import { teamContent } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

export default function Team() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Team | Kinetic Speech Services, PLLC",
      description:
        "Meet the growing Kinetic Speech Services team and learn about current opportunities for speech-language pathology and occupational therapy professionals.",
    });
  }, []);

  return (
    <Layout>
      <section className="teamHero pageSection">
        <div className="teamHero__heading">
          <p className="pageEyebrow">{teamContent.title}</p>
          <h1 className="teamHero__title">{teamContent.hero.title}</h1>
          <p className="teamHero__description">
            {teamContent.hero.description}
          </p>
          <div className="homeHero__actions">
            <a href="#join-our-team" className="siteButton">
              View Opportunities
            </a>
            <Link to="/contact-us" className="siteButton siteButton--secondary">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="teamHero__imageWrap">
          <img
            src={teamContent.hero.image}
            alt=""
            className="teamHero__image"
          />
        </div>
      </section>

      <section className="teamRecruiting pageSection" id="join-our-team">
        <div className="sectionHeading">
          <p>{teamContent.recruitment.title}</p>
        </div>

        <div className="teamRecruiting__grid">
          <article className="teamOwnerCard">
            <img
              src={teamContent.recruitment.owner.image}
              alt={teamContent.recruitment.owner.name}
              className="teamOwnerCard__image"
            />
            <h2 className="teamOwnerCard__name">
              {teamContent.recruitment.owner.name}
            </h2>
            <p className="teamOwnerCard__role">
              {teamContent.recruitment.owner.role}
            </p>
            <div className="teamOwnerCard__body">
              {teamContent.recruitment.owner.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="teamOwnerCard__benefitsTitle">
              {teamContent.recruitment.owner.benefitsTitle}
            </p>
            <ul className="teamOwnerCard__benefits">
              {teamContent.recruitment.owner.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>

          {teamContent.recruitment.openings.map((opening) => (
            <article key={opening.title} className="teamOpportunityCard">
              <img
                src={opening.image}
                alt=""
                className="teamOpportunityCard__image"
              />
              <h2>{opening.title}</h2>
              <div className="teamOpportunityCard__body">
                {opening.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="teamOpportunityCard__actions">
                {opening.isExternal ? (
                  <a
                    href={opening.actionHref}
                    target="_blank"
                    rel="noreferrer"
                    className="siteButton"
                  >
                    {opening.actionLabel}
                  </a>
                ) : (
                  <Link
                    to={opening.actionHref}
                    className="siteButton siteButton--secondary"
                  >
                    {opening.actionLabel}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="imageCtaBand">
        <div className="imageCtaBand__imageWrap">
          <img
            src={teamContent.bandImage}
            alt=""
            className="imageCtaBand__image"
          />
          <WaveDivider className="imageCtaBand__divider" />
        </div>
      </section>

      <section className="homeCta">
        <h2>{teamContent.cta.title}</h2>
        <p>{teamContent.cta.description}</p>
        <Link to={teamContent.cta.buttonHref} className="siteButton">
          {teamContent.cta.buttonLabel}
        </Link>
      </section>
    </Layout>
  );
}
