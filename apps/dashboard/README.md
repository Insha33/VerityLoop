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

- `src/app/`: thin App Router entry points, shared layout, `globals.css` (page layout), `layers.css` (cascade layer order, imported first) and `providers.tsx` (Astryx `Theme`, `LinkProvider` with Next.js `Link`, the i18n override, and the preview store). Two route groups, whose names never appear in URLs:
  - `(auth)/`: `/sign-up` and `/sign-in`.
  - `(dashboard)/`: everything behind sign-in, wrapped in the app shell: `/`, `/workspaces`, `/workspaces/new`, `/workspaces/:id`, `/workspaces/:id/{invite,connections,documents}`, `/settings`. Signed-out visitors are sent to `/sign-up`.
- `src/features/`, one folder per product domain:
  - `auth/`: the sign-up and sign-in page, and `profile.ts` (organization from the email domain).
  - `workspaces/`: directory, create, overview and guards, plus `model.ts` (roles, setup stages, invitations). `setup/` holds the three setup steps: invite, connections, documents.
  - `account/`: the dashboard home and settings.
- `src/components/`: `app-shell.tsx` (sidebar, header, breadcrumbs, sign-in guard), `brand.tsx` (the logo inlined so it follows the theme) and `signal-grid.tsx` (the sign-up stage background, ported from marketing).
- `src/themes/`: `verityloop-theme.ts` (the theme source) and the files `npm run theme:build` generates from it (`verityloop.css`, `.js`, `.d.ts`).
- `src/lib/`: `preview-store.tsx` (session state every feature reads) and `email.ts`.
- `public/`: existing VerityLoop brand assets, provider icons, and self-hosted Manrope with its license.
- `tests/unit/`: Vitest tests for the plain logic (setup stages, roles, invitation rules, email-to-organization, sample state, paths). Fast, no browser; `npm test` runs them.
- `tests/e2e/`: Playwright journeys covering corporate/personal email, access requests, invites, scoped connections, document validation, session persistence, and separate workspace state.

Screens keep the layouts of the v8 references in `docs/design/pm-onboarding/v8/`, rebuilt on Astryx components. See [design-qa.md](design-qa.md) for rendered QA.

## UI system

The dashboard uses [Astryx](https://astryx.atmeta.com/) (`@astryxdesign/*` 0.7.17, pinned to one release). Marketing uses shadcn/ui; never mix the two in one app.

- **Components:** every control is an Astryx component, imported from its own entry (`@astryxdesign/core/Button`, `/TextInput`, `/Dialog` and so on). `next.config.ts` sets `optimizePackageImports` for `@astryxdesign/core`, because builds use webpack. Look components up with `npx astryx component <Name>` and docs with `npx astryx docs <topic>`.
- **Never run `npx astryx init`.** It writes an Astryx block into `AGENTS.md` and creates `CLAUDE.md` and `GEMINI.md`; a `CLAUDE.md` makes Claude Code ignore the repo's `AGENTS.md`.
- **Theme:** `src/themes/verityloop-theme.ts` extends Astryx neutral with `defineTheme`: square corners everywhere (radius 0; avatars stay round), the exact logo orange `#ff5a4f` for every accent, and pure-white pages in light mode, as DESIGN.md asks. Filled accents carry white labels, as on the marketing site. That measures 3.08:1 in light mode and 2.79:1 in dark mode, below WCAG AA's 4.5:1 for normal-size text (dark ink would be 5.9:1); the product owner chose white on 2026-11-21. Small accent text is ink in light mode, with the orange on indicators (active nav icon, setup-step underline). Large text, such as the sign-up headline, uses the orange directly (3.08:1 passes the large-text minimum). Errors and destructive actions stay red, so they never read as brand. Theme-local `--vl-*` tokens hold the brand surfaces and signal-cell colors. After editing the theme, run `npm run theme:build` and commit the generated files; `npm run typecheck` fails if they are stale.
- **Colors:** layout CSS and components use only Astryx tokens (`--color-text-secondary`, `--color-border` and so on) or the theme's `--vl-*` tokens. The only literal colors are the token values in the theme source and the provider logos in `public/`.
- **Dark mode:** `<Theme mode="system">` follows the system setting; tokens are `light-dark()` pairs. There is no toggle.
- **CSS layers:** `layers.css` declares `reset, astryx-base, astryx-theme, app`. Page layout lives in `globals.css` inside `@layer app`, with element rules scoped to the page containers so they never restyle Astryx components.
- **Names the tests use:** the dialog close button is named "Close dialog" through the Astryx i18n override in `providers.tsx`. Field errors are checked through each field's accessible description.
- **Sign-up stage:** concept E from the November 2026 review: the form takes 42% of the width and a product stage 58%, with the marketing hero headline, a dimmed sample workspace, one sample decision brief, and the marketing signal grid at a smaller 18px pitch with square cells. The stage runs the full height of the page. The sample content is labelled as an example, hidden from assistive technology and inert.

## Gaps against the UI rules

As of 2026-11-21:
- Page subtitles, helper lines and secondary labels are kept on purpose: the product owner asked to restore the original copy while the design system changed. This departs from the [cut-the-helper-text rule in AGENTS.md](../../AGENTS.md#ui-design); revisit it screen by screen.
- The sign-up stage headline is a tagline, approved for this page.
- White button labels on the logo orange are below the AA contrast minimum (see Theme above). Making labels large and bold (19px, weight 700) would meet the 3:1 large-text minimum without changing either color.
- `src/components/signal-grid.tsx` duplicates the marketing grid's logic, because apps can't import each other. Move it into a shared package if a third copy is needed.

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
