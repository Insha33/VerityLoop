# VerityLoop product

Interactive implementation of the approved account-first PM onboarding screens. The app retains `noindex` metadata.

From the repository root:

```bash
npm run dev:product
npm run build:product
npm run start:product
```

Development and production preview use port 3001. Marketing uses port 3000.

## Flow

Email signup → account dashboard → Workspaces → create workspace → optional invitations → Connections → supporting documents → workspace overview.

Try `alex@acme.com` for a sample company directory, or `alex@gmail.com` for an empty personal account. Company samples demonstrate access requests, pending requests, and an accessible Reviewer workspace. Creating a workspace makes you its Owner. A selected source from at least one preview integration is required before Documents; documents themselves are optional. Return to the dashboard at any time and resume setup from Home or Workspaces.

## Implementation

- `src/app/`: thin App Router entry points, shared layout and visual styles.
- `src/features/onboarding/`: individual screens, workspace guards, domain rules in `model.ts`, and session state in `store.tsx`.
- `src/components/ui.tsx`: shared brand, controls, avatars, loading state and native dialog.
- `public/`: existing VerityLoop brand assets, provider icons, and self-hosted Manrope with its license.
- `tests/`: Playwright journeys covering corporate/personal email, access requests, invites, scoped connections, document validation, session persistence, and separate workspace state.

Screens use the v8 references in `docs/design/pm-onboarding/v8/` with responsive layouts and the specified type scale. See [design-qa.md](design-qa.md) for rendered QA.

## Preview boundaries

State is isolated to this browser tab using `sessionStorage`, persists through reloads, and is cleared by Sign out or Reset preview. This is a frontend preview: email signup does not authenticate or verify a domain. Invitations and access requests do not send messages. Generated links are previews, not redeemable credentials. Connections simulate selected sources; no OAuth or provider API runs. Uploads retain filename/size/type only; file contents are never read or sent. Separate workspace state and UI role guards demonstrate the intended behavior, **not a production security boundary**.

Production requires verified authentication, organization/domain ownership, server-side membership checks for every workspace resource, owner approval APIs, expiring redeemable invitations, provider authorization, and private document storage/ingestion. No environment variables are needed for this preview.

## Verification

```bash
npm run typecheck --workspace=@verityloop/product
npm run build:product
# Run the app in a separate terminal, then:
npx playwright install chromium
npm test --workspace=@verityloop/product
```

Browser tests cover 1440px, 768px, 375px and 320px viewports. They save all seven screens under `apps/product/artifacts/onboarding/<viewport>/` (ignored by Git). Set `PLAYWRIGHT_BROWSERS_PATH` consistently for install and tests when using a custom browser cache. Typechecking bypasses the incremental cache so prior Next build diagnostics cannot mask source changes.

This app has its own Next.js config and does not use marketing's static-export setting. It can grow to include server-rendered routes and API handlers. No production hosting provider, domain, database, authentication system, or deployment pipeline is configured yet. Root `npm run deploy` deploys only marketing.
