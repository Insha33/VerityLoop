"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { ProductMotionScene } from "./ProductMotionScene";
import styles from "./ProductStory.module.css";

const journeys = {
  founder: {
    label: "Founders", name: "Opportunity Discovery",
    steps: [
      { title: "Start with an idea", copy: "Describe the problem, who faces it, and how they solve it today. Confirm an editable market framing before VerityLoop discovers competitors, substitutes, and emerging approaches.", note: "One meaningful sentence. No product URL or roadmap required." },
      { title: "Find the real opportunity", copy: "Connect customer pain with market evidence. See what supports the opportunity, what contradicts it, and which assumptions still need testing.", note: "Every claim stays connected to its source." },
      { title: "Choose what to validate", copy: "Get a cited Opportunity Brief with a focused recommendation and clear alternatives. Choose whether to validate, pursue, reframe, watch, or ignore before committing to a first product.", note: "Evidence informs the call. You make it." },
      { title: "Give the decision a plan", copy: "After you approve the direction, turn it into a reviewable PRD. Optional ticket drafts follow PRD approval, with a separate review before publishing.", note: "The reasoning travels with the work." },
    ],
  },
  team: {
    label: "Product teams", name: "Roadmap Impact",
    steps: [
      { title: "Catch a meaningful change", copy: "See when a competitor changes its product, pricing, or positioning. Verify the original source before treating an announcement as a reason to act.", note: "A market signal, with the evidence attached." },
      { title: "Connect it to your context", copy: "Compare the change with customer needs, strategy, and work already shipped or planned. Surface overlaps and missing prerequisites before adding to the roadmap.", note: "Your existing roadmap is the starting point." },
      { title: "Decide what should change", copy: "Review a cited Roadmap Impact Brief. Weigh whether to validate, accelerate, reconsider, watch, or ignore, with conflicting evidence and open questions in view.", note: "A recommendation for your team to review." },
      { title: "Move forward with intent", copy: "Once the decision owner approves the direction, draft the PRD for product and engineering review. Only an approved PRD can move into optional ticket drafting.", note: "Separate approval before anything is published." },
    ],
  },
} as const;
export type StoryAudience = keyof typeof journeys;

export function ProductStory() {
  const [audience, setAudience] = useState<StoryAudience>("founder");
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const mobileRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollBin = useRef(-1);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const journey = journeys[audience];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px), (max-height: 799px), (prefers-reduced-motion: reduce)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (compact) {
        const marker = window.innerHeight * 0.45;
        let next = 0;
        mobileRefs.current.forEach((item, index) => {
          if (item && item.getBoundingClientRect().top <= marker) next = index;
        });
        setActive(next);
        setVisible(true);
        return;
      }
      const track = trackRef.current;
      const panel = pinnedRef.current;
      if (!track || !panel) return;
      const distance = window.innerHeight * 0.8;
      track.style.height = `${panel.offsetHeight + distance * 3}px`;
      const top = track.getBoundingClientRect().top;
      const next = Math.max(0, Math.min(3, Math.floor((90 - top + distance * 0.15) / distance)));
      if (next !== scrollBin.current) { scrollBin.current = next; setActive(next); }
      setVisible(top < window.innerHeight && top + track.offsetHeight > 90);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const resize = new ResizeObserver(onScroll);
    if (pinnedRef.current) resize.observe(pinnedRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [compact]);

  useEffect(() => {
    const chooseJourney = (event: Event) => {
      const value = (event as CustomEvent).detail;
      if (value === "founder" || value === "team") { setAudience(value); setActive(0); scrollBin.current = -1; }
    };
    window.addEventListener("verityloop:journey", chooseJourney);
    return () => window.removeEventListener("verityloop:journey", chooseJourney);
  }, []);

  function navigateStep(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % 4;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + 3) % 4;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 3;
    else return;
    event.preventDefault();
    setActive(next);
    stepRefs.current[next]?.focus();
  }

  return (
    <section className={`${styles.section} section shell`} id="product" aria-label="Decision system walkthrough">
      <div ref={trackRef} className={compact ? styles.flowTrack : styles.scrollTrack}>
      <div ref={pinnedRef} className={compact ? styles.flowContent : styles.pinned}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>FROM SIGNAL TO NEXT STEP</span><h2>From market evidence<br />to product direction.</h2></div>
        <div className={styles.audiences} role="group" aria-label="Choose your product journey">
          <span className={styles.selector} style={{ transform: `translateX(${audience === "team" ? "100%" : "0"})` }} aria-hidden="true" />
          {(Object.keys(journeys) as StoryAudience[]).map(key => <button type="button" key={key} aria-pressed={audience === key} onClick={() => setAudience(key)}>{journeys[key].label}</button>)}
        </div>
      </div>
      <p className={styles.scrollHint}><ArrowDown aria-hidden="true" />Scroll to follow the journey <span>0{active + 1} / 04</span></p>
      {compact ? <div className={styles.mobileJourney}>
        {journey.steps.map((step, index) => <article key={index} ref={node => { mobileRefs.current[index] = node; }} className={styles.mobileStep} aria-labelledby={`mobile-step-${index}`}>
          <span className={styles.eyebrow}>0{index + 1} / 04</span><h3 id={`mobile-step-${index}`}>{step.title}</h3><p>{step.copy}</p>
          <div className={`${styles.stage} ${styles.mobileStage}`} data-step={index} data-visible={visible}>
            <div className={`${styles.scene} ${styles.mobileScene}`} data-active={active === index}><ProductMotionScene key={`${audience}-${replay}`} audience={audience} step={index} /></div>
          </div>
        </article>)}
        <p className={styles.caption}>Illustrative workflows · Demo data</p>
      </div> : <div className={styles.layout}>
        <div className={styles.steps} role="tablist" aria-label={`${journey.name} steps`} aria-orientation="vertical">
          {journey.steps.map((step, index) => <div className={styles.step} key={index} data-active={active === index}>
            <button type="button" role="tab" id={`story-step-${index}`} aria-selected={active === index} aria-controls={`story-scene-${index}`} tabIndex={active === index ? 0 : -1} ref={node => { stepRefs.current[index] = node; }} onClick={() => setActive(index)} onKeyDown={event => navigateStep(event, index)}>
              <span className={styles.number}>0{index + 1}</span><span>{step.title}</span>
            </button>
            <div className={styles.description} aria-hidden={active !== index}><div><p>{step.copy}</p><span>{step.note}</span></div></div>
          </div>)}
        </div>
        <div className={styles.demo}>
          <div className={styles.stage} ref={stageRef} data-step={active} data-visible={visible}>
            {journey.steps.map((step, index) => <div className={styles.scene} role="tabpanel" id={`story-scene-${index}`} aria-labelledby={`story-step-${index}`} aria-hidden={active !== index} inert={active !== index} key={index} data-active={active === index}>
              <ProductMotionScene key={`${audience}-${replay}`} audience={audience} step={index} />
              <span className="sr-only">{step.copy}</span>
            </div>)}
          </div>
          <div className={styles.caption}><span>Illustrative workflow · Demo data</span><button type="button" onClick={() => setReplay(value => value + 1)} aria-label="Replay product animation"><RotateCcw aria-hidden="true" />Replay</button></div>
        </div>
      </div>}
      </div>
      </div>
    </section>
  );
}
