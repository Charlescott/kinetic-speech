import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WaveDivider from "../components/WaveDivider.jsx";
import { contactContent, socialLinks } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    clientName: "",
    clientDob: "",
    reason: "",
    insurance: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitleAndDescription({
      title: "Contact Us | Kinetic Speech Services, PLLC",
      description:
        "Send an inquiry to Kinetic Speech Services for evaluations, therapy, insurance questions, and appointment information.",
    });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

    try {
      const response = await fetch(`${apiBaseUrl}/api/forms/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.name.trim(),
          phone: formData.phone.trim(),
          message: formData.reason.trim() || "New contact inquiry",
          pagePath: "/contact-us",
          details: {
            clientName: formData.clientName.trim(),
            clientDob: formData.clientDob,
            insurance: formData.insurance,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit the form right now.");
      }

      setFormData({
        name: "",
        phone: "",
        clientName: "",
        clientDob: "",
        reason: "",
        insurance: "",
      });
      setStatus({ type: "success", message: "Thank you!" });
    } catch (error) {
      setStatus({
        type: "error",
        message: "We couldn't send your form just now. Please try again or contact the office directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="contactHero pageSection">
        <div className="contactHero__heading">
          <h1 className="contactHero__title">{contactContent.title}</h1>
          <p className="contactHero__description">{contactContent.intro.title}</p>
          <p className="contactHero__description">{contactContent.intro.description}</p>
        </div>
      </section>

      <section className="contactContent pageSection">
        <div className="contactFormWrap">
          <form className="contactForm" onSubmit={handleSubmit}>
            <label className="contactField">
              <span>Contact's Name</span>
              <input name="name" type="email" value={formData.name} onChange={handleChange} required />
            </label>

            <label className="contactField">
              <span>Contact's Phone Number</span>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </label>

            <label className="contactField">
              <span>Client Name</span>
              <input name="clientName" type="text" value={formData.clientName} onChange={handleChange} required />
            </label>

            <label className="contactField">
              <span>Client's Date of Birth</span>
              <input name="clientDob" type="date" value={formData.clientDob} onChange={handleChange} required />
            </label>

            <label className="contactField">
              <span>Reason for Inquiry</span>
              <textarea name="reason" rows="5" value={formData.reason} onChange={handleChange} />
            </label>

            <label className="contactField">
              <span>Insurance</span>
              <select name="insurance" value={formData.insurance} onChange={handleChange}>
                <option value="">Select an option</option>
                {contactContent.form.insuranceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {status.message ? (
              <p className={`contactForm__status contactForm__status--${status.type}`}>{status.message}</p>
            ) : null}

            <button type="submit" className="siteButton" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </section>

      <section className="waveDividerBand">
        <WaveDivider className="waveDividerBand__divider" />
      </section>

      <section className="homeCta">
        <h2>Ready to start? Let's talk!</h2>
        <p>We verify insurance benefits and eligibility for BCBS and UHC.</p>
        <Link to="/contact-us" className="siteButton">
          Contact Us
        </Link>
      </section>
    </Layout>
  );
}
