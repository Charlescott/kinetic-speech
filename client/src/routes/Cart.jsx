import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./_layout.jsx";
import { siteContact } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";

export default function Cart() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Cart | Kinetic Speech Services, PLLC",
      description:
        "Your cart is currently empty. Reach out to Kinetic Speech Services to schedule care or ask about next steps.",
    });
  }, []);

  return (
    <Layout>
      <section className="cartPage pageSection">
        <div className="cartPage__grid">
          <article className="cartCard">
            <p className="pageEyebrow">Cart</p>
            <p className="cartCard__badge">Currently empty</p>
            <h1 className="cartCard__title">Your cart is empty.</h1>
            <p className="cartCard__description">
              Kinetic Speech Services handles scheduling, insurance verification, and payment planning directly with
              each client. If you’re ready to get started, we’ll help you find the right next step.
            </p>

            <div className="cartCard__actions">
              <Link to="/book-appointment" className="siteButton">
                Book An Appointment
              </Link>
              <Link to="/contact-us" className="siteButton siteButton--secondary">
                Contact Us
              </Link>
            </div>
          </article>

          <aside className="cartSupportCard">
            <h2>Need help?</h2>
            <p>
              Call us at <a href="tel:8322781955">{siteContact.officePhone}</a> or email{" "}
              <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>.
            </p>
            <p>{siteContact.serviceArea}</p>
            <p>
              {siteContact.addressLines[0]}, {siteContact.addressLines[1]}, {siteContact.addressLines[2]},{" "}
              {siteContact.addressLines[3]}
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
