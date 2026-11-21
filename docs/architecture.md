# VerityLoop architecture

Status: living document, last changed 2026-11-21. It describes what exists in this repository and what is only **planned**. Planned parts come from the proposed v1 plan (branch `docs/v1-onboarding-plan`, not merged) and are not decisions until the founders approve them.

## What VerityLoop does

VerityLoop is an AI product-decision system. It has two journeys that share one evidence engine:

- **Opportunity Discovery (founders).** An idea becomes an Opportunity Brief: alternatives, problem evidence, assumptions ranked by risk, and validation tests.
- **Roadmap Impact (product teams).** A market change, checked against the team's roadmap and context, becomes a Roadmap Impact Brief: act, investigate, watch, or ignore.

Both follow one loop: **signal or question → context and evidence → options and unknowns → human decision → next action → new evidence.** A human makes every decision. PRDs, tickets and publishing each need their own approval. Product direction: [verityloop-positioning-and-mvp.md](verityloop-positioning-and-mvp.md) and [PRODUCT.md](../PRODUCT.md).

## System diagram

```mermaid
flowchart LR
  subgraph Built["Built (in this repo)"]
    MKT["apps/marketing<br/>Next.js static site"]
    WL["apps/marketing/worker<br/>POST /api/waitlist"]
    PFE["apps/dashboard<br/>onboarding UI preview<br/>(state in sessionStorage)"]
  end
  subgraph External["External services in use"]
    SB[("Supabase<br/>waitlist table")]
    RS["Resend<br/>notification email"]
  end
  subgraph Planned["Planned (README only)"]
    PBE["apps/api<br/>auth · workspaces · membership<br/>connectors · briefs · decisions"]
    AW["apps/worker<br/>sync · change capture · claim checks<br/>roadmap matching · brief drafting"]
    DB[("Postgres + Storage")]
    LLM["Claude API"]
    SRC["Linear · Jira (OAuth)<br/>competitor pages"]
  end

  Visitor((Visitor)) --> MKT --> WL --> SB
  WL --> RS
  User((PM / founder)) --> PFE
  PFE -. "today: no network calls" .-> PBE
  PBE --> DB
  PBE -- enqueue jobs --> AW
  AW --> SRC
  AW --> LLM
  AW --> DB
```

Solid boxes in **Built** run today. Everything in **Planned** is unbuilt, and `apps/dashboard` makes no calls to it. When the API and worker are built, they share the database schema and job types through `packages/db` and `packages/contracts`, not by importing each other.

## Components

| Component | Path | Status | Owns | Deploys to |
| --- | --- | --- | --- | --- |
| Marketing site | `apps/marketing/src` | Built | Landing page, SEO, brand assets, illustrative product scenes | Cloudflare Workers static assets (root `wrangler.jsonc`), `runverityloop.com` |
| Waitlist API | `apps/marketing/worker/index.ts` | Built | Validates signups, inserts into Supabase `waitlist` (`on_conflict=email`), sends team notification and welcome emails through Resend | Same Worker as the site, `/api/*` routed to the Worker first |
| Dashboard (product UI) | `apps/dashboard` | Built, as a **frontend preview** | Sign-up, account dashboard, workspace directory, create workspace, invites, connections, documents | Cloudflare Workers through OpenNext (`apps/dashboard/wrangler.jsonc`), `platform.runverityloop.com` |
| API | `apps/api` | Planned | Identity, org/domain ownership, server-side membership, invites, OAuth connectors, storage, briefs, decisions | Undecided (plan D2) |
| Worker | `apps/worker` | Planned | Durable evidence jobs and brief drafting | Undecided (plan: Inngest) |
| Shared packages | `packages/` | None yet | Future contracts, UI, config shared by more than one consumer | n/a |

## Feature breakdown

| Feature | Journey | Where it lives today | Next owner |
| --- | --- | --- | --- |
| Waitlist signup with audience and campaign tag | Both | `apps/marketing` Waitlist + Worker | `apps/marketing` |
| Account and workspace onboarding | Both | `apps/dashboard/src/features/{auth,workspaces,account}` (simulated) | `dashboard` UI + `api` |
| Workspace roles: Owner, Editor, Reviewer | Both | `features/workspaces/model.ts` `canOpen` / `canManage` (UI only) | `api` |
| Tracker connectors (Linear, Jira; Confluence in preview) | Roadmap Impact | Simulated source picker | `api` OAuth + `worker` sync |
| Product documents | Both | Filename, size and type only | `api` storage + `worker` ingestion |
| Start screen that routes a website vs an idea | Both | Not built | `dashboard` |
| Change capture, claim extraction, Not verified state | Roadmap Impact | Not built | `worker` |
| Roadmap matching and Roadmap Impact Brief | Roadmap Impact | Not built | `worker` + `dashboard` |
| Clarify, framing, landscape, Opportunity Brief | Discovery | Not built | `worker` + `dashboard` |
| Decision record, feedback, Markdown export | Both | Not built (marketing scenes illustrate it) | `api` + `dashboard` |

## Key flows

**Waitlist (built).** Form → `POST /api/waitlist` → normalize name, email, audience and campaign → Supabase insert (a duplicate email returns success with no email sent) → for new rows, a Resend notification to the team (a failure returns 502), then a welcome email to the signup (a failure is logged and does not fail the request) → JSON response. Tests: `apps/marketing/tests/waitlist-worker.test.ts`.

**Onboarding (preview).** Email at `/sign-up` → `profileForEmail` assigns a company or personal organization from the domain → dashboard at `/` → create workspace (you become its Owner) → optional invites → at least one scoped connection → optional documents → `stage: complete`. All of this state lives in `sessionStorage` key `verityloop-product-preview-v1`. Spec: [design/pm-onboarding.md](design/pm-onboarding.md). Tests: `apps/dashboard/tests/unit/` (logic) and `apps/dashboard/tests/e2e/onboarding.spec.ts` (journeys).

**Brief generation (planned).** See [apps/worker](../apps/worker/README.md).

## Where else to look

| Question | Document |
| --- | --- |
| Why apps and packages are split this way, Turborepo tasks, CI, deploys and rollback | [monorepo.md](monorepo.md) |
| Proposed v1 scope, stack decisions D1–D5, P0 list | `docs/plans/v1-onboarding-and-first-brief.md` on branch `docs/v1-onboarding-plan` |
| Full requirements (PRD v0.4, written under the earlier Groundtruth name) | Google Doc linked from [PRODUCT.md](../PRODUCT.md) |
| Marketing visual system | [DESIGN.md](../DESIGN.md) |
