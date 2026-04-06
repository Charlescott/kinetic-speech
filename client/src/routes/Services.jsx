import { useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "../components/Accordion.jsx";
import WaveDivider from "../components/WaveDivider.jsx";
import { servicesContent } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

export default function Services() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Our Services | Kinetic Speech Services, PLLC",
      description:
        "Evaluations, individual therapy, consultation, aphasia support, swallowing, communication, and telepractice speech services.",
    });
  }, []);

  const gettingStartedItems = servicesContent.gettingStarted.steps.map(
    (step) => ({
      title: step.title,
      content: (
        <div className="accordionBody">
          {step.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ),
    }),
  );

  return (
    <Layout>
      <section className="servicesHero pageSection">
        <div className="servicesHero__heading">
          <p className="pageEyebrow">{servicesContent.title}</p>
          <h1 className="servicesHero__title">{servicesContent.intro.title}</h1>
          <p className="servicesHero__description">
            {servicesContent.intro.description}
          </p>
        </div>
      </section>

      <section className="servicesProcess pageSection">
        <div className="servicesProcess__intro">
          <h2>{servicesContent.gettingStarted.title}</h2>
          <p>{servicesContent.gettingStarted.description}</p>
          <Link to="/book-appointment" className="siteButton">
            Book An Appointment
          </Link>
        </div>

        <div className="servicesProcess__accordionWrap">
          <Accordion
            items={gettingStartedItems}
            className="servicesAccordion"
            defaultOpenIndex={0}
          />
        </div>
      </section>

      <section className="servicesDetails pageSection">
        <div className="sectionHeading">
          <p>Support tailored to your needs</p>
        </div>

        <div className="servicesCards">
          {servicesContent.serviceGroups.map((group) => (
            <article key={group.title} className="servicesCard">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {group.note ? (
                <p className="servicesCard__note">{group.note}</p>
              ) : null}
              {group.image ? (
                <img
                  src={group.image}
                  alt={`${group.title} flyer`}
                  className="servicesCard__image"
                />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="imageCtaBand">
        <div className="imageCtaBand__imageWrap">
          <img
            src={servicesContent.bandImage}
            alt=""
            className="imageCtaBand__image"
          />
          <WaveDivider className="imageCtaBand__divider" />
        </div>
      </section>

      <section className="imageCtaBand">
        <div className="imageCtaBand__imageWrap">
          <img
            src={servicesContent.bandImage2}
            alt=""
            className="imageCtaBand__image"
          />
          <WaveDivider className="imageCtaBand__divider" />
        </div>
      </section>

      <section className="homeCta">
        <h2>{servicesContent.cta.title}</h2>
        <p>{servicesContent.cta.description}</p>
        <div className="homeHero__actions">
          <Link to={servicesContent.cta.primaryHref} className="siteButton">
            {servicesContent.cta.primaryLabel}
          </Link>
          <Link
            to={servicesContent.cta.secondaryHref}
            className="siteButton siteButton--secondary"
          >
            {servicesContent.cta.secondaryLabel}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
