# VerityLoop

One repository for the public marketing site, the product, and its future backend services, managed with npm workspaces and Turborepo. To see how the parts fit together and what is real versus planned, start with [docs/architecture.md](docs/architecture.md). Agent and contributor rules are in [AGENTS.md](AGENTS.md).

```text
apps/
  marketing/            Next.js static site and waitlist Worker
    src/                Routes, marketing copy, components, and styles
    public/             Public marketing assets
    tests/              Marketing and waitlist tests
    worker/             Cloudflare /api/waitlist endpoint
  dashboard/            Product UI: frontend-only onboarding preview
    src/app/            Routes: (auth) for sign-up and sign-in, (dashboard) behind sign-in
    src/features/       One folder per domain: auth, workspaces, account
    tests/              Playwright journeys
  api/                  Product API: auth, workspaces, connectors, briefs (README only)
  worker/               Evidence pipeline and brief-drafting jobs (README only)
packages/               Reserved for libraries used by multiple workspaces
docs/                   Architecture, plans, product direction, design specs
DESIGN.md               Marketing visual system
package.json            Workspace definitions and root commands
turbo.json              Turborepo task graph and cache settings
package-lock.json       One dependency lockfile for the repository
wrangler.jsonc          Marketing deployment entry point
```

## Get started

Run commands from the repository root. Use npm 11.16.0 (recorded in `packageManager`) and a Node version supported by the installed Next.js and Wrangler versions.

```bash
npm ci
npm run dev              # marketing on http://localhost:3000, dashboard on http://localhost:3001
```

Run one app with `npm run dev:marketing` (or `dev:marketing:3100`) or `npm run dev:dashboard`. The product UI is a frontend preview: authentication, persistence, and server-side access control are not implemented yet.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Unit tests in every workspace |
| `npm run test:e2e` | Dashboard Playwright journeys (starts the dev server if needed) |
| `npm run typecheck` | Check every workspace |
| `npm run build` | Build every app |
| `npm run build:marketing` | Export marketing to `apps/marketing/out/` |
| `npm run build:dashboard` | Build the product UI to `apps/dashboard/.next/` |
| `npm run start:dashboard` | Serve a production product build on port 3001 |
| `npm run preview:marketing` | Build and serve marketing plus the waitlist Worker locally |
| `npm run deploy:check` | Build marketing and validate the Worker bundle without deploying |
| `npm run deploy` | Deploy only marketing and its waitlist Worker |

`build`, `typecheck`, `test` and `test:e2e` run through Turborepo. It runs workspaces in parallel, and a task whose inputs haven't changed replays its saved result instead of running again (cache in `.turbo/`, ignored by Git). Use `--filter` to target one workspace. Deploys skip the cache.

Install app dependencies into their owning workspace, for example `npm install <package> --workspace=@verityloop/dashboard`. Commit the root lockfile with dependency changes; do not create app-level lockfiles.

Next.js environment files belong inside the app that consumes them, such as `apps/dashboard/.env.local`. Marketing Worker local credentials stay in root `.dev.vars` (copy `.dev.vars.example`), because its Wrangler config is at the root. Don't put product credentials there.

See [the monorepo guide](docs/monorepo.md) for the layout decisions and deployment settings, and [marketing setup](apps/marketing/README.md) for waitlist configuration.
