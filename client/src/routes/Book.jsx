import { useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingContent } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

export default function Book() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Book an Appointment | Kinetic Speech Services, PLLC",
      description:
        "Schedule an evaluation with Kinetic Speech Services and review accepted plans, payment details, and next steps.",
    });
  }, []);

  return (
    <Layout>
      <section className="bookingHero pageSection">
        <div className="bookingHero__heading">
          <p className="pageEyebrow">{bookingContent.title}</p>
          <h1 className="bookingHero__title">{bookingContent.intro.title}</h1>
          <p className="bookingHero__description">{bookingContent.intro.description}</p>
          <div className="homeHero__actions">
            <Link to="/contact-us" className="siteButton">
              Contact Us
            </Link>
            <a href={bookingContent.cta.secondaryHref} className="siteButton siteButton--secondary">
              {bookingContent.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="bookingDetails pageSection">
        <div className="bookingDetails__grid">
          <article className="bookingCard">
            <h2>We accept</h2>
            <ul>
              {bookingContent.acceptedPlans.map((plan) => (
                <li key={plan}>{plan}</li>
              ))}
            </ul>
          </article>

          <article className="bookingCard">
            <h2>What to expect</h2>
            {bookingContent.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
            <p className="bookingCard__callout">{bookingContent.schedulingNote}</p>
          </article>
        </div>
      </section>

      <section className="homeCta">
        <h2>{bookingContent.cta.title}</h2>
        <p>{bookingContent.cta.description}</p>
        <div className="homeHero__actions">
          <Link to={bookingContent.cta.primaryHref} className="siteButton">
            {bookingContent.cta.primaryLabel}
          </Link>
          <a href={bookingContent.cta.secondaryHref} className="siteButton siteButton--secondary">
            {bookingContent.cta.secondaryLabel}
          </a>
        </div>
      </section>
    </Layout>
  );
}
