import { useEffect, useMemo, useState } from "react";
import { contactContent, socialLinks } from "../content/site.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clientName: "",
    clientDob: "",
    reason: "",
    insurance: "",
    insuranceDetail: "",
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

  const insuranceDetailMeta = useMemo(() => {
    if (formData.insurance === "Blue Cross Blue Shield") {
      return {
        label: "Subscriber ID",
        hint: "Provide subscriber name and subscriber date of birth if different from the client.",
      };
    }

    if (formData.insurance === "United Health Care" || formData.insurance === "Medicare") {
      return { label: "Member ID", hint: "" };
    }

    return {
      label: "Insurance Details",
      hint: "Share any member, subscriber, or question details that would be helpful.",
    };
  }, [formData.insurance]);

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
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.reason.trim() || "New contact inquiry",
          pagePath: "/contact-us",
          details: {
            clientName: formData.clientName.trim(),
            clientDob: formData.clientDob,
            insurance: formData.insurance,
            insuranceDetail: formData.insuranceDetail.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit the form right now.");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        clientName: "",
        clientDob: "",
        reason: "",
        insurance: "",
        insuranceDetail: "",
      });
      setStatus({ type: "success", message: "Thank you! We’ve received your inquiry." });
    } catch (error) {
      setStatus({
        type: "error",
        message: "We couldn’t send your form just now. Please try again or contact the office directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="contactHero pageSection">
        <div className="contactHero__heading">
          <p className="pageEyebrow">{contactContent.title}</p>
          <h1 className="contactHero__title">{contactContent.intro.title}</h1>
          <p className="contactHero__description">{contactContent.intro.description}</p>
        </div>
      </section>

      <section className="contactContent pageSection">
        <article className="contactFormCard">
          <div className="contactFormCard__header">
            <h2>Inquiry Form</h2>
            <p>Please share a few details and we’ll follow up with the best next step.</p>
          </div>

          <form className="contactForm" onSubmit={handleSubmit}>
            <div className="contactForm__grid">
              <label className="contactField">
                <span>Contact Name</span>
                <input name="name" type="text" value={formData.name} onChange={handleChange} required />
              </label>

              <label className="contactField">
                <span>Email Address</span>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </label>

              <label className="contactField">
                <span>Contact Phone Number</span>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              </label>

              <label className="contactField">
                <span>Client Name</span>
                <input name="clientName" type="text" value={formData.clientName} onChange={handleChange} required />
              </label>

              <label className="contactField">
                <span>Client Date of Birth</span>
                <input name="clientDob" type="date" value={formData.clientDob} onChange={handleChange} required />
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
            </div>

            {formData.insurance && formData.insurance !== "Private Pay" ? (
              <label className="contactField">
                <span>{insuranceDetailMeta.label}</span>
                <input name="insuranceDetail" type="text" value={formData.insuranceDetail} onChange={handleChange} />
                {insuranceDetailMeta.hint ? <small>{insuranceDetailMeta.hint}</small> : null}
              </label>
            ) : null}

            <label className="contactField">
              <span>Reason for Inquiry</span>
              <textarea name="reason" rows="5" value={formData.reason} onChange={handleChange} />
            </label>

            {status.message ? (
              <p className={`contactForm__status contactForm__status--${status.type}`}>{status.message}</p>
            ) : null}

            <button type="submit" className="siteButton" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </article>

        <aside className="contactSidebar">
          {contactContent.supportCards.map((card) => (
            <article key={card.title} className="contactInfoCard">
              <h2>{card.title}</h2>
              <div className="contactInfoCard__body">
                {card.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}

          <article className="contactInfoCard contactInfoCard--social">
            <h2>Follow Us</h2>
            <div className="siteFooter__socials">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  {link.shortLabel}
                </a>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </Layout>
  );
}
