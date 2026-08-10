"use client";

import { marketingCopy, type JourneyKey } from "@/content/marketing";

export function Solutions() {
  const { solutions } = marketingCopy;

  return (
    <section
      className="section solutions-section shell"
      id="solutions"
      aria-label="Solutions"
    >
      <div className="section-heading compact-heading" data-reveal>
        <p className="eyebrow">{solutions.eyebrow}</p>
        <h2 id="solutions-title">{solutions.title}</h2>
        <p>{solutions.description}</p>
      </div>
      <div className="solution-grid">
        {solutions.cards.map((card) => (
          <article
            className={`solution-card ${card.key}`}
            id={card.key}
            key={card.key}
            data-solution-card={card.key}
            data-reveal
          >
            <div className="solution-orbit" aria-hidden="true">
              <span>{card.key === "opportunity" ? "✦" : "◇"}</span>
            </div>
            <p className="card-label">{card.audience}</p>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <ol>
              {card.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <a
              className="solution-demo"
              href={`#product-${card.key}`}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent<JourneyKey>("verityloop:journey", { detail: card.key }),
                )
              }
            >
              {card.action} <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
