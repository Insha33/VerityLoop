# GroundTruth Marketing Page Design

## Objective

Create a modern, dynamic, trust-building marketing page for GroundTruth that converts visitors into waitlist signups. The page must give equal prominence to GroundTruth’s two audiences:

- Founders using Opportunity Discovery to identify and validate what may be worth building.
- Existing product teams using Roadmap Impact to determine whether a market change should alter, accelerate, validate, watch, or leave their roadmap unchanged.

The primary call to action throughout the page is **Join the waitlist**.

## Creative direction

Use the approved **Luminous Intelligence** direction: a near-white pearl canvas, clean contemporary sans-serif typography, electric coral as the primary action color, and cool cyan or cobalt as the secondary signal color. The visual character should feel like a premium AI product: spacious, intelligent, responsive, and alive.

Avoid serif-led editorial styling, terminal aesthetics, generic purple gradients, stock photography, decorative blobs, excessive glass effects, fabricated customer logos, and invented performance claims.

## Hero

Primary headline:

> Turn market change into your next product decision.

Supporting message:

> Find your next opportunity. Know when your roadmap should move.

The hero contains one primary **Join the waitlist** action and an animated product narrative. Two equally weighted inputs—Opportunity Discovery and Roadmap Impact—flow through cited evidence into a Product Decision Brief. The brief shows multiple valid dispositions, including Validate, Watch, and Ignore. A visible human-approval gate separates the decision from an optional PRD.

The hero must not imply that every market signal should become roadmap work or that PRD generation is automatic.

## Page narrative

### 1. Navigation

A compact sticky navigation contains the GroundTruth wordmark, Product, How it works, Solution - dropdown under this - Opportunity Discovery - Roadmap Impact , FAQ and the primary waitlist action. Mobile navigation collapses into an accessible menu.

### 2. Interactive decision flow

The hero visualization communicates:

**Frame or detect → Verify → Decide → Optional PRD**

Visitors can switch between Opportunity Discovery and Roadmap Impact. The visible input signals, evidence labels, recommendation language, and supporting explanation update for the selected journey. Motion uses animated paths, staged card reveals, status pulses, and subtle parallax. It must respect `prefers-reduced-motion`.

### 3. Two equal audience paths

Two balanced journey panels explain the value to each audience:

- **Opportunity Discovery:** begin with a natural-language idea, problem, workflow, target user, or market curiosity; confirm a framing; discover the landscape; review an evidence-backed Opportunity Brief.
- **Roadmap Impact:** detect and verify a market change; compare it against strategy, customers, PRDs, roadmap, and delivery work; review a Roadmap Impact Brief.

Neither panel is visually or structurally secondary.

### 4. Product Decision Brief

An interactive product showcase demonstrates GroundTruth’s differentiated unit of value. Tabs or selectable evidence nodes reveal:

- Verified external facts and cited sources.
- Internal or founder context with provenance.
- Conflicting evidence and unknowns.
- Possible prerequisites and match reasoning.
- Decision options and confidence.

The UI should communicate inspection and traceability, not autonomous certainty.

### 5. Governed workflow

A scroll-led sequence explains that GroundTruth supports decisions before drafting:

1. Frame an opportunity or detect a market event.
2. Verify claims and preserve citations and freshness.
3. Match the evidence to available context.
4. Let a human choose the disposition.
5. Generate an optional PRD only after an eligible decision.
6. Draft optional Jira or Linear tickets only after PRD approval and review.

The sequence uses sticky storytelling on large screens and a compact stepper on small screens.

### 6. Trust architecture

A dedicated section turns the PRD’s safety requirements into buyer-facing proof:

- No market fact without a citation.
- Facts, reports, inferences, conflicts, and unknowns remain distinct.
- Human approval gates precede PRDs and external publication.
- Read access and write access remain separate.
- Tenant-private product context is isolated.
- Access revocation, audit history, and source freshness remain visible.
- Silence is a valid result when no material event is found.

The section must avoid unsupported certifications or security claims.

### 7. Integrations and continuity

Show Linear and Jira as product-context and controlled-delivery endpoints without implying that either is required for founders. Mention uploaded PRDs, strategy documents, roadmap exports, and optional founder notes as context sources. Use text or neutral integration marks unless official assets are added later.

### 8. Waitlist conversion

The final conversion section repeats the two equal audience paths and provides an inline waitlist form. The form requests only email and an audience selection: Founder, Product team, or Exploring both.

Submission behavior:

- Validate email format and display an accessible inline error.
- Show a loading state while submitting.
- Show a clear success state without navigating away.
- Preserve entered data after recoverable errors.
- Use a local simulated success flow until a real waitlist endpoint is provided.

## Interaction and motion

- Smooth anchor navigation with active-section feedback.
- Audience toggle that updates the hero product story.
- Clickable evidence nodes and decision states.
- Scroll-triggered reveals using `IntersectionObserver`.
- Pointer-responsive signal field with restrained movement.
- Animated evidence paths that converge on the brief.
- Expandable trust details and accessible FAQ items.
- Buttons with clear hover, focus, pressed, loading, and success states.
- Reduced-motion mode removes nonessential movement without hiding information.

Animations must clarify causality—signal becoming evidence, evidence becoming a decision, and approval gating downstream artifacts—rather than merely decorate the page.

## Responsive and accessibility requirements

- Fully usable from 320 px mobile widths through large desktop displays.
- Semantic regions, logical heading order, keyboard-operable controls, and visible focus styles.
- Minimum WCAG AA color contrast for text and controls.
- Screen-reader labels for interactive diagrams and status changes.
- Touch targets of at least 44 × 44 px.
- Product diagrams convert to linear card sequences on narrow screens.
- Core content remains available when JavaScript is unavailable; enhancements may progressively activate.

## Implementation shape

The repository currently contains no frontend application, so the implementation will establish a focused static marketing site with minimal build complexity. Components will be separated by responsibility: navigation, hero decision flow, audience paths, decision brief showcase, workflow story, trust section, integrations, waitlist form, and footer.

The implementation plan will select the lightest appropriate toolchain after checking the local runtime. The page must be easy to run locally, deploy as static assets, and extend when a real waitlist backend becomes available.

## Verification

- Run the project’s build and static checks.
- Verify keyboard navigation and reduced-motion behavior.
- Test the audience toggle, evidence interactions, accordions, and waitlist states.
- Inspect desktop and mobile layouts in a browser.
- Confirm that both audiences receive equal prominence in copy, hierarchy, and interaction.
- Confirm that no unvalidated metric, customer claim, security certification, or autonomous behavior appears.

## Research influence

The page structure adapts current product-led patterns observed on Linear, Adapt, Prodora, Productboard, and Jira Product Discovery: concise benefit-led heroes, embedded product UI, progressive workflow storytelling, and strong continuity from insight to delivery. GroundTruth’s distinct identity comes from its two-mode entry, citation-first decision brief, visible uncertainty, and explicit human approval gates.
