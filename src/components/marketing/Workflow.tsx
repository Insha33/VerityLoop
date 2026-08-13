"use client";

import { useEffect, useRef, useState } from "react";

import { marketingCopy } from "@/content/marketing";

function WorkflowGlyph({ index }: { index: number }) {
  const paths = [
    <path key="signal" d="M4 15h4l2-7 4 12 2-7h4" />,
    <><circle key="verify-circle" cx="12" cy="12" r="7" /><path key="verify-check" d="m9 12 2 2 4-5" /></>,
    <><path key="decide-a" d="M5 6h14M5 12h9M5 18h6" /><path key="decide-b" d="m16 16 3 3 3-5" /></>,
    <><path key="approve-box" d="M5 4h14v16H5z" /><path key="approve-check" d="m8 12 3 3 5-6" /></>,
    <><path key="deliver-a" d="M5 5h10v14H5z" /><path key="deliver-b" d="M15 9h4v10H9" /><path key="deliver-c" d="m12 12 3 3 5-7" /></>,
  ];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[index]}
    </svg>
  );
}

export function Workflow() {
  const { workflow } = marketingCopy;
  const [activeStep, setActiveStep] = useState(0);
  const userSelected = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      if (userSelected.current) return;
      setActiveStep((current) => (current + 1) % workflow.steps.length);
    }, 2300);

    return () => window.clearInterval(interval);
  }, [workflow.steps.length]);

  const selectStep = (index: number) => {
    userSelected.current = true;
    setActiveStep(index);
  };

  return (
    <section className="section workflow-section" id="how-it-works" aria-labelledby="workflow-title">
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
        <div className="workflow-visual" data-reveal>
          <div className="workflow-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${activeStep / (workflow.steps.length - 1)})` }} />
            <i style={{ left: `${(activeStep / (workflow.steps.length - 1)) * 100}%` }} />
          </div>
          <div className="workflow-stages" role="tablist" aria-label="Evidence-to-execution stages">
          {workflow.steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                role="tab"
                id={`workflow-tab-${index}`}
                aria-selected={activeStep === index}
                aria-controls="workflow-detail"
                className={activeStep === index ? "is-active" : undefined}
                onClick={() => selectStep(index)}
              >
                <span className="workflow-step-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="workflow-stage-icon">
                  <WorkflowGlyph index={index} />
                </span>
                <strong>{step.title}</strong>
              </button>
          ))}
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
