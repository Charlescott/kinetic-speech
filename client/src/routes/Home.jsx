import { Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./_layout.jsx";
import WaveDivider from "../components/WaveDivider.jsx";
import { homeContent } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";

export default function Home() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Kinetic Speech Services, PLLC",
      description:
        "Tiffany Fairdosi, M.S., CCC-SLP, provides individualized speech therapy services for children and adults in Pearland and via telepractice.",
    });
  }, []);

  return (
    <Layout>
      <section className="homeHero">
        <div className="homeHero__content">
          <p className="homeHero__eyebrow">{homeContent.intro.eyebrow}</p>
          <h1 className="homeHero__title">{homeContent.intro.title}</h1>
          <p className="homeHero__description">{homeContent.intro.description}</p>
          <div className="homeHero__actions">
            <Link to="/contact-us" className="siteButton">
              Contact Us
            </Link>
            <Link to="/our-services" className="siteButton siteButton--secondary">
              Our Services
            </Link>
          </div>
        </div>

        <div className="homeHero__imageWrap">
          <img src={homeContent.intro.image} alt="Tiffany Fairdosi" className="homeHero__image" />
        </div>
      </section>

      <section className="servicesOverview">
        <div className="sectionHeading">
          <p>Kinetic Speech Services, PLLC Provides:</p>
        </div>

        <div className="servicesGrid">
          {homeContent.services.map((service) => (
            <article key={service.title} className="serviceCard">
              <h2>{service.title}</h2>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="imageCtaBand">
        <div className="imageCtaBand__imageWrap">
          <img src={homeContent.waveImage} alt="" className="imageCtaBand__image" />
          <WaveDivider className="imageCtaBand__divider" />
        </div>
      </section>

      <section className="homeCta">
        <h2>{homeContent.cta.title}</h2>
        <p>{homeContent.cta.description}</p>
        <Link to={homeContent.cta.buttonHref} className="siteButton">
          {homeContent.cta.buttonLabel}
        </Link>
      </section>
    </Layout>
  );
}
