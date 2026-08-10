"use client";

import { useEffect, useState } from "react";

import {
  decisionContent,
  evidenceContent,
  journeyContent,
  type DecisionKey,
  type JourneyKey,
  type SignalIcon,
} from "@/content/marketing";

function SignalGlyph({ icon }: { icon: SignalIcon }) {
  if (icon === "user") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M19 5v4M17 7h4" />
      </svg>
    );
  }
  if (icon === "trend") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 17 5-5 4 3 7-8M15 7h5v5" />
      </svg>
    );
  }
  if (icon === "tag") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12V4h8l10 10-7 7L3 12Z" />
        <circle cx="8" cy="8" r="1" />
      </svg>
    );
  }
  if (icon === "workflow") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="6" height="5" rx="1" />
        <rect x="15" y="15" width="6" height="5" rx="1" />
        <path d="M9 6.5h4a4 4 0 0 1 4 4V15M15 17.5h-4a4 4 0 0 1-4-4V9" />
      </svg>
    );
  }
  if (icon === "radar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="m12 12 6-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-1 .8-1.5 1.6-1.5 2.5h-4c0-.9-.5-1.7-1.5-2.5Z" />
    </svg>
  );
}

export function ProductWalkthrough() {
  const [journeyKey, setJourneyKey] = useState<JourneyKey>("opportunity");
  const [evidenceKey, setEvidenceKey] = useState<keyof typeof evidenceContent>("primary");
  const [decisionKey, setDecisionKey] = useState<DecisionKey | null>(null);
  const [approved, setApproved] = useState(false);
  const journey = journeyContent[journeyKey];
  const recommendation = decisionKey ? decisionContent[decisionKey] : null;

  const selectJourney = (nextJourney: JourneyKey) => {
    setJourneyKey(nextJourney);
    setDecisionKey(null);
    setApproved(false);
  };

  useEffect(() => {
    const handleJourney = (event: Event) => {
      const nextJourney = (event as CustomEvent<JourneyKey>).detail;
      if (nextJourney === "opportunity" || nextJourney === "roadmap") {
        selectJourney(nextJourney);
      }
    };

    window.addEventListener("verityloop:journey", handleJourney);
    return () => window.removeEventListener("verityloop:journey", handleJourney);
  }, []);

  return (
    <section className="section product-section" id="product" aria-labelledby="product-title">
      <div className="shell">
        <div className="section-heading product-heading" data-reveal>
          <p className="eyebrow">Product</p>
          <h2 id="product-title">See the decision system at work.</h2>
          <p>
            Switch journeys, inspect evidence, and compare valid outcomes before anything becomes
            delivery work.
          </p>
        </div>
        <div className="decision-system" data-reveal aria-label="Interactive VerityLoop decision flow">
          <div className="journey-switch product-switch" role="group" aria-label="Choose a VerityLoop journey">
            <button
              id="product-opportunity"
              type="button"
              className={`journey-tab ${journeyKey === "opportunity" ? "is-active" : ""}`}
              aria-pressed={journeyKey === "opportunity"}
              onClick={() => selectJourney("opportunity")}
            >
              <span>For founders</span>
              <strong>Opportunity Discovery</strong>
            </button>
            <button
              id="product-roadmap"
              type="button"
              className={`journey-tab ${journeyKey === "roadmap" ? "is-active" : ""}`}
              aria-pressed={journeyKey === "roadmap"}
              onClick={() => selectJourney("roadmap")}
            >
              <span>For product teams</span>
              <strong>Roadmap Impact</strong>
            </button>
          </div>
          <div className={`flow-canvas ${approved ? "is-approved" : ""}`}>
            <article className="flow-card signal-card">
              <div className="card-top">
                <span className="step-number">01</span>
                <span className="status-dot">Live context</span>
              </div>
              <p className="card-label">{journey.kicker}</p>
              <h2>{journey.title}</h2>
              <ul className="signal-list">
                {journey.signals.map(([icon, label]) => (
                  <li key={label}>
                    <span className="signal-icon">
                      <SignalGlyph icon={icon} />
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="flow-card evidence-card">
              <div className="card-top">
                <span className="step-number">02</span>
                <span className="verified">Verified</span>
              </div>
              <p className="card-label">Cited evidence</p>
              <h2>What the market supports</h2>
              <div className="evidence-list" role="list">
                <button
                  type="button"
                  className={`evidence-node ${evidenceKey === "primary" ? "is-active" : ""}`}
                  aria-pressed={evidenceKey === "primary"}
                  onClick={() => setEvidenceKey("primary")}
                >
                  <span>Primary sources</span>
                  <b>4</b>
                </button>
                <button
                  type="button"
                  className={`evidence-node ${evidenceKey === "context" ? "is-active" : ""}`}
                  aria-pressed={evidenceKey === "context"}
                  onClick={() => setEvidenceKey("context")}
                >
                  <span>Context signals</span>
                  <b>3</b>
                </button>
                <button
                  type="button"
                  className={`evidence-node ${evidenceKey === "conflict" ? "is-active" : ""}`}
                  aria-pressed={evidenceKey === "conflict"}
                  onClick={() => setEvidenceKey("conflict")}
                >
                  <span>Counter-evidence</span>
                  <b>1</b>
                </button>
              </div>
              <p className="evidence-detail">{evidenceContent[evidenceKey]}</p>
              <div className="source-meta">
                <span>8 cited sources</span>
                <span>Checked today</span>
              </div>
            </article>
            <article className="flow-card brief-card">
              <div className="card-top">
                <span className="step-number">03</span>
                <span className="ai-badge">Agent decision brief</span>
              </div>
              <p className="card-label">VerityLoop recommendation</p>
              <h2>{recommendation?.title ?? journey.briefTitle}</h2>
              <p>{recommendation?.copy ?? journey.briefCopy}</p>
              <div className="decision-options" aria-label="Possible decision outcomes">
                <button
                  className={decisionKey === "validate" || decisionKey === null ? "is-selected" : ""}
                  type="button"
                  aria-pressed={decisionKey === "validate" || decisionKey === null}
                  onClick={() => setDecisionKey("validate")}
                >
                  Validate
                </button>
                <button
                  className={decisionKey === "watch" ? "is-selected" : ""}
                  type="button"
                  aria-pressed={decisionKey === "watch"}
                  onClick={() => setDecisionKey("watch")}
                >
                  Watch
                </button>
                <button
                  className={decisionKey === "ignore" ? "is-selected" : ""}
                  type="button"
                  aria-pressed={decisionKey === "ignore"}
                  onClick={() => setDecisionKey("ignore")}
                >
                  Ignore
                </button>
              </div>
            </article>
            <button
              className="approval-gate"
              type="button"
              aria-pressed={approved}
              onClick={() => setApproved((current) => !current)}
            >
              <span className="gate-icon" aria-hidden="true">
                {approved ? "✓" : "→"}
              </span>
              <span aria-live="polite">
                <strong>{approved ? "Direction approved" : "Human approval"}</strong>
                <small>{approved ? "PRD and tickets unlocked" : "Click to unlock PRD + tickets"}</small>
              </span>
            </button>
            <article className={`flow-card prd-card ${approved ? "" : "is-locked"}`}>
              <div className="card-top">
                <span className="step-number">04</span>
                <span className="optional">{approved ? "Ready" : "Locked"}</span>
              </div>
              <p className="card-label">Approved direction</p>
              <h2>PRD draft</h2>
              <ul className="prd-list">
                <li>Problem and outcome</li>
                <li>Evidence and unknowns</li>
                <li>Scope and non-goals</li>
                <li>Success measures</li>
              </ul>
              <span className="locked-label">Generated only after human approval</span>
            </article>
            <article className={`flow-card ticket-card ${approved ? "" : "is-locked"}`}>
              <div className="card-top">
                <span className="step-number">05</span>
                <span className="optional">{approved ? "Reviewed" : "Locked"}</span>
              </div>
              <p className="card-label">Approved PRD</p>
              <h2>Reviewed ticket drafts</h2>
              <ul className="prd-list">
                <li>Epic and stories</li>
                <li>Acceptance criteria</li>
                <li>Dependencies</li>
                <li>Source links</li>
              </ul>
              <span className="locked-label">Available after PRD review</span>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
