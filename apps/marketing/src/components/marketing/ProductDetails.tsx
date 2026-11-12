"use client";

import { ArrowUpRight, Check, FileText, GitBranch, Link2, LockKeyhole, MessageSquare } from "lucide-react";
import { ContextSources } from "./ContextSources";
import { DeliverySteps } from "./DeliverySteps";
import { SignalGrid } from "./SignalGrid";

export function ProductDetails() {
  return (
    <>
      <section className="audience-section section shell" id="solutions" aria-labelledby="audience-title">
        <div className="centered-intro"><SignalGrid variant="band" cell={24} density={0.45} /><h2 id="audience-title">Know what to validate first.<br />Or what should change next.</h2><p>Two starting points. A cited brief to help you make the call.</p></div>
        <div className="audience-grid">
          <article className="journey-card" id="opportunity">
            <div className="journey-stage" aria-label="Illustrative opportunity discovery example">
              <div className="journey-window">
                <div className="journey-bar"><MessageSquare aria-hidden="true" /><span>Your starting point</span><span className="journey-tag">Input</span></div>
                <p className="journey-quote">“I want to help small B2B support teams keep track of who owns a customer issue when it moves between teams. Today they chase updates in Slack.”</p>
                <div className="journey-meta"><Link2 aria-hidden="true" />Optional: notes, interviews, or a product URL</div>
                <div className="journey-focus"><span>Confirm your focus</span><strong>Ownership and context during support handoffs</strong></div>
              </div>
              <div className="journey-connector" aria-hidden="true" />
              <div className="journey-output"><span className="journey-output-icon"><FileText aria-hidden="true" /></span><div><strong>Opportunity Brief</strong><p>Alternatives, evidence gaps, and what to validate first.</p></div></div>
              <span className="journey-caption">Illustrative input and output · No roadmap required</span>
            </div>
            <div className="journey-body">
              <span className="journey-audience">For founders</span>
              <h3>Test the opportunity before you build.</h3>
              <p>Describe who you want to help and the problem they face. Confirm the market framing, discover existing alternatives, and see which assumptions need validation.</p>
              <a className="inline-link" href="#product" onClick={() => window.dispatchEvent(new CustomEvent("verityloop:journey", { detail: "founder" }))}>Explore Opportunity Discovery <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </article>
          <article className="journey-card" id="roadmap">
            <div className="journey-stage" aria-label="Illustrative roadmap impact example">
              <div className="journey-window">
                <div className="journey-bar"><GitBranch aria-hidden="true" /><span>A verified market change</span><span className="journey-tag">Input</span></div>
                <p className="journey-quote">“A competitor launched shared approvals. Does this change the approval workflow we already have planned?”</p>
                <div className="journey-meta"><Link2 aria-hidden="true" />Primary source: product release notes</div>
                <div className="journey-context">
                  <span>Your connected context</span>
                  <div><FileText aria-hidden="true" />Product strategy<em>Team workflows</em></div>
                  <div><Check aria-hidden="true" />Approval roles<em data-tone="done">Already shipped</em></div>
                  <div><GitBranch aria-hidden="true" />Shared approval queue<em data-tone="planned">Planned</em></div>
                </div>
              </div>
              <div className="journey-connector" aria-hidden="true" />
              <div className="journey-output"><span className="journey-output-icon"><FileText aria-hidden="true" /></span><div><strong>Roadmap Impact Brief</strong><p>Customer relevance, existing work, prerequisites, and options.</p></div></div>
              <span className="journey-caption">Illustrative input and output · Permission-scoped context</span>
            </div>
            <div className="journey-body">
              <span className="journey-audience">For product teams</span>
              <h3>Understand the impact before the roadmap moves.</h3>
              <p>Connect a verified market change to your strategy, customer evidence, and work already shipped or planned. Decide whether to act, investigate, or leave the roadmap as it is.</p>
              <a className="inline-link" href="#product" onClick={() => window.dispatchEvent(new CustomEvent("verityloop:journey", { detail: "team" }))}>Explore Roadmap Impact <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </article>
        </div>
      </section>
      <section className="delivery-section section" id="how-it-works" aria-labelledby="delivery-title">
        <div className="shell section-head">
          <h2 id="delivery-title">Your decision first.<br />{" "}The delivery plan follows.</h2>
          <div><p>Approve the direction, then draft a PRD with the evidence, scope, assumptions, and success criteria attached. Product and engineering review the plan before delivery work is drafted.</p></div>
        </div>
        <DeliverySteps />
      </section>
      <section className="context-section section" aria-labelledby="context-title">
        <div className="shell section-head">
          <h2 id="context-title">Bring the context<br />{" "}behind the decision.</h2>
          <div className="context-copy">
            <p>Connect the documents, customer evidence, and delivery work your team chooses to share. Every internal match keeps its source; missing or conflicting context stays visible.</p>
            <span className="context-assurance"><LockKeyhole aria-hidden="true" />Permission-scoped context. Your team stays in control.</span>
            <span className="quiet-label">MCP-ready context</span>
          </div>
        </div>
        <div className="shell"><ContextSources /></div>
      </section>
    </>
  );
}
