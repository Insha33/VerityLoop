"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BadgeCheck, FileText, MessagesSquare } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Scroll distance (px from the top of the page) over which the tilted product settles flat. */
const SETTLE_DISTANCE = 560;

export function HeroShowcase() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    // Matches the CSS that pre-tilts the frame, so hydration never jumps.
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      gsap.fromTo(".hero-frame",
        { rotateX: 6, scale: 0.95, transformPerspective: 1800 },
        { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { start: 0, end: SETTLE_DISTANCE, scrub: 0.6 } });
    });
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      // fromTo, not from: a dev double-mount would otherwise record the hidden state as the end state.
      gsap.fromTo(".hero-callout-card",
        { autoAlpha: 0, y: 24, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.14, delay: 0.5 });
      gsap.to(".hero-callout[data-side=left]", { y: -48, ease: "none", scrollTrigger: { start: 0, end: SETTLE_DISTANCE * 1.4, scrub: true } });
      gsap.to(".hero-callout[data-side=right]", { y: 36, ease: "none", scrollTrigger: { start: 0, end: SETTLE_DISTANCE * 1.4, scrub: true } });
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <div ref={root} className="hero-showcase">
      <div className="hero-frame">
        <div className="product-window" role="region" aria-label="From signal to decision">
          <picture>
            <source media="(max-width: 600px)" srcSet="/product/workspace-mobile.svg?v=rhythm-v1" />
            <img src="/product/workspace.svg?v=rhythm-v1" width="1280" height="760" alt="VerityLoop signal inbox: a pricing change is connected to customer calls, verified evidence, and a recommendation to validate before changing the roadmap." fetchPriority="high" />
          </picture>
        </div>
      </div>
      {/* Callouts repeat evidence already shown in the product illustrations; the image alt carries the meaning. */}
      <div className="hero-callout" data-side="left" aria-hidden="true">
        <div className="hero-callout-card">
          <div className="callout-head">
            <span className="callout-icon" data-tone="coral"><FileText /></span>
            <span>Primary source</span>
            <span className="callout-status"><BadgeCheck />Verified</span>
          </div>
          <p className="callout-quote">“Pay for what you use, with no annual commitment.”</p>
          <div className="callout-foot"><span>Competitor pricing page</span><span>Captured Sep 4</span></div>
        </div>
      </div>
      <div className="hero-callout" data-side="right" aria-hidden="true">
        <div className="hero-callout-card">
          <div className="callout-head">
            <span className="callout-icon"><MessagesSquare /></span>
            <span>Customer context</span>
            <span className="callout-count">Source 2 of 4</span>
          </div>
          <p className="callout-quote">“We need room to scale down in quieter months.”</p>
          <div className="callout-foot"><span className="callout-avatar">JL</span><span>Customer discovery call</span></div>
        </div>
      </div>
    </div>
  );
}
