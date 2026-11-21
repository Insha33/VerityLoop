# platform-be

Status: **not implemented.** This README sets the service's boundary before any code is written.

## Job

platform-be is the system of record and the security boundary for the product. [`apps/platform-fe`](../../apps/platform-fe/README.md) calls it. Today the frontend fakes all of this in `sessionStorage` (`apps/platform-fe/src/features/onboarding/store.tsx`). Its UI role checks are explicitly **not** a security boundary.

## Responsibilities, from the onboarding preview's production gaps

| Area | What it must do | Frontend stand-in today |
| --- | --- | --- |
| Identity | Verified sign-in (Google or email link) and invite-only access | `profileForEmail()` trusts any typed email |
| Organizations | Check that an organization owns its email domain | `PERSONAL_DOMAINS` list in `model.ts` |
| Workspaces and membership | Server-side role checks (Owner, Editor, Reviewer) on every workspace resource | `canOpen()` and `canManage()` in `model.ts` |
| Access requests | Owner approval API, and pending-request state | `requested: true` flag |
| Invitations | Expiring, redeemable, single-use invite tokens, plus email delivery | Random preview token that can't be redeemed |
| Connectors | Read-only OAuth (Linear, Jira first), team or project scoping, and exclusions | Simulated source picker |
| Documents | Private storage and handing documents to ingestion | Keeps only filename, size and type |
| Briefs and decisions | Store briefs, human decisions and rationale, and export them | Not in the preview |

## Boundaries

- Never trust role, workspace or organization IDs sent by the client. Work them out from the session.
- Long or retryable work (syncs, model calls) goes to [`agent-worker`](../agent-worker/README.md) as jobs. Request handlers stay fast.
- Excluded connector projects are never sent to a model.

## Open decisions (owner: founders)

From the proposed v1 plan, which is on branch `docs/v1-onboarding-plan` and not yet merged:

- **D2, stack.** The proposal is Supabase (Postgres, Auth, Storage, row-level security), Vercel, and the Claude API. If the API ships as Next.js route handlers inside `apps/platform-fe`, this folder may only ever hold the database schema and migrations. Decide that before adding code.
- **D3, connector OAuth broker.** The proposal is Nango.
