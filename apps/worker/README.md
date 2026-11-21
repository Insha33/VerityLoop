# worker

Status: **not implemented.** This README sets the app's boundary before any code is written. It becomes the `@verityloop/worker` workspace when its stack is approved.

## Job

`apps/worker` runs the evidence pipeline behind every brief. These steps take minutes, call external sites and the model, and must be durable and retryable, so they run as background jobs and not inside a web request. [`apps/api`](../api/README.md) enqueues jobs and stores their results.

## Pipeline, from the proposed v1 P0 list

```text
connector sync ──► normalize roadmap items (Linear, Jira) ─────────┐
change capture ──► snapshot + hash + dedupe a competitor URL ──────┤
                                                                   ▼
claim extraction: exact quote per claim ─► code quote check ─► model support check
                                                                   │  fails → "Not verified"
                                                                   ▼
roadmap matching (whole roadmap ≤ 600 items, else full-text prefilter)
                                                                   ▼
brief drafting: Roadmap Impact Brief or Opportunity Brief (founder discovery)
                                                                   ▼
              human decision in the product (never automated)
```

## Planned layout

Mirrors the dashboard's domain folders, so one feature name finds its code in every app (the pattern Langfuse uses for its `web/` and `worker/`):

```text
apps/worker/src/
  features/
    sync/               connector sync and roadmap normalization
    change-capture/     snapshots, hashes, dedupe
    claim-checks/       quote and model support checks
    roadmap-matching/
    briefs/             brief drafting
  jobs/                 job registration with the runner (one file per job)
packages/db             schema and migrations, shared with apps/api
packages/contracts      job payloads and brief types, shared with apps/api and apps/dashboard
```

## Boundaries

- Every claim carries a source and an evidence label: Verified fact, Vendor claim, or Inference. Recommendations appear only when the evidence clears the bar.
- The worker drafts and never decides. PRDs, tickets and publishing each need their own human approval.
- Jobs are idempotent: a retried change capture or sync must not duplicate records.
- Fetching arbitrary competitor pages, or running any model-written code, is untrusted work. If the worker ever does either, run it in a separate sandboxed runtime, not in the worker process. Activepieces splits its `worker`, `engine` and `sandbox` this way.

## Open decisions (owner: founders)

From the proposed v1 plan on branch `docs/v1-onboarding-plan`:

- **Job runner.** The proposal is Inngest.
- **D5, retrieval.** Send the whole roadmap up to 600 items. Add Postgres full-text prefiltering above that, and embeddings only if match precision misses its gate.
