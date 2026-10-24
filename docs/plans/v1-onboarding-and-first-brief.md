# V1 plan: onboarding to first decision, for founders and product teams

Status: proposed, revision 2, waiting for founder approval. Nothing here is built yet.

This plan scopes the first product release of VerityLoop, a pilot with invited founders and product teams. It covers both product modes, the onboarding flow and screens, the P0 feature list, the data model, the delivery sequence, and the release gates.

Revision 2 changes three things from revision 1.

1. Founder mode (Opportunity Discovery) is in v1, alongside Roadmap Impact.
2. Roadmap context comes from OAuth connectors for Linear and Jira. CSV upload is gone.
3. Onboarding is redesigned around connecting and confirming instead of typing.

The screens are a clickable prototype at https://claude.ai/artifact/S3t8e2eqLAc5zbdxU45PsE (private until shared).

## Decisions to approve before building

Each decision has a recommendation. Building starts after all five are answered.

| ID | Decision | Recommendation | Why |
| --- | --- | --- | --- |
| D1 | Product modes in v1 | Both. One entry screen sends a website to Roadmap Impact and an idea to founder mode. | The waitlist and the landing page promise both. They share one evidence engine, so the second mode costs screens and prompts, not a second system. |
| D2 | Stack | Next.js in `apps/product`, Supabase (Postgres, Auth, Storage, row-level security), Inngest for background jobs, Vercel hosting, Claude API. | Supabase already runs the waitlist. Briefs and discovery take minutes, so they need durable, retryable background steps. |
| D3 | Connector plumbing | Nango for OAuth, token storage, and refresh. Our code owns sync and normalization. | Linear and Jira are P0, and Notion, Confluence, Asana, ClickUp, GitHub, and Google Drive follow. One open-source broker beats eight hand-built OAuth flows. It can be self-hosted if a pilot customer asks. |
| D4 | Who gets in first | Invite-only, in batches from the waitlist. Both audiences are invited. | The early-access offer promises batched invites. |
| D5 | Retrieval for roadmap matching | Send the whole normalized roadmap to the model when it has 600 items or fewer. Add Postgres full-text prefiltering above that. Add embeddings only if match precision misses its gate. | Pilot roadmaps are a few hundred items. Fewer moving parts means fewer ways to be wrong. |

## Onboarding principles

These come from how fast, well-loved products onboard, adapted to VerityLoop.

1. **Ask one question first.** The entry screen has one field. A website means an existing product. A sentence means an idea. The product picks the mode, and the user can switch.
2. **Connect, don't type.** OAuth into Linear or Jira replaces uploads and forms. Attio's recommended first step is connecting email and calendar so the CRM builds itself ([Attio help](https://attio.com/help/academy/introduction/email-sync-people-companies)). We do the same with the tracker and the website.
3. **Confirm, don't fill.** Every field arrives drafted, labeled with where it came from. The user edits only what's wrong.
4. **Few steps, every one skippable except confirm.** Linear's onboarding is 7 screens and about a minute, with no tours or checklists ([Candu teardown](https://www.candu.ai/blog/linear-onboarding-teardown)). Our setup is 4 screens after sign-in.
5. **Deliver value during setup.** While the tracker syncs, VerityLoop reads competitors' official pages and prepares the first brief. The last setup screen says "Your first brief is ready", so the user never hunts for a link.
6. **Remove every step before the value moment.** Defer settings, invites, and notifications until after the first decision ([Appcues](https://www.appcues.com/product-adoption-academy/value-first-onboarding/reduce-your-time-to-value)).
7. **Human onboarding for the pilot.** Superhuman onboarded early users one-to-one and turned them into its loudest fans ([First Round Review](https://review.firstround.com/superhuman-onboarding-playbook/)). Every pilot team gets a 20-minute call with a founder, which is the "direct line to the founders" the offer promises.

Most of these sources are vendor blogs and teardowns. They're design input, not proof. The pilot measures what works.

## The activation metric

**Time to first decision.** Minutes from first sign-in to a saved decision on a real brief, in either mode. Target a median under 10 minutes for product teams and under 15 minutes for founders. Founder discovery does more research, so it takes longer.

## User flow

```text
Invite email
  -> Sign in                Google, or an email link
  -> Start                  "Paste your website, or describe your idea"
       |
       +-- website --> PRODUCT TEAM (Roadmap Impact)
       |     1. Connect     Linear or Jira by OAuth, pick teams, exclude sensitive projects
       |     2. Product     profile drafted from the website and tracker initiatives, confirm
       |     3. Competitors suggested, keep or remove, official pages prefilled
       |     4. Ready       "Your first brief is ready" (prepared during setup)
       |     -> Brief -> Decide -> Home
       |     Later: Analyze a change -> Processing -> Brief, or Not verified
       |
       +-- idea -----> FOUNDER (Opportunity Discovery)
             1. Clarify     0 to 3 questions, each says why it matters
             2. Framing     pick 1 of 2 to 4 market framings, edit in plain words
             3. Landscape   direct, adjacent, substitute, emerging, and failed approaches, cited, correctable
             4. Opportunity Brief -> Decide (Ignore, Watch, Validate, Pursue, Reframe) -> Home
```

A founder who later has a product and a tracker can connect them and move to Roadmap Impact. Earlier decisions keep the evidence they used (PRD Stage 0).

## Screens

Each screen lists its job, its content, and its edge states. The prototype shows each one.

### Shared

**Sign in.** Continue with Google, or get an email link. An address that isn't invited sees "You're on the early-access list" and nothing is created.

**Start.** One large field. "Paste your website, or describe what you want to build." Two example chips show one of each. VerityLoop detects the input type and shows the path it picked, such as "Existing product. We'll check market changes against your roadmap." A link switches paths.

### Product team

**1. Connect your tracker.** Tiles for Linear and Jira Cloud. Each connects through OAuth with read-only scopes. After connecting, the user picks teams or projects and can exclude sensitive projects, which are never sent to a model (PRD WS-6). The screen shows sync progress, item counts, and last sync time (PRD INT-8). Notion, Confluence, Asana, ClickUp, GitHub, and Google Drive show as "Next", with a button to request one. "Skip for now" is allowed, and briefs then say internal coverage is unknown.

**2. Your product.** The website and connected tracker draft the profile. Description, target customer, and core jobs come from the site. Strategic goals come from Linear initiatives or Jira epics. Non-goals and planning horizon are the only fields usually typed. The user confirms before continuing (PRD WS-2 acceptance gate).

**3. Competitors.** Suggested from the profile and labeled "Suggested, not verified". Official changelog or pricing pages are prefilled. Range is 1 to 5.

**4. Ready.** "Your first brief is ready." While the user set up, VerityLoop fetched the latest entry from each competitor's page and analyzed the most relevant one. The screen shows that brief's headline and an Open button, plus a one-line summary of the confirmed context, which becomes context version 1. If no recent change verifies, the screen offers "Analyze a change" instead.

**Analyze a change, Processing, Not verified, Brief, Decide, and Home** are unchanged from revision 1. Briefs show evidence before any recommendation, label each claim as Verified fact, Vendor claim, or Inference, and show a recommendation only when evidence clears the bar.

### Founder

**1. Clarify.** Zero to three questions, asked only when the idea is too broad to bound (PRD OPP-2). Each question says why it matters and offers tappable answers plus "Other".

**2. Framing.** Two to four framings of the market. Each shows the target user, the buyer when different, the job, substitutes, example products, what's excluded, and the assumptions (PRD Stage 0). The user picks one and can edit it in plain words. Discovery doesn't start from an unconfirmed framing.

**3. Landscape.** Products grouped as direct, adjacent, substitute, emerging, and failed. Each entry has a source link, why it matched, and its evidence label. The user can remove, add, or move entries, and corrections apply immediately. Empty groups say what was searched.

**4. Opportunity Brief.** The PRD's 12 sections condensed into one readable page. Opportunity headline, what the market shows, existing alternatives, problem evidence, counter-evidence, target-user hypothesis, wedge hypotheses, assumptions ranked by risk, and the smallest validation tests. The decision panel offers Ignore, Watch, Validate, Pursue, and Reframe, with a rationale required for Pursue and Reframe.

## P0 features

P0 means the pilot can't run without it.

| # | Feature | Maps to |
| --- | --- | --- |
| 1 | Invite-only sign-in with Google or an email link, and a single-owner workspace | WS-1 (owner only) |
| 2 | Start screen that routes a website or an idea to the right mode | PRD Stage 0, OPP-1 |
| 3 | Linear and Jira Cloud OAuth connectors, read-only, with team selection, exclusions, normalization, and sync status | INT-1, INT-2, INT-3, INT-7, INT-8, CTX-1 to CTX-4, WS-6 |
| 4 | Product profile drafted from website and tracker, with confirmation and versioning | WS-2, WS-5 |
| 5 | Competitor suggestions with prefilled official pages | Trimmed PRD CF-1 |
| 6 | First brief prepared during setup | Activation metric |
| 7 | Change capture by URL, with snapshot, hash, and duplicate suppression | CF-2 |
| 8 | Claim extraction with an exact quote per claim, a code quote check, a model support check, and a Not verified state | CF-3, MI-4 |
| 9 | Roadmap matching with rationale and rejectable matches | CF-4, CAP-2, CAP-3, CTX-6 |
| 10 | Roadmap Impact Brief with recommendation gating | CF-5, RIB-1 to RIB-10 |
| 11 | Founder clarify, framing, and confirmed boundary | OPP-1, OPP-2, PRD Stage 0 |
| 12 | Founder landscape discovery with citations and corrections | WS-3, PRD Stage 1 and 2 |
| 13 | Opportunity Brief | PRD section 10.1 |
| 14 | Decision record, feedback, and Markdown export for both brief types | CF-6, DEC-1 to DEC-4 |
| 15 | Eval suite in CI covering both modes | PRD section 17 |
| 16 | Trust baseline. Workspace isolation, read-only scopes, untrusted-content handling, per-workspace spend cap, data deletion | Trimmed PRD constraints, OD-5 |
| 17 | Activation analytics from sign-in to first decision, per mode | Trimmed PRD goal and measures |

### Not in v1

- Scheduled monitoring of competitor pages. The one-time fetch in feature 6 is the seed for it.
- Connectors beyond Linear and Jira Cloud. Jira Data Center is out.
- Writing to trackers. PRD drafting, ticket drafting, and publishing.
- Multiple reviewers, comments, and approval workflows.
- File upload of any kind.
- Embeddings, unless D5's gate fails.

## Connectors

- **Linear.** OAuth 2.0 with `scope=read` only ([Linear OAuth docs](https://linear.app/docs/api/oauth-2-0-authentication)). Sync teams, projects, initiatives, issues, statuses, labels, and relations.
- **Jira Cloud.** Atlassian OAuth 2.0 (3LO) with `read:jira-work`, `read:jira-user`, and `offline_access` for refresh tokens. The Atlassian app must switch its distribution to "Sharing", which needs a privacy policy URL ([Nango Jira guide](https://nango.dev/docs/integrations/all/jira)). Confirm both against Atlassian's own docs during PR 3.
- **Sync model.** Full sync on connect, then a periodic resync every 6 hours. Webhooks wait for P1 (PRD INT-4). Removed access stops future syncs and deletes that source's items (PRD INT-3).
- **Normalization.** Provider fields map to one `Artifact` shape with the source-native status kept beside the normalized one (PRD INT-7, CTX-2, CTX-3).

## Data model

Every table carries `workspace_id`, and row-level security enforces it.

```text
Workspace       id, name, owner_id, mode (roadmap_impact | founder)
Connection      id, workspace_id, provider (linear | jira), nango_connection_id, scopes,
                selected_scopes, excluded_scopes, last_synced_at, status
ContextVersion  id, workspace_id, version, profile, competitors, framing, confirmed_at   immutable
Artifact        id, workspace_id, connection_id, provider_id, kind, title, body, source_status,
                status (shipped | active | planned | rejected | blocked | duplicate | unknown),
                status_overridden, excluded, source_url, source_updated_at
Source          id, url, fetched_at, http_status, content_hash, snapshot_ref
Claim           id, source_id, text, label (fact | vendor_claim | inference),
                quote, quote_offset, verification (verified | unsupported)
Change          id, workspace_id, url, note, state, source_id, context_version_id
LandscapeEntry  id, workspace_id, context_version_id, name, url,
                group (direct | adjacent | substitute | emerging | failed),
                rationale, claim_ids, user_action (kept | removed | added | moved)
Match           id, change_id, artifact_id, rationale, rejected
Brief           id, workspace_id, kind (roadmap_impact | opportunity), subject_id,
                context_version_id, content, model, prompt_version   immutable
Decision        id, brief_id, disposition, rationale, system_recommendation, decided_by, decided_at
Feedback        id, brief_id, verdict (useful | irrelevant | incorrect), note
```

Dispositions are a discriminated union by brief kind. Roadmap Impact allows Ignore, Watch, Validate, Accelerate, and Reconsider. Opportunity allows Ignore, Watch, Validate, Pursue, and Reframe. The type system rejects any other pair.

Changes and discoveries each move through one state machine, and code rejects any other transition.

```text
Change     submitted -> fetching -> extracting -> verifying -> matching -> writing -> ready
           verifying -> unverified;  any step -> failed
Discovery  framing_confirmed -> searching -> verifying -> grouping -> writing -> ready
           verifying -> insufficient_evidence;  any step -> failed
```

Each background step is idempotent, keyed by subject ID and step, so a retry converges on the same rows.

## Model pipeline

Page content, tracker items, and search results are untrusted input. Calls that read them have no tools that act on anything, so injected text can't trigger an action. Every model output is parsed against a schema at the boundary.

**Roadmap Impact.** Fetch and snapshot the page. Extract claims, each with an exact quote. Code checks each quote exists in the snapshot, then a model checks the quote supports the claim. Match verified claims against the confirmed profile and non-excluded artifacts. Write the brief as structured output where every factual sentence cites claim or artifact IDs, and code rejects any ID that doesn't exist. Show a recommendation only when verified claims, match confidence, and context freshness clear configured thresholds.

**Founder discovery.** Research runs with the Claude API's server-side `web_search_20260209` and `web_fetch_20260209` tools. Every product found is fetched and its claims go through the same quote check. Synthesis is a separate structured-output call that cites stored claim IDs. It's separate because the API's citations feature can't be combined with structured outputs in one call.

**Models.** Default to `claude-opus-5-5` for extraction, discovery, and writing. Candidate cheaper model for the support check is `claude-haiku-5-5`. The eval suite decides each step's model and effort level, not taste. Server-side refusal fallbacks are on by default.

## Delivery sequence

Each PR is one verifiable unit and lands on its own. Scaffold first, then the domain, then features. The eval suite lands before the pipelines it grades.

| PR | Branch | Delivers | Proven by |
| --- | --- | --- | --- |
| 1 | `chore/product-foundation` | Supabase, invite-only sign-in with Google and email links, app shell, product CI | An invited account signs in. A non-invited one sees the waitlist message. CI is green. |
| 2 | `feat/domain-schema` | Migrations, row-level security, typed models, both state machines | Workspace A can't read workspace B. Every forbidden transition and disposition pair is rejected. |
| 3 | `feat/connectors` | Nango setup, Linear and Jira OAuth, team selection, exclusions, sync, normalization | Connect a real Linear and Jira test workspace. Excluded items never appear in a model request log. |
| 4 | `feat/start-and-profile` | Start screen with mode routing, product profile drafting, competitors, context versioning | Screenshots of each screen and its edge states. Editing a confirmed profile creates version 2. |
| 5 | `feat/eval-suite` | Golden sets for both modes, scorers, CI job | The suite runs on fixtures and reports every metric. |
| 6 | `feat/change-verification` | Fetch, extract, verify, and the Not verified path | Eval report for factuality and citation support. |
| 7 | `feat/impact-brief` | Matching, brief writing, gating, first brief prepared during setup | Eval report for match precision, unknown honesty, and conflicts. Ready screen shows a real brief. |
| 8 | `feat/founder-framing` | Clarify and framing screens, confirmed boundary | Eval cases for over-broad and ambiguous ideas ask questions instead of guessing. |
| 9 | `feat/founder-discovery` | Web discovery, verification, landscape with corrections | Eval report for landscape precision and citation support. |
| 10 | `feat/opportunity-brief` | Opportunity Brief and its decision options | Eval report for counter-evidence and unknown honesty. |
| 11 | `feat/decision-record` | Decide panel, feedback, export, Home, for both kinds | Timed end-to-end runs in both modes against the activation targets. |
| 12 | `chore/pilot-readiness` | Spend cap, data deletion, error tracking, analytics, invites from the waitlist | Deletion test removes every row and token for a workspace. The funnel shows each step per mode. |

PRs 4, 7, 8, 9, 10, and 11 change what a user sees, so they're reviewed with screenshots of every state before merge. PRs 1, 2, 3, 5, 6, and 12 are reviewed on their tests and logs.

## Release gates for the pilot

The pilot opens only when every gate passes on the golden sets and on 10 real runs per mode that we do ourselves.

| Gate | Threshold | Source |
| --- | --- | --- |
| Citation support | 95% or more of displayed claims supported by their quote | PRD section 17 |
| Event factuality | 95% or more of material claims correct | PRD section 17 |
| Unknown honesty | No confident answer on cases built to be unanswerable | PRD section 17 |
| Conflict preservation | 100% of planted conflicts surface | PRD section 17 |
| Match precision | 85% or more of top matches judged relevant | PRD section 17 |
| Landscape precision | 80% or more of landscape entries judged correctly grouped and relevant | This plan |
| Isolation and transitions | 100% of forbidden reads, transitions, and disposition pairs rejected | PRD section 17 |
| Latency | Roadmap brief within 3 minutes and founder discovery within 6 minutes, 95th percentile | This plan |
| Time to first decision | Median under 10 minutes for product teams and 15 for founders, across our runs | This plan |

The PRD calls these thresholds operating targets. Passing them doesn't prove the product is commercially useful. The pilot measures that.

## Estimate

About 8 weeks of focused work for one engineer, from PR 1 to pilot invites. This is a guess, and it's 3 weeks more than revision 1. Founder mode adds about 2 weeks, and OAuth connectors add about 1 week over CSV upload. PRs 7 and 9 carry the most risk, because they depend on model quality we haven't measured yet.

If the date matters more than launching both modes together, open the pilot to product teams after PR 7 plus PRs 11 and 12, and add founders 2 weeks later. The plan's order already allows that.

## Risks

- **Model quality misses the gates.** Caught by PR 5 before any pilot sees a brief. The response is prompt and model changes measured on the golden sets, never threshold changes.
- **Atlassian or Linear app setup takes longer than expected.** Start both developer-app registrations in week 1, in parallel with PR 1.
- **Connector tokens are sensitive.** Read-only scopes, encrypted storage through Nango, and deletion on disconnect. Retention and no-training commitments must be written before the first pilot connects (OD-5).
- **Founder discovery is noisy or biased toward well-known products.** The landscape shows what was searched and lets the founder correct it. The "failed approaches" group needs its own eval cases.
- **Competitor pages block automated fetching.** The Not verified state explains it, and the user can paste the page text, labeled as user-provided.
- **Cost per brief and per discovery is unknown.** The spend cap per workspace bounds it, and eval reports record cost per run.

## Build in public

Each PR maps to one post. Post the real result, including misses.

1. PR 2. "Making illegal states unrepresentable in an AI product."
2. PR 3. "Why we cut CSV upload and went OAuth-first."
3. PR 5. "I wrote the evals before the pipeline."
4. PR 6. "How we stop an LLM from citing things the page doesn't say."
5. PR 7. "Your first brief is ready before onboarding ends."
6. PR 9. "Mapping a market from one sentence, with every claim cited."
