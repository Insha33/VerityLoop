"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Activity, ListChecks, ScanSearch, Send, ShieldCheck } from "lucide-react";

import { marketingCopy } from "@/content/marketing";

const workflowIcons = [Activity, ScanSearch, ListChecks, ShieldCheck, Send] as const;

function WorkflowGlyph({ index }: { index: number }) {
  const Icon = workflowIcons[index];

  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}

export function Workflow() {
  const { workflow } = marketingCopy;
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const userSelected = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !isInView ||
      !isPageVisible ||
      isPaused ||
      userSelected.current ||
      activeStep === workflow.steps.length - 1
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveStep((current) => current + 1);
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [activeStep, isInView, isPageVisible, isPaused, prefersReducedMotion, workflow.steps.length]);

  const selectStep = (index: number) => {
    userSelected.current = true;
    setActiveStep(index);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % workflow.steps.length;
    else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + workflow.steps.length) % workflow.steps.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = workflow.steps.length - 1;
    else return;

    event.preventDefault();
    selectStep(nextIndex);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[nextIndex]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      className={`section workflow-section${isInView ? " is-in-view" : ""}`}
      id="how-it-works"
      aria-labelledby="workflow-title"
    >
      <div className="shell">
        <div className="section-heading product-heading" data-reveal>
          <p className="eyebrow">{workflow.eyebrow}</p>
          <h2 id="workflow-title">{workflow.title}</h2>
          <p>{workflow.description}</p>
          <div className="workflow-capabilities" aria-label="Workflow capabilities">
            {workflow.capabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </div>
        <div
          className="workflow-visual"
          data-reveal
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          <div className="workflow-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${activeStep / (workflow.steps.length - 1)})` }} />
            <i style={{ left: `${(activeStep / (workflow.steps.length - 1)) * 100}%` }} />
          </div>
          <div className="workflow-stages" role="tablist" aria-label="Evidence-to-execution stages">
            {workflow.steps.map((step, index) => {
              const state = index === activeStep ? "active" : index < activeStep ? "complete" : "upcoming";

              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  id={`workflow-tab-${index}`}
                  aria-selected={activeStep === index}
                  aria-controls="workflow-detail"
                  tabIndex={activeStep === index ? 0 : -1}
                  data-state={state}
                  className={`is-${state}`}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span className="workflow-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="workflow-stage-icon">
                    <WorkflowGlyph index={index} />
                  </span>
                  <strong>{step.title}</strong>
                </button>
              );
            })}
          </div>
          <div
            key={activeStep}
            className="workflow-detail"
            id="workflow-detail"
            role="tabpanel"
            aria-live="polite"
            aria-labelledby={`workflow-tab-${activeStep}`}
          >
            <span>{String(activeStep + 1).padStart(2, "0")}</span>
            <p>{workflow.steps[activeStep].description}</p>
            <small>{workflow.steps[activeStep].result}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
