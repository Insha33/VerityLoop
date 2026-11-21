# api

Status: **not implemented.** This README sets the app's boundary before any code is written. It becomes the `@verityloop/api` workspace when its stack is approved.

## Job

`apps/api` is the system of record and the security boundary for the product. [`apps/dashboard`](../dashboard/README.md) calls it. Today the dashboard fakes all of this in `sessionStorage` (`apps/dashboard/src/lib/preview-store.tsx`). Its UI role checks are explicitly **not** a security boundary.

## Responsibilities, from the onboarding preview's production gaps

| Area | What it must do | Dashboard stand-in today |
| --- | --- | --- |
| Identity | Verified sign-in (Google or email link) and invite-only access | `profileForEmail()` in `features/auth/profile.ts` trusts any typed email |
| Organizations | Check that an organization owns its email domain | `PERSONAL_DOMAINS` list in `features/auth/profile.ts` |
| Workspaces and membership | Server-side role checks (Owner, Editor, Reviewer) on every workspace resource | `canOpen()` and `canManage()` in `features/workspaces/model.ts` |
| Access requests | Owner approval API, and pending-request state | `requested: true` flag |
| Invitations | Expiring, redeemable, single-use invite tokens, plus email delivery | Random preview token that can't be redeemed |
| Connectors | Read-only OAuth (Linear, Jira first), team or project scoping, and exclusions | Simulated source picker |
| Documents | Private storage and handing documents to ingestion | Keeps only filename, size and type |
| Briefs and decisions | Store briefs, human decisions and rationale, and export them | Not in the preview |

## Boundaries

- Never trust role, workspace or organization IDs sent by the client. Work them out from the session.
- Long or retryable work (syncs, model calls) goes to [`apps/worker`](../worker/README.md) as jobs. Request handlers stay fast.
- The database schema and the job payload types live in shared packages (`packages/db`, `packages/contracts`) that this app and the worker both depend on. Neither app imports the other.
- Excluded connector projects are never sent to a model.

## Open decisions (owner: founders)

From the proposed v1 plan, which is on branch `docs/v1-onboarding-plan` and not yet merged:

- **D2, stack.** The proposal is Supabase (Postgres, Auth, Storage, row-level security), Vercel, and the Claude API. If the API ships as Next.js route handlers inside `apps/dashboard`, remove this folder, keep the schema in `packages/db`, and update [docs/architecture.md](../../docs/architecture.md). Decide that before adding code.
- **D3, connector OAuth broker.** The proposal is Nango.
