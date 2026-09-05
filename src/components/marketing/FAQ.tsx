"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/faq";

export function FAQ() {
  const [openItem, setOpenItem] = useState("");

  return (
    <section
      className="section faq-section shell"
      id="faq"
      aria-label="Frequently asked questions"
    >
      <div className="section-heading">
        <h2 id="faq-title">Good questions.<br />{" "}Clear answers.</h2>
        <p>A few things to know before you get started.</p>
      </div>
      <Accordion
        className="faq-list"
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
      >
        {faqs.map((faq, index) => {
          const value = `faq-${index + 1}`;
          const isOpen = openItem === value;

          return (
            <AccordionItem
              className={`faq-item ${isOpen ? "is-open" : ""}`}
              value={value}
              key={faq.question}
            >
              <AccordionTrigger className="faq-trigger">
                <span className="faq-question">{faq.question}</span>
                <span className="faq-toggle" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </AccordionTrigger>
              <AccordionContent className="faq-answer-inner">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
