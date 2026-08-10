import { marketingCopy } from "@/content/marketing";

export function Hero() {
  const { hero } = marketingCopy;

  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy" data-reveal>
        <p className="eyebrow">
          <span /> {hero.eyebrow}
        </p>
        <h1>
          {hero.titleBefore}{" "}
          <span className="hero-emphasis hero-emphasis-market">{hero.titleMarket}</span>{" "}
          {hero.titleMiddle}{" "}
          <span className="hero-emphasis hero-emphasis-decision">{hero.titleDecision}</span>.
        </h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <div className="hero-actions">
          <a className="button" href="#waitlist">
            Join the waitlist <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="trust-line">
          {hero.proofs.map((proof) => (
            <span key={proof}>{proof}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
