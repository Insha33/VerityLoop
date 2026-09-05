import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy shell">
        <h1>Your next product move.<br />{" "}<span>Backed by evidence.</span></h1>
        <p className="hero-subtitle">Turn verified market changes and customer evidence into clear product direction. Know what to build, change, validate, watch, or ignore.</p>
        <div className="hero-actions">
          <Button asChild className="button"><a href="#waitlist">Join the waitlist <ArrowRight aria-hidden="true" /></a></Button>
          <a className="hero-text-link" href="#product">Explore the product <ArrowDown aria-hidden="true" /></a>
        </div>
        <p className="hero-note">Find an opportunity to validate. Understand what should change on your roadmap.</p>
      </div>
      <div className="hero-product-stage shell">
        <div className="product-window" role="region" aria-label="From signal to decision">
          <picture>
            <source media="(max-width: 600px)" srcSet="/product/workspace-mobile.svg" />
            <img src="/product/workspace.svg?v=row-centered" width="1280" height="760" alt="VerityLoop signal inbox: a pricing change is connected to customer calls, verified evidence, and a recommendation to validate before changing the roadmap." fetchPriority="high" />
          </picture>
        </div>
        <div className="product-caption"><span><span className="caption-dot" />A clearer picture of what comes next</span><span>Illustrative product preview</span></div>
      </div>
      <div className="hero-principles shell">
        <span><Check aria-hidden="true" />Evidence you can trace</span>
        <span><Check aria-hidden="true" />Facts and unknowns kept distinct</span>
        <span><Check aria-hidden="true" />Decisions your team owns</span>
      </div>
    </section>
  );
}
