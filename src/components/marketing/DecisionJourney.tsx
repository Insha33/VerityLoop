"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, Check, CircleDot, FileCheck2, Radar, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

import {
  decisionJourneys,
  type DecisionAudience,
  type DecisionStage,
} from "@/content/decisionJourney";
import { DecisionJourneyCard } from "./DecisionJourneyCard";
import styles from "./DecisionJourney.module.css";

const stageIcons: Record<DecisionStage, typeof Radar> = {
  signal: Radar,
  verify: ScanSearch,
  decide: Sparkles,
  approve: ShieldCheck,
  deliver: FileCheck2,
};

function cardSlotStyle(index: number, activeIndex: number) {
  const distance = index - activeIndex;
  return {
    transform: `translate3d(${distance * 106}%, 0, 0)`,
    zIndex: distance === 0 ? 2 : 1,
    pointerEvents: distance === 0 ? "auto" as const : "none" as const,
  };
}

export function DecisionJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [audience, setAudience] = useState<DecisionAudience>("founder");
  const [activeIndex, setActiveIndex] = useState(0);
  const journey = decisionJourneys[audience];

  const updateFromScroll = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const available = root.offsetHeight - window.innerHeight;
    if (available <= 0) return;
    const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / available));
    const nextIndex = Math.round(progress * (journey.steps.length - 1));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  }, [journey.steps.length]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateFromScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateFromScroll]);

  useEffect(() => {
    const syncJourneyFromHash = () => {
      if (window.location.hash === "#opportunity") setAudience("founder");
      if (window.location.hash === "#roadmap") setAudience("product-team");
    };
    window.addEventListener("hashchange", syncJourneyFromHash);
    syncJourneyFromHash();
    return () => window.removeEventListener("hashchange", syncJourneyFromHash);
  }, []);

  const goToStep = (index: number) => {
    const root = rootRef.current;
    setActiveIndex(index);
    if (!root) return;
    const available = root.offsetHeight - window.innerHeight;
    const rootTop = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({ top: rootTop + (index / (journey.steps.length - 1)) * available, behavior: "auto" });
  };

  return (
    <section ref={rootRef} className={styles.journeySection} id="product" aria-label="Decision system walkthrough">
      <div ref={frameRef} className={styles.stickyFrame}>
        <header className={`${styles.sectionHeader} shell`}>
          <div>
            <p>Product · Two journeys</p>
            <h2>See the decision system at work.</h2>
            <span>{journey.promise}</span>
          </div>
          <div className={styles.audienceSwitch} role="group" aria-label="Choose audience journey">
            <button id="opportunity" type="button" aria-pressed={audience === "founder"} onClick={() => setAudience("founder")}>
              <span>For founders</span><strong>Opportunity Discovery</strong>
            </button>
            <button id="roadmap" type="button" aria-pressed={audience === "product-team"} onClick={() => setAudience("product-team")}>
              <span>For product teams</span><strong>Roadmap Impact</strong>
            </button>
          </div>
        </header>

        <div className={`${styles.desktopExperience} shell`}>
          <nav className={styles.stageRail} aria-label={`${journey.name} stages`}>
            <span className={styles.railTrack} aria-hidden="true"><i style={{ transform: `scaleY(${activeIndex / (journey.steps.length - 1)})` }} /></span>
            {journey.steps.map((step, index) => {
              const Icon = stageIcons[step.stage];
              return (
                <button type="button" aria-current={index === activeIndex ? "step" : undefined} onClick={() => goToStep(index)} key={step.stage}>
                  <span>{step.step}</span><Icon aria-hidden="true" /><strong>{step.navLabel}</strong>
                  {index < activeIndex && <Check className={styles.completeIcon} aria-hidden="true" />}
                </button>
              );
            })}
            <p><ArrowDown aria-hidden="true" />Scroll to advance</p>
          </nav>

          <div className={styles.narrativeViewport} aria-live="polite">
            <article key={`${audience}-${journey.steps[activeIndex].stage}-narrative`}>
              <span>{journey.steps[activeIndex].eyebrow}</span>
              <h3>{journey.steps[activeIndex].title}</h3>
              <p>{journey.steps[activeIndex].narrative}</p>
              <small><CircleDot aria-hidden="true" />{journey.steps[activeIndex].status}</small>
            </article>
          </div>

          <div className={styles.cardViewport} data-card-transition="horizontal" aria-live="polite">
            {journey.steps.map((step, index) => (
              <div className={styles.cardSlot} data-card-index={index} style={cardSlotStyle(index, activeIndex)} aria-hidden={index !== activeIndex} key={`${audience}-${step.stage}-card`}>
                <DecisionJourneyCard step={step} audience={audience} />
              </div>
            ))}
            <div className={styles.cardProgress} aria-hidden="true"><span>{journey.steps[activeIndex].step} / 05</span><strong>{journey.steps[activeIndex].navLabel}</strong></div>
          </div>
        </div>

        <div className={`${styles.mobileExperience} shell`}>
          {journey.steps.map((step) => {
            const Icon = stageIcons[step.stage];
            return <article className={styles.mobileStep} key={`${audience}-${step.stage}-mobile`}><header><span>{step.step}</span><Icon /><strong>{step.navLabel}</strong></header><h3>{step.title}</h3><p>{step.narrative}</p><DecisionJourneyCard step={step} audience={audience} /></article>;
          })}
        </div>
      </div>
    </section>
  );
}
