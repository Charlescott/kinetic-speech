import { useState } from "react";

export default function Accordion({ items, className = "", defaultOpenIndex = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <section key={item.title} className={`accordion__item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.title}</span>
              <span className="accordion__icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div className="accordion__panel" hidden={!isOpen}>
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
