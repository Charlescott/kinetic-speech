import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./_layout.jsx";
import WaveDivider from "../components/WaveDivider.jsx";
import { aboutContent } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";

export default function About() {
  useEffect(() => {
    setTitleAndDescription({
      title: "About Us | Kinetic Speech Services, PLLC",
      description:
        "Tiffany Fairdosi, M.S., CCC-SLP, provides speech therapy services for children and adults in Pearland.",
    });
  }, []);

  return (
    <Layout>
      <section className="aboutHero pageSection">
        <div className="aboutHero__heading">
          <p className="pageEyebrow">About Us</p>
          <h1 className="aboutHero__title">{aboutContent.introTitle}</h1>
        </div>

        <div className="aboutHero__grid">
          <div className="aboutHero__imageWrap">
            <img src={aboutContent.image} alt="Tiffany Fairdosi" className="aboutHero__image" />
          </div>

          <div className="aboutHero__body">
            {aboutContent.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="aboutStory pageSection">
        <div className="aboutStory__content">
          {aboutContent.paragraphs.slice(2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="aboutHighlights pageSection">
        <div className="sectionHeading">
          <p>Experience, training, and community connection</p>
        </div>

        <div className="aboutHighlights__grid">
          {aboutContent.highlights.map((group) => (
            <article key={group.title} className="aboutHighlightCard">
              <h2>{group.title}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="imageCtaBand">
        <div className="imageCtaBand__imageWrap">
          <img src={aboutContent.image} alt="" className="imageCtaBand__image imageCtaBand__image--portrait" />
          <WaveDivider className="imageCtaBand__divider" />
        </div>
      </section>

      <section className="homeCta">
        <h2>{aboutContent.cta.title}</h2>
        <p>{aboutContent.cta.description}</p>
        <Link to={aboutContent.cta.buttonHref} className="siteButton">
          {aboutContent.cta.buttonLabel}
        </Link>
      </section>
    </Layout>
  );
}
