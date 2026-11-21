# VerityLoop dashboard (`apps/dashboard`)

Interactive implementation of the approved account-first PM onboarding screens. The app retains `noindex` metadata.

From the repository root:

```bash
npm run dev:dashboard
npm run build:dashboard
npm run start:dashboard
```

Development and production preview use port 3001. Marketing uses port 3000.

## Flow

Email signup (`/sign-up`) → account dashboard (`/`) → Workspaces → create workspace → optional invitations → Connections → supporting documents → workspace overview.

Try `alex@acme.com` for a sample company directory, or `alex@gmail.com` for an empty personal account. Company samples demonstrate access requests, pending requests, and an accessible Reviewer workspace. Creating a workspace makes you its Owner. A selected source from at least one preview integration is required before Documents; documents themselves are optional. Return to the dashboard at any time and resume setup from Home or Workspaces.

## Implementation

- `src/app/`: thin App Router entry points, shared layout and visual styles. Two route groups, whose names never appear in URLs:
  - `(auth)/`: `/sign-up` and `/sign-in`.
  - `(dashboard)/`: everything behind sign-in, wrapped in the app shell: `/`, `/workspaces`, `/workspaces/new`, `/workspaces/:id`, `/workspaces/:id/{invite,connections,documents}`, `/settings`. Signed-out visitors are sent to `/sign-up`.
- `src/features/`, one folder per product domain:
  - `auth/`: the sign-up and sign-in page, and `profile.ts` (organization from the email domain).
  - `workspaces/`: directory, create, overview and guards, plus `model.ts` (roles, setup stages, invitations). `setup/` holds the three setup steps: invite, connections, documents.
  - `account/`: the dashboard home and settings.
- `src/components/`: `app-shell.tsx` (sidebar, header, breadcrumbs, sign-in guard) and `ui.tsx` (brand, controls, avatars, loading state, native dialog).
- `src/lib/`: `preview-store.tsx` (session state every feature reads) and `email.ts`.
- `public/`: existing VerityLoop brand assets, provider icons, and self-hosted Manrope with its license.
- `tests/`: Playwright journeys covering corporate/personal email, access requests, invites, scoped connections, document validation, session persistence, and separate workspace state.

Screens use the v8 references in `docs/design/pm-onboarding/v8/` with responsive layouts and the specified type scale. See [design-qa.md](design-qa.md) for rendered QA.

## Preview boundaries

State is isolated to this browser tab using `sessionStorage`, persists through reloads, and is cleared by Sign out or Reset preview. This is a frontend preview: email signup does not authenticate or verify a domain. Invitations and access requests do not send messages. Generated links are previews, not redeemable credentials. Connections simulate selected sources; no OAuth or provider API runs. Uploads retain filename/size/type only; file contents are never read or sent. Separate workspace state and UI role guards demonstrate the intended behavior, **not a production security boundary**.

Production requires verified authentication, organization/domain ownership, server-side membership checks for every workspace resource, owner approval APIs, expiring redeemable invitations, provider authorization, and private document storage/ingestion. No environment variables are needed for this preview.

## Verification

```bash
npx turbo run typecheck --filter=@verityloop/dashboard
npm run build:dashboard
npx playwright install chromium
npm run test:e2e
```

Pass Playwright flags after `--`, for example `npm run test:e2e -- --headed` or `npm run test:e2e -- --project=mobile`. Playwright starts the dev server on port 3001 when nothing is running there, and reuses a running one outside CI. Browser tests cover 1440px, 768px, 375px and 320px viewports. They save all seven screens under `apps/dashboard/artifacts/onboarding/<viewport>/` (ignored by Git). Set `PLAYWRIGHT_BROWSERS_PATH` consistently for install and tests when using a custom browser cache. Typechecking bypasses the incremental cache so prior Next build diagnostics cannot mask source changes.

This app has its own Next.js config and does not use marketing's static-export setting. It can grow to include server-rendered routes and API handlers. No production hosting provider, domain, database, authentication system, or deployment pipeline is configured yet. Root `npm run deploy` deploys only marketing.
