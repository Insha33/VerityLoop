"use client";

import { useState } from "react";

import { faqs } from "@/content/faq";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="section faq-section shell"
      id="faq"
      aria-label="Frequently asked questions"
    >
      <div className="section-heading" data-reveal>
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title">Questions worth answering.</h2>
      </div>
      <div className="faq-list" data-reveal>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <article className={isOpen ? "is-open" : undefined} key={faq.question}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${index + 1}`}
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                >
                  {faq.question}
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
              </h3>
              <div
                id={`faq-${index + 1}`}
                className="faq-answer"
                aria-hidden={!isOpen}
              >
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
