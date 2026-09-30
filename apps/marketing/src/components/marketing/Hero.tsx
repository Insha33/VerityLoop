import { marketingCopy } from "@/content/marketing";

export function Hero() {
  const { hero } = marketingCopy;

  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="shell hero-layout">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><span />Evidence infrastructure for product teams</p>
          <h1>
            {hero.titleBefore}{" "}
            <span className="hero-emphasis hero-emphasis-market">{hero.titleMarket}</span>{" "}
            {hero.titleMiddle}{" "}
            <span className="hero-emphasis hero-emphasis-decision">{hero.titleDecision}</span>.
          </h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <div className="hero-actions">
            <a className="button" href="#waitlist">
              Join the waitlist <span aria-hidden="true">↗</span>
            </a>
            <a className="hero-text-link" href="#product">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="trust-line">
            {hero.proofs.map((proof) => (
              <span key={proof}>{proof}</span>
            ))}
          </div>
        </div>
        <div className="hero-preview" role="region" aria-label="From signal to decision" data-reveal>
          <div className="preview-chrome" aria-hidden="true">
            <span /><span /><span />
            <small>Decision workspace / live</small>
          </div>
          <div className="preview-body">
            <div className="preview-meta">
              <span>MARKET SIGNAL · 014</span>
              <span className="preview-live">Verified</span>
            </div>
            <h2>A competitor changed how the category buys.</h2>
            <div className="preview-evidence">
              <span>01</span>
              <div><small>Primary evidence</small><strong>Pricing moved to usage-based</strong></div>
              <b>4 sources</b>
            </div>
            <div className="preview-evidence">
              <span>02</span>
              <div><small>Customer relevance</small><strong>3 active deals mention flexibility</strong></div>
              <b>High</b>
            </div>
            <div className="preview-decision">
              <div><small>RECOMMENDED DECISION</small><strong>Validate before the roadmap moves.</strong></div>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
