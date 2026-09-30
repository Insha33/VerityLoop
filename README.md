# VerityLoop

One repository for the public marketing site and the main product, managed with npm workspaces.

```text
apps/
  marketing/            Existing Next.js static site and waitlist Worker
    src/                Routes, marketing copy, components, and styles
    public/             Public marketing assets
    tests/              Marketing and waitlist tests
    worker/             Cloudflare /api/waitlist endpoint
  product/              Independent Next.js product starter
    src/app/            Product routes, layout, and styles
packages/               Reserved for libraries used by multiple apps
docs/                   Architecture and deployment notes
package.json            Workspace definitions and root commands
package-lock.json       One dependency lockfile for the repository
wrangler.jsonc          Existing marketing deployment entry point
```

## Get started

Run commands from the repository root. Use npm 11.16.0 (recorded in `packageManager`) and a Node version supported by the installed Next.js and Wrangler versions. This migration was verified with Node 26.3.1.

```bash
npm ci
npm run dev:marketing    # http://localhost:3000
```

In another terminal:

```bash
npm run dev:product      # http://localhost:3001
```

`npm run dev` remains an alias for marketing. The product is a minimal runnable starter; authentication, persistence, and product features are not implemented yet.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run existing workspace tests |
| `npm run typecheck` | Check both applications |
| `npm run build` | Build both applications |
| `npm run build:marketing` | Export marketing to `apps/marketing/out/` |
| `npm run build:product` | Build the product to `apps/product/.next/` |
| `npm run start:product` | Serve a production product build on port 3001 |
| `npm run preview:marketing` | Build and serve marketing plus the waitlist Worker locally |
| `npm run deploy:check` | Build marketing and validate the Worker bundle without deploying |
| `npm run deploy` | Deploy only marketing and its waitlist Worker |

Install app dependencies into their owning workspace, for example `npm install <package> --workspace=@verityloop/product`. Commit the root lockfile with dependency changes; do not create app-level lockfiles.

Next.js environment files belong inside the app that consumes them, such as `apps/product/.env.local`. Marketing Worker local credentials remain in root `.dev.vars` (copy `.dev.vars.example`) because its Wrangler config remains at the root. Existing ignored root environment files were left untouched. Avoid placing product credentials there.

See [the monorepo guide](docs/monorepo.md) for the decisions, boundaries, research sources, and deployment settings, and [marketing setup](apps/marketing/README.md) for waitlist configuration.
