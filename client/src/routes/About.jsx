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
          <h1 className="aboutHero__title">{aboutContent.title}</h1>
        </div>

        <div className="aboutHero__grid">
          <div className="aboutHero__imageWrap">
            <img
              src={aboutContent.image}
              alt="Tiffany Fairdosi"
              className="aboutHero__image"
            />
          </div>

          <div className="aboutHero__body">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="waveDividerBand">
        <WaveDivider className="waveDividerBand__divider" />
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
