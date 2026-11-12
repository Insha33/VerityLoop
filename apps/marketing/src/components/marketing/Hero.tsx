import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingCopy } from "@/content/marketing";
import { HeroShowcase } from "./HeroShowcase";
import { MotionToggle } from "./MotionToggle";
import { SignalGrid } from "./SignalGrid";

export function Hero() {
  return (
    <section className="hero" id="top">
      <SignalGrid variant="hero" interactive />
      <MotionToggle />
      <div className="hero-copy shell">
        <a className="hero-offer" href="#waitlist"><span className="caption-dot" />{marketingCopy.offer.badge}<ArrowRight aria-hidden="true" /></a>
        <h1>Your next product move.<br />{" "}<span>Backed by evidence.</span></h1>
        <p className="hero-subtitle">Turn verified market changes and customer evidence into clear product direction. Know what to build, change, validate, watch, or ignore.</p>
        <div className="hero-actions">
          <Button asChild className="button"><a href="#waitlist">Join the waitlist <ArrowRight aria-hidden="true" /></a></Button>
          <a className="hero-text-link" href="#product">Explore the product <ArrowDown aria-hidden="true" /></a>
        </div>
        <p className="hero-note">Find an opportunity to validate. Understand what should change on your roadmap.</p>
      </div>
      <HeroShowcase />
      <div className="product-caption shell"><span><span className="caption-dot" />A clearer picture of what comes next</span><span>Illustrative product preview</span></div>
      <div className="hero-principles shell">
        <span><Check aria-hidden="true" />Evidence you can trace</span>
        <span><Check aria-hidden="true" />Facts and unknowns kept distinct</span>
        <span><Check aria-hidden="true" />Decisions your team owns</span>
      </div>
    </section>
  );
}
