"use client";

import { ArrowUpRight, Check, FileText, GitBranch, Link2, LockKeyhole, MessageSquare } from "lucide-react";
import { ContextSources } from "./ContextSources";

export function ProductDetails() {
  return (
    <>
      <section className="audience-section section shell" id="solutions" aria-labelledby="audience-title">
        <div className="centered-intro"><h2 id="audience-title">Know what to validate first.<br />Or what should change next.</h2><p>Two starting points. A cited brief to help you make the call.</p></div>
        <div className="audience-grid">
          <article className="audience-card" id="opportunity">
            <div className="audience-title"><span>For founders</span><ArrowUpRight aria-hidden="true" /></div>
            <h3>Test the opportunity<br />before you build.</h3>
            <p>Describe who you want to help and the problem they face. Confirm the market framing, discover existing alternatives, and see which assumptions need validation.</p>
            <div className="entry-preview" aria-label="Illustrative opportunity discovery example">
              <span className="preview-label">YOUR STARTING POINT</span>
              <div className="entry-prompt"><MessageSquare aria-hidden="true" /><p>“I want to help small B2B support teams keep track of who owns a customer issue when it moves between teams. Today they chase updates in Slack.”</p></div>
              <div className="entry-optional"><Link2 aria-hidden="true" />Optional: notes, interviews, or a product URL</div>
              <div className="entry-boundary"><span>Confirm your focus</span><strong>Ownership and context during support handoffs</strong></div>
              <div className="entry-output"><FileText aria-hidden="true" /><div><strong>Opportunity Brief</strong><p>Alternatives, evidence gaps, and what to validate first.</p></div></div>
            </div>
            <span className="entry-caption">Illustrative input and output · No roadmap required</span>
            <a className="inline-link" href="#product" onClick={() => window.dispatchEvent(new CustomEvent("verityloop:journey", { detail: "founder" }))}>Explore Opportunity Discovery <ArrowUpRight aria-hidden="true" /></a>
          </article>
          <article className="audience-card" id="roadmap">
            <div className="audience-title"><span>For product teams</span><ArrowUpRight aria-hidden="true" /></div>
            <h3>Understand the impact<br />before the roadmap moves.</h3>
            <p>Connect a verified market change to your strategy, customer evidence, and work already shipped or planned. Decide whether to act, investigate, or leave the roadmap as it is.</p>
            <div className="entry-preview" aria-label="Illustrative roadmap impact example">
              <span className="preview-label">A VERIFIED MARKET CHANGE</span>
              <div className="entry-prompt"><GitBranch aria-hidden="true" /><p>“A competitor launched shared approvals. Does this change the approval workflow we already have planned?”</p></div>
              <div className="entry-optional"><Link2 aria-hidden="true" />Primary source: product release notes</div>
              <div className="entry-context"><span>Your connected context</span><div><FileText aria-hidden="true" />Product strategy <span>Team workflows</span></div><div><Check aria-hidden="true" />Approval roles <span>Already shipped</span></div><div><GitBranch aria-hidden="true" />Shared approval queue <span>Planned</span></div></div>
              <div className="entry-output"><FileText aria-hidden="true" /><div><strong>Roadmap Impact Brief</strong><p>Customer relevance, existing work, prerequisites, and options.</p></div></div>
            </div>
            <span className="entry-caption">Illustrative input and output · Permission-scoped context</span>
            <a className="inline-link" href="#product" onClick={() => window.dispatchEvent(new CustomEvent("verityloop:journey", { detail: "team" }))}>Explore Roadmap Impact <ArrowUpRight aria-hidden="true" /></a>
          </article>
        </div>
      </section>
      <section className="delivery-section section" id="how-it-works" aria-labelledby="delivery-title">
        <div className="shell delivery-layout">
          <div className="delivery-copy"><h2 id="delivery-title">Your decision first.<br />{" "}The delivery plan follows.</h2><p>Approve the direction, then draft a PRD with the evidence, scope, assumptions, and success criteria attached. Product and engineering review the plan before delivery work is drafted.</p><ul><li><Check aria-hidden="true" />PRD drafting after a human decision</li><li><Check aria-hidden="true" />Optional ticket drafts after PRD approval</li><li><Check aria-hidden="true" />Separate review before Jira or Linear publishing</li></ul><span className="quiet-label">Agent-ready outputs. Human-owned decisions.</span></div>
          <div className="delivery-preview" aria-label="Illustrative PRD awaiting review"><div className="document-toolbar"><FileText aria-hidden="true" /><span>Product requirements</span><span className="approval-label"><LockKeyhole aria-hidden="true" />Draft for review</span></div><div className="document-body"><span className="document-meta">PRD-014 · Shared approvals</span><h3>Validate demand.<br />{" "}Review the prerequisites.</h3><p>Test whether a shared approval queue solves a recurring customer problem before accelerating the initiative.</p><div className="document-rule" /><h4>Acceptance criteria</h4><div className="criteria-row"><span /><p>Confirm approval bottlenecks with five customers</p></div><div className="criteria-row"><span /><p>Ask engineering to review audit-history prerequisites</p></div><div className="criteria-row"><span /><p>Record scope, exclusions, and unresolved questions</p></div><div className="document-footer"><Link2 aria-hidden="true" /><span>4 sources attached</span><span>Decision DEC-014</span></div></div><div className="document-destination"><img src="/integrations/linear.png" alt="" width="20" height="20" /><img src="/integrations/jira.png" alt="" width="20" height="20" /><span>Ticket drafts follow PRD approval</span></div><small>Illustrative workflow · Demo data</small></div>
        </div>
      </section>
      <section className="context-section section shell" aria-labelledby="context-title">
        <div className="context-copy"><h2 id="context-title">Bring the context<br />{" "}behind the decision.</h2><p>Connect the documents, customer evidence, and delivery work your team chooses to share. Every internal match keeps its source; missing or conflicting context stays visible.</p><span className="context-assurance"><LockKeyhole aria-hidden="true" />Permission-scoped context. Your team stays in control.</span><span className="quiet-label">MCP-ready context</span></div>
        <ContextSources />
      </section>
    </>
  );
}
