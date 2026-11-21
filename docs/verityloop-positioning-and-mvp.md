# VerityLoop: discovery, roadmap decisions, and focused extensions

Status: proposed product direction, revised on 13 November 2026. Discovery and roadmap decisions are the core. Testing is an optional action within a decision workflow. This document does not describe shipped capabilities.

## Contents

- [Pitch](#pitch)
- [The core problem](#the-core-problem)
- [Two primary journeys](#two-primary-journeys)
- [Core features](#core-features)
- [Actions and extensions](#actions-and-extensions)
- [Focused MVP](#focused-mvp)
- [Concrete examples](#concrete-examples)
- [Why someone would pay](#why-someone-would-pay)
- [Product boundaries and success measures](#product-boundaries-and-success-measures)

## Pitch

**Long-term ambition:** Cursor for product managers.

**Starting point:** Help founders discover opportunities and product teams decide how to respond to customer and market changes.

**Main punch line:** Find what matters. Decide what to build. Move it forward.

**Combined pitch:** We’re building Cursor for product managers, starting with evidence-backed opportunity discovery and roadmap decisions.

**Customer-facing description:** VerityLoop connects market changes, customer signals, and your product context to help you decide what is worth pursuing—and carry out the next step with the evidence and reasoning intact.

The analogy explains the ambition. The starting promise explains the initial job. Use “starting with,” without implying a comprehensive PM workspace exists or an affiliation with Cursor.

The product supports generic opportunities and features. AI helps perform the work; customers do not need to be building AI features.

## The core problem

Founders and product teams repeatedly face decisions with fragmented evidence:

- Is this a worthwhile customer problem or just a plausible idea?
- Does this competitor move matter to our customers?
- Are repeated requests pointing to a missing capability, an existing-product problem, or different needs across segments?
- Should we change our plans, investigate further, or deliberately do nothing?
- What evidence would change that choice?

VerityLoop's main work is investigating and advancing these decisions. Its primary object is an opportunity or product decision, with sources, assumptions, options, actions, and results attached.

A decision can lead to research, validation, delivery, monitoring, or no action. A test suite is one possible linked artifact.

## Two primary journeys

### Opportunity Discovery — founders

Start with an idea or problem. VerityLoop investigates existing solutions, customer pain, workarounds, and evidence gaps to help decide what to validate before building.

A founder can start with one sentence. No product, prototype, customer base, roadmap, or competitor list is required. Public research can identify promising questions, but real interviews, behavior, and commitments are needed to establish demand.

Possible outcomes: narrow the audience, change the problem hypothesis, investigate alternatives, run a customer validation, pursue a bounded opportunity, or stop.

### Roadmap Impact — product teams

Start with a market change, such as a competitor launching a feature. VerityLoop checks it against strategy, customer feedback, existing capabilities, and planned work to help decide whether to act, investigate, watch, or ignore.

Customer problems and business questions are additional starting points. Competitor and market intelligence remain first-class inputs. A market announcement does not independently establish customer demand.

Possible outcomes: preserve the roadmap, revise a proposal, investigate demand, prioritize an existing issue, propose a new initiative, or watch for a defined condition.

Both journeys share:

**Signal or question → context and evidence → options and unknowns → human decision → next action → new evidence.**

## Core features

| Feature | What it does | User-visible result |
|---|---|---|
| 1. Product and opportunity context | Captures target users, goals, constraints, hypotheses, existing capabilities, and relevant commitments, asking only for what is needed. | A shared understanding that the user can inspect and correct. |
| 2. Market and customer investigation | Researches relevant alternatives and changes; analyzes supplied conversations, feedback, behavior, and commercial context. | Evidence connected to the current question rather than an undirected information feed. |
| 3. Relevance and decision analysis | Explains who is affected, strategic fit, overlap with existing work, alternatives, contradictions, and consequential unknowns. | A source-linked recommendation with explicit tradeoffs. |
| 4. Decision and action workspace | Records the human choice, rationale, next action, owner, and evidence needed to revisit it. Executes supported bounded tasks and tracks handoffs. | Progress on an opportunity or decision, including a supported choice to stop. |
| 5. Decision memory and follow-up | Preserves results and corrections; makes new evidence comparable with prior assumptions. | A decision can be revisited without reconstructing the whole investigation. |

Customer signals include reported needs, observed behavior, buying/renewal context, workarounds, and service effort. Keep these distinctions and distinguish customer evidence from market context. Deduplicate repeated messages where identity is known; missing identity or causality remains unknown.

## Actions and extensions

The user chooses an action based on the current uncertainty. Testing does not become a compulsory step.

| Decision need | Possible action | Honest outcome |
|---|---|---|
| Understand an opportunity | Complete a scoped alternatives/workflow investigation and reconcile it with supplied customer evidence. | A narrowed opportunity, unresolved assumptions, and a grounded next decision. |
| Establish demand | Prepare a focused interview or pilot, then synthesize the real results when available. | Preparation remains preparation until real evidence returns. |
| Respond to a market change | Compare the verified event against customer context and current commitments. | A recorded response and an approved change proposal or reason to keep the plan. |
| Explore a solution | Prepare a prototype brief or support a focused prototype comparison. | An option to examine; user preference needs human evidence. |
| Choose an implementation | Curate a bounded model/framework/architecture shortlist and, where feasible, run a comparison. | Observed tradeoffs on the tested configuration; public claims stay separate. |
| Check approved behavior | Define criteria and run a suitable browser/API/MCP/programmatic test. | Evidence of tested behavior, including failures and unknowns. |
| Move into delivery | Draft a PRD or tickets with the approved rationale and scope. | Reviewed work ready for the existing delivery system; drafting is not implementation. |

These are extensions of the core decision loop, not commitments to build every capability in the MVP. External outreach, publishing, and commitments require explicit authorization.

For test execution, prefer existing runners and evaluation systems where practical. Keep expected behavior independent of the implementation being tested, use code for exact checks, calibrate interpretive graders with people, and distinguish product failures from execution failures. Passing tests does not establish market demand or business impact.

## Focused MVP

**One idea, customer problem, or market change → one contextual decision → one supported next action → a saved result.**

### Initial product scope

1. Two guided starting flows: Opportunity Discovery and Roadmap Impact.
2. A lightweight profile and uploaded/linked product or customer context.
3. A bounded investigation using public sources and the supplied evidence.
4. A decision brief containing options, contradictions, unknowns, and a next action.
5. A human decision record.
6. A small action set: deepen a specific research question, analyze supplied validation results, or prepare a validation/build brief from the decision.
7. An evidence and action history that supports returning with new information.

The initial agent executes research and synthesis tasks; the user does not merely receive a list of searches to perform. Where customer participation or product implementation is required, record that work as pending and distinguish a prepared plan from a completed validation.

The first release's action set must be described honestly: it completes bounded investigations and decision preparation, but does not autonomously prove demand or ship a product. Paid pilots must establish that the saved effort and decision usefulness are worth buying. If users only value product execution, that is evidence to change the scope, not a reason to pretend the initial version already provides it.

### Deferred extensions

Add one execution extension after the core earns repeated use. Candidate extensions include prototype evaluation, model/configuration comparisons, or targeted acceptance checks. Choose based on recurring customer decisions.

Defer broad connector coverage, continuous autonomous monitoring, a universal test harness, full project management, automatic prioritization, autonomous implementation, and generalized outcome attribution.

## Concrete examples

Both examples are fictional.

### Founder: client approval delays

A founder says: “I want to build an AI tool that chases agencies' clients for design approvals.”

VerityLoop examines existing approval products and workarounds, and analyzes the founder's supplied notes. It surfaces competing explanations: missing reminders, confusing versions, and access friction.

The founder decides to investigate access friction before committing to an AI reminder product. VerityLoop prepares focused questions and an observation plan. The founder conducts the research and brings back results. VerityLoop organizes supporting and contrary evidence and helps narrow the opportunity.

A prototype brief may follow. If a prototype later exists and uncertainty concerns its behavior, a testing extension can check the agreed flow. The discovery journey is already useful before that point.

### Product team: competitor approval assistant

A competitor launches an approval assistant. VerityLoop verifies the announcement and compares it with the team's strategy, relevant customer feedback, existing reminders, and planned access improvements.

Suppose the evidence suggests the team should keep the access improvement and investigate demand for summaries. The PM records that response. VerityLoop prepares a targeted validation brief and a reviewable update to the affected initiative, with source links.

The team later returns with interviews or usage evidence. VerityLoop helps reassess the decision. If a feature is approved and built, acceptance checks can be added. A successful outcome can also be a justified decision not to alter the roadmap.

## Why someone would pay

The payment hypothesis is reduced recurring work to investigate product questions, reconcile conflicting evidence, align a decision, and move the next step forward while preserving company context.

Potential advantages over a one-off assistant conversation must be demonstrated:

- Relevant product and customer context stays reusable and correctable.
- Decisions, assumptions, actions, and results are connected across time and people.
- New evidence can be assessed against the rationale behind existing plans.
- Supported follow-up work executes in context, with less manual copying and re-explanation.

General-purpose assistants can also research, remember context, generate artifacts, and operate tools. These benefits are not automatically unique or sufficient. Test whether the specialized workflow materially reduces effort or improves useful outcomes relative to a customer's existing setup.

Current competitor descriptions already overlap with evidence-backed discovery and agentic product work, including [Productboard Spark](https://www.productboard.com/product/spark/). Do not claim a proven moat from a feature list.

## Product boundaries and success measures

Design checks:

- The primary workspace revolves around opportunities and decisions.
- Users can complete a useful founder journey without a running product.
- Product teams can choose watch or ignore without creating tests.
- Validation actions are chosen to resolve a named uncertainty.
- Sources distinguish observation, report, inference, and assumption.
- Drafting, execution, observed behavior, and actual customer outcomes remain separate.
- Human users own priorities and external commitments.

Pilot with both founders and product teams, assessing the groups separately. Measure total investigation/decision-preparation effort, correction burden, evidence quality, repeated use, next actions actually completed, and willingness to pay. For validation, measure learning gained rather than the number of plans generated.

Collect examples of decisions narrowed, deferred, reversed, or advanced because of the work. These are useful qualitative outcomes, not proof that VerityLoop caused revenue gains.

The central question for the pilot is: does this workflow help users make and advance consequential product decisions better than their current process? Testing extensions are valuable only insofar as they support that job.
