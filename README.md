# VerityLoop

One repository for the public marketing site, the product, and its future backend services, managed with npm workspaces. To see how the parts fit together and what is real versus planned, start with [docs/architecture.md](docs/architecture.md). Agent and contributor rules are in [AGENTS.md](AGENTS.md).

```text
apps/
  marketing/            Next.js static site and waitlist Worker
    src/                Routes, marketing copy, components, and styles
    public/             Public marketing assets
    tests/              Marketing and waitlist tests
    worker/             Cloudflare /api/waitlist endpoint
  platform-fe/          Product UI: frontend-only onboarding preview
    src/app/            Thin App Router entry points
    src/features/       Screens, domain rules, and preview state per feature
    tests/              Playwright journeys
services/               Backend processes, README only until built
  platform-be/          Product API: auth, workspaces, connectors, briefs
  agent-worker/         Evidence pipeline and brief-drafting jobs
packages/               Reserved for libraries used by multiple workspaces
docs/                   Architecture, plans, product direction, design specs
DESIGN.md               Marketing visual system
package.json            Workspace definitions and root commands
package-lock.json       One dependency lockfile for the repository
wrangler.jsonc          Marketing deployment entry point
```

## Get started

Run commands from the repository root. Use npm 11.16.0 (recorded in `packageManager`) and a Node version supported by the installed Next.js and Wrangler versions.

```bash
npm ci
npm run dev:marketing    # http://localhost:3000 (or npm run dev:marketing:3100)
```

In another terminal:

```bash
npm run dev:platform-fe  # http://localhost:3001
```

`npm run dev` remains an alias for marketing. The old `dev:product`, `build:product` and `start:product` scripts still work as aliases. The product UI is a frontend preview: authentication, persistence, and server-side access control are not implemented yet.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run every workspace's tests (`platform-fe` needs its dev server running) |
| `npm run test:platform-fe` | Run the product Playwright journeys |
| `npm run typecheck` | Check both applications |
| `npm run build` | Build both applications |
| `npm run build:marketing` | Export marketing to `apps/marketing/out/` |
| `npm run build:platform-fe` | Build the product UI to `apps/platform-fe/.next/` |
| `npm run start:platform-fe` | Serve a production product build on port 3001 |
| `npm run preview:marketing` | Build and serve marketing plus the waitlist Worker locally |
| `npm run deploy:check` | Build marketing and validate the Worker bundle without deploying |
| `npm run deploy` | Deploy only marketing and its waitlist Worker |

Install app dependencies into their owning workspace, for example `npm install <package> --workspace=@verityloop/platform-fe`. Commit the root lockfile with dependency changes; do not create app-level lockfiles.

Next.js environment files belong inside the app that consumes them, such as `apps/platform-fe/.env.local`. Marketing Worker local credentials stay in root `.dev.vars` (copy `.dev.vars.example`), because its Wrangler config is at the root. Don't put product credentials there.

See [the monorepo guide](docs/monorepo.md) for the layout decisions and deployment settings, and [marketing setup](apps/marketing/README.md) for waitlist configuration.
