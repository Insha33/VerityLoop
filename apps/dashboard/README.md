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
- `tests/unit/`: Vitest tests for the plain logic (setup stages, roles, invitation rules, email-to-organization, sample state, paths). Fast, no browser; `npm test` runs them.
- `tests/e2e/`: Playwright journeys covering corporate/personal email, access requests, invites, scoped connections, document validation, session persistence, and separate workspace state.

Screens use the v8 references in `docs/design/pm-onboarding/v8/` with responsive layouts and the specified type scale. See [design-qa.md](design-qa.md) for rendered QA.

## Gaps against the UI rules

As of 2026-11-21 the dashboard doesn't yet meet the [UI rules in AGENTS.md](../../AGENTS.md#ui-design):
- It isn't on shadcn/ui; `src/components/ui.tsx` holds hand-made controls. Replace it with shadcn components in `src/components/ui/` (a file and a folder with the same name would make `@/components/ui` ambiguous).
- `src/app/globals.css` defines a few color variables but still uses about 45 hard-coded color values.
- There's no dark mode.
- Several screens carry helper lines and subtitles.

Close these when the screens are next changed, starting with tokens and dark mode.

## Preview boundaries

State is isolated to this browser tab using `sessionStorage`, persists through reloads, and is cleared by Sign out or Reset preview. This is a frontend preview: email signup does not authenticate or verify a domain. Invitations and access requests do not send messages. Generated links are previews, not redeemable credentials. Connections simulate selected sources; no OAuth or provider API runs. Uploads retain filename/size/type only; file contents are never read or sent. Separate workspace state and UI role guards demonstrate the intended behavior, **not a production security boundary**.

Production requires verified authentication, organization/domain ownership, server-side membership checks for every workspace resource, owner approval APIs, expiring redeemable invitations, provider authorization, and private document storage/ingestion. No environment variables are needed for this preview.

## Verification

```bash
npx turbo run typecheck --filter=@verityloop/dashboard
npx turbo run test --filter=@verityloop/dashboard   # unit tests
npm run build:dashboard
npx playwright install chromium
npm run test:e2e
```

Pass Playwright flags after `--`, for example `npm run test:e2e -- --headed` or `npm run test:e2e -- --project=mobile`. Playwright starts the dev server on port 3001 when nothing is running there, and reuses a running one outside CI. Browser tests run at two viewports: desktop (1440×1024, sidebar navigation) and mobile (375×812, drawer navigation). Put logic checks in `tests/unit/` instead of adding viewports. They save all seven screens under `apps/dashboard/artifacts/onboarding/<viewport>/` (ignored by Git). Set `PLAYWRIGHT_BROWSERS_PATH` consistently for install and tests when using a custom browser cache. Typechecking bypasses the incremental cache so prior Next build diagnostics cannot mask source changes.

This app has its own Next.js config and does not use marketing's static-export setting. It can grow to include server-rendered routes and API handlers. No production hosting provider, domain, database, authentication system, or deployment pipeline is configured yet. Root `npm run deploy` deploys only marketing.
