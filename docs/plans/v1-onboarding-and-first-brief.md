# V1 plan: onboarding to first Roadmap Impact Brief

Status: proposed, waiting for founder approval. Nothing here is built yet.

This plan scopes the first product release of VerityLoop, a pilot with 5 to 8 invited product teams. It covers the onboarding screens, the user flow, the P0 feature list, the data model, the delivery sequence, and the release gates. It follows the trimmed PRD section "VerityLoop v1: Roadmap Impact" and its first engineering slice. Submit one competitor change, upload one roadmap export, get a cited brief with explicit unknowns, and record a human decision.

## Decisions to approve before building

Each decision has a recommendation. Building starts after all four are answered.

| ID | Decision | Recommendation | Why |
| --- | --- | --- | --- |
| D1 | First product path (PRD OD-1) | Roadmap Impact only. Founder Opportunity Discovery waits. | The buyer pays more, the input is concrete, and the evidence engine carries over to founder mode later. |
| D2 | Stack | Next.js app in `apps/product`, Supabase (Postgres, Auth, Storage, row-level security), Inngest for background jobs, Vercel hosting, Claude API for model calls. | Supabase already runs the waitlist. A brief takes 1 to 3 minutes, so it needs durable, retryable background steps that a request handler can't provide. |
| D3 | Who gets in first | Invite-only. Batch 1 is waitlist members who picked "Product team" or "Exploring both". | The early-access offer promises invites in batches. Founder-only signups get access when D1's second path ships. |
| D4 | Retrieval approach for matching | Send the whole normalized roadmap to the model when it has 600 items or fewer. Add Postgres full-text prefiltering above that. Add embeddings only if match precision misses its gate. | Pilot roadmaps are a few hundred rows. Fewer moving parts means fewer ways to be wrong. |

## The activation metric

The product works for a pilot team when they reach their first decision. The plan optimizes one number.

**Time to first decision.** Minutes from first sign-in to a saved disposition on a real brief. Target a median under 20 minutes. Every onboarding screen must shorten this or protect trust. Anything else waits.

## User flow

The flow has three stages. Set up context once, analyze a change, decide.

```text
Invite email
  -> Sign in (magic link)
  -> 1. Product profile        draft from your website, edit, confirm
  -> 2. Competitors            1 to 5, with official pages
  -> 3. Roadmap context        upload CSV or Markdown, fix statuses, exclude sensitive items
  -> 4. Confirm context        creates context version 1
  -> 5. Analyze a change       paste a competitor URL
  -> 6. Processing             fetch, extract, verify, match, write
        -> 6b. Not verified    no brief, shows what was found and what to try
  -> 7. Roadmap Impact Brief   facts, coverage, unknowns, options
  -> 8. Decide                 disposition, rationale, feedback, export
  -> 9. Home                   briefs and decisions, analyze another change
```

A returning user lands on Home. Editing the profile, competitors, or roadmap creates a new context version. Old briefs keep the version they used.

## Screens

The screen designs live on the linked Design canvas. Each screen below lists its job, its content, and its edge states.

### 0. Sign in

- Magic-link email. No passwords.
- An address that isn't invited sees "You're on the early-access list. We'll email you when your batch opens." Nothing else is created.

### 1. Product profile

- One field first. "Your product's website." VerityLoop reads the public site and drafts the profile.
- The draft fills product description, target customer, and core jobs. Each drafted field shows a "Drafted from your site" label until the user edits it.
- The user adds three things the site can't tell us. Strategic goals, explicit non-goals, and planning horizon.
- No URL, or the fetch fails, gives the same form, empty, with an example under each field.
- The Continue button stays disabled until the user confirms the profile. No brief is generated from an unconfirmed profile (PRD WS-2 acceptance gate).

### 2. Competitors

- Suggested competitors from the profile, labeled "Suggested, not verified". The user keeps, removes, or adds.
- Each competitor needs one official page, such as a changelog, pricing page, or product page.
- Range is 1 to 5. Five keeps the pilot's cost and noise bounded.

### 3. Roadmap context

- Upload a Linear CSV export, a Jira CSV export, or Markdown or plain-text PRDs and roadmap docs.
- After upload, show a preview. Item count, detected columns, and how each source status maps to shipped, active, planned, rejected, blocked, duplicate, or unknown.
- The user can change a status mapping and exclude items or whole projects. Excluded items are never sent to a model (PRD WS-6).
- An empty state explains what a good upload looks like and links to the Linear and Jira export steps.
- Skip is allowed. The brief then says internal coverage is unknown instead of guessing.

### 4. Confirm context

- One summary card. Profile, competitors, and roadmap items, with counts and excluded items.
- Confirm creates context version 1. The primary button reads "Analyze your first change".

### 5. Analyze a change

- One field. "Paste a link to a competitor change." It takes a changelog entry, pricing page, launch post, or docs page.
- Optional note. "Why this caught your eye."
- Under the field, three example links from the user's competitor pages, so the first run needs no hunting.

### 6. Processing

- Five visible steps with live status. Fetching the source. Extracting claims. Checking each claim against the source. Matching your roadmap. Writing the brief.
- Typical time is shown as an estimate, and the user can leave. The brief appears on Home when ready.
- 6b, not verified. If no material claim survives verification, there's no brief. The screen shows what was found, why it failed, and what to try, such as an official changelog link instead of a news article (trimmed PRD CF-3).

### 7. Roadmap Impact Brief

The brief puts evidence before any recommendation (PRD RIB-7). Sections in order:

1. **Headline.** One sentence naming the change and its status.
2. **What changed.** Before and after when available. Source link, retrieval time, and an evidence label on each claim. Labels are Verified fact, Vendor claim, and Inference.
3. **Why it may matter.** Relevance to the target customer, goals, and non-goals.
4. **Why it may not matter.** The counter-case, always present.
5. **Your current coverage.** Matched roadmap items with status, freshness, and why each matched. The user can reject a match.
6. **Possible prerequisites.** Each labeled Verified, Inferred, or Unknown, and marked as needing engineering review.
7. **Conflicts and unknowns.** Contradicting items and missing evidence.
8. **Options.** Ignore, Watch, Validate, Accelerate, and Reconsider, each with its tradeoff.
9. **Recommendation.** Shown only when evidence clears the quality bar. Otherwise the brief shows "Questions to resolve first".

Clicking any claim opens its source quote in a side panel.

### 8. Decide

- Pick a disposition. A rationale is required for Accelerate and Reconsider (PRD DEC-2).
- If the user's choice differs from the recommendation, both rationales are kept (PRD RIB-10).
- One feedback tap. Useful, Irrelevant, or Incorrect, with an optional note.
- Export the brief and decision as Markdown with its evidence snapshot and timestamps.

### 9. Home

- A list of briefs with change, competitor, status, and decision.
- An empty state with one action, "Analyze a change".
- Settings holds context versions, competitors, uploads, and workspace data deletion.

## P0 features

P0 means the pilot can't run without it. Each item maps to the trimmed PRD's core features (CF) or PRD requirement IDs.

| # | Feature | Maps to |
| --- | --- | --- |
| 1 | Invite-only magic-link sign-in and a single-owner workspace | WS-1 (owner only) |
| 2 | Product profile with website-drafted fields, confirmation, and versioning | CF-1, WS-2, WS-5 |
| 3 | Competitor list with official pages | CF-1 |
| 4 | Roadmap upload from Linear CSV, Jira CSV, and Markdown, with status mapping, exclusions, and corrections | CF-1, CF-4, INT-5, CTX-3, CTX-4, CTX-6, WS-6 |
| 5 | Change capture by URL with snapshot, content hash, and duplicate suppression | CF-2 |
| 6 | Claim extraction with a quote for every claim, deterministic quote check, model entailment check, and an unverified state | CF-3, MI-4 |
| 7 | Roadmap matching with rationale and rejectable matches | CF-4, CAP-2, CAP-3 |
| 8 | Brief generation as validated structured output, with recommendation gating | CF-5, RIB-1 to RIB-9 |
| 9 | Decision record, feedback, and Markdown export | CF-6, DEC-1, DEC-2, DEC-4, RIB-10 |
| 10 | Eval harness with a golden set, run in CI | PRD section 17 |
| 11 | Trust baseline. Workspace isolation, untrusted-content handling, per-workspace spend cap, and data deletion | Trimmed PRD constraints, OD-5 |
| 12 | Activation analytics from sign-in to first decision | Trimmed PRD goal and measures |

### Not in v1

Each item below is real future work. None blocks a useful first brief and recorded decision.

- Scheduled monitoring of competitor pages. It comes first after pilots run the manual path.
- Linear OAuth and Jira OAuth connectors. Uploads come first (OD-3).
- Automatic competitor discovery and new-entrant detection.
- Founder Opportunity Discovery.
- PRD drafting, ticket drafting, and publishing to trackers.
- Multiple reviewers, comments, and approval workflows.
- PDF and DOCX upload.
- Embeddings, unless D4's gate fails.

## Data model

The domain decides the structure, so invalid states can't be stored. Every table carries `workspace_id`, and row-level security enforces it.

```text
Workspace       id, name, owner_id
ContextVersion  id, workspace_id, version, profile, competitors, confirmed_at   immutable
Upload          id, workspace_id, kind (linear_csv | jira_csv | markdown), file_ref, row_count
Artifact        id, workspace_id, upload_id, kind, title, body, source_status,
                status (shipped | active | planned | rejected | blocked | duplicate | unknown),
                status_overridden, excluded, source_url, source_updated_at
Source          id, url, fetched_at, http_status, content_hash, snapshot_ref
Change          id, workspace_id, url, note, state, source_id, context_version_id
Claim           id, change_id, text, label (fact | vendor_claim | inference),
                quote, quote_offset, verification (verified | unsupported)
Match           id, change_id, artifact_id, rationale, rejected
Brief           id, change_id, context_version_id, content, model, prompt_version   immutable
Decision        id, brief_id, disposition, rationale, system_recommendation, decided_by, decided_at
Feedback        id, brief_id, verdict (useful | irrelevant | incorrect), note
```

A change moves through one state machine. Code rejects any other transition, and a test proves it.

```text
submitted -> fetching -> extracting -> verifying -> matching -> writing -> ready
                 |            |            |            |          |
                 +------------+------------+------------+----------+--> failed
verifying -> unverified        (no material claim survived)
```

Each background step is idempotent. A retried step converges on the same rows, keyed by change ID and step.

## Model pipeline

Page content and uploads are untrusted input. The model calls that read them have no tools, so injected text can't trigger an action. Every model output is parsed against a schema at the boundary.

1. **Fetch.** Download the page, store the snapshot and hash, and reuse a recent snapshot of the same URL.
2. **Extract.** The model returns claims, each with an exact quote from the snapshot and a label.
3. **Verify.** Code checks that each quote exists in the snapshot. A model then checks that the quote supports the claim. Claims that fail either check are dropped from the brief and listed as unsupported.
4. **Match.** The model gets the verified claims, the confirmed profile, and the non-excluded roadmap items. It returns candidate matches with rationales and status.
5. **Write.** The model fills the brief schema. Every factual sentence references claim IDs or artifact IDs. Code rejects a brief that cites an ID that doesn't exist.
6. **Gate.** Code shows a recommendation only when verified claim count, match confidence, and context freshness clear configured thresholds. Otherwise the brief shows questions.

Model choice per step comes from the eval harness, not taste. Start with the latest Sonnet model for extraction and writing and the latest Haiku model for verification, then compare on the golden set.

## Delivery sequence

Each PR is one verifiable unit and lands on its own, in this order. Scaffold comes first, then the domain, then the features that use it. The eval harness lands before the pipeline it grades.

| PR | Branch | Delivers | Proven by |
| --- | --- | --- | --- |
| 1 | `chore/product-foundation` | Supabase client, invite-only magic-link auth, app shell, product CI for lint, typecheck, and tests | An invited email signs in. A non-invited email sees the waitlist message. CI is green. |
| 2 | `feat/domain-schema` | Migrations, row-level security, typed models, change state machine | Tests show workspace A can't read workspace B, and every forbidden state transition is rejected. |
| 3 | `feat/onboarding-profile` | Screens 1, 2, and 4, with website drafting and context versioning | Screenshots of each screen and its empty and error states. Editing a confirmed profile creates version 2. |
| 4 | `feat/roadmap-upload` | Screen 3 with Linear CSV, Jira CSV, and Markdown parsing, status mapping, and exclusions | Parser tests on real export samples. Excluded items never appear in a model request log. |
| 5 | `feat/eval-harness` | Golden set of 25 real public changelog entries and a synthetic roadmap, scorers, CI job | The harness runs on fixtures and reports each metric. |
| 6 | `feat/change-verification` | Screens 5, 6, and 6b. Fetch, extract, verify, and the unverified path | Eval report for factuality and citation support. A news article with no primary source ends unverified. |
| 7 | `feat/impact-brief` | Matching, brief generation, gating, and screen 7 | Eval report for match precision, unknown honesty, and conflict preservation. |
| 8 | `feat/decision-record` | Screens 8 and 9, feedback, and Markdown export | End-to-end run from sign-in to exported decision, timed against the activation target. |
| 9 | `chore/pilot-readiness` | Spend cap, data deletion, error tracking, analytics events, invite sending from the waitlist | Deletion test removes every row and file for a workspace. The funnel shows each step. |

PRs 3, 6, 7, and 8 change what a user sees. They're reviewed with screenshots of every state before merge. PRs 1, 2, 4, 5, and 9 are reviewed on their tests and logs.

## Release gates for the pilot

The pilot opens only when every gate passes on the golden set and on 10 real changes we run ourselves.

| Gate | Threshold | Source |
| --- | --- | --- |
| Citation support | 95% or more of displayed claims are supported by their quote | PRD section 17 |
| Event factuality | 95% or more of material claims are correct | PRD section 17 |
| Unknown honesty | No confident answer on cases built to be unanswerable | PRD section 17 |
| Conflict preservation | 100% of planted conflicts surface | PRD section 17 |
| Match precision | 85% or more of top matches judged relevant | PRD section 17 |
| Workspace isolation and state transitions | 100% of forbidden reads and transitions rejected | PRD section 17 |
| Brief latency | Ready within 3 minutes at the 95th percentile | This plan |
| Time to first decision | Median under 20 minutes across our own runs | This plan |

The PRD calls these thresholds operating targets. Passing them doesn't prove the product is commercially useful. The pilot measures that.

## Estimate

About 5 weeks of focused work for one engineer, from PR 1 to pilot invites. This is a guess. PRs 6 and 7 carry most of the risk, because they depend on model quality we haven't measured yet.

## Risks

- **Model quality misses the gates.** Caught by PR 5 before any pilot sees a brief. The response is prompt and model changes measured on the golden set, not threshold changes.
- **Uploads are too stale or sparse to match well.** The brief reports low context freshness and asks for evidence. Pilot interviews decide whether a Linear connector moves up (OD-3).
- **Competitor pages block automated fetching.** The unverified state explains it. The user can paste the page text as a fallback, labeled as user-provided.
- **Cost per brief is unknown.** The spend cap per workspace bounds it. PR 6 and PR 7 eval reports record cost per brief.
- **Customer data trust.** Retention, model-provider terms, and no-training commitments must be written before the first pilot upload (OD-5).

## Build in public

Each PR maps to one post. Post the real result, including misses.

1. PR 2. "Making illegal states unrepresentable in an AI product."
2. PR 5. "I wrote the evals before the pipeline. Here's the golden set."
3. PR 6. "How we stop an LLM from citing things the page doesn't say."
4. PR 7, with D4. "Why we didn't start with a vector database."
5. PR 8. The first end-to-end brief, timed, with real eval numbers.
