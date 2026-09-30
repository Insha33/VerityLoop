# Monorepo organization

Research reviewed on September 30, 2026 against current official npm, Turborepo, Next.js, and Cloudflare documentation.

## Decisions and reasons

1. **Separate deployable applications under `apps/`.** `marketing` owns the public site, SEO, assets, and waitlist endpoint. `product` owns the main application. Each has its own manifest, dependencies, Next.js configuration, TypeScript configuration, and output directory. Product server features must not inherit marketing's `output: "export"` constraint. This follows the [apps/packages convention](https://github.com/vercel/turborepo/blob/main/apps/docs/content/docs/crafting-your-repository/structuring-a-repository.mdx).
2. **Keep npm and one root lockfile.** The repo already used npm. [Native workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) provide package linking and per-app commands without a package-manager migration. Dependencies belong to the app using them; root dependencies are repository tooling. Use [`npm ci`](https://docs.npmjs.com/cli/v11/commands/npm-ci/) for reproducible installs in CI.
3. **Start with workspace scripts.** Two independent applications do not yet need dependency-ordered builds or shared build caching. npm runs workspace scripts in declared order; it is not a dependency-aware task scheduler. [Turborepo can be adopted incrementally](https://turborepo.dev/docs/getting-started/add-to-existing-repository) when shared compiled packages or CI times justify it. If introduced, declare dependencies, output directories, and environment inputs correctly; do not cache deployment tasks.
4. **Share code only when a real consumer exists.** `packages/` currently holds guidance, not an artificial UI or business-logic library. Future packages expose a deliberate API and are declared in consumers' manifests. Do not import across apps. See [internal packages](https://turborepo.dev/docs/core-concepts/internal-packages).
5. **Keep builds and deployments independent.** Root `build` builds both apps; `build:marketing` and `build:product` target one. Root `deploy` targets marketing only. Product gets its own deployment once its runtime/provider is selected.
6. **Keep secrets and tests near their owner.** Next.js environment files live inside each app. Marketing tests moved with their source. The waitlist Worker stays inside marketing because it is deployed with that site; it is not the main product API. Root `.dev.vars` is the compatibility exception described below.

## Marketing deployment compatibility

The root `wrangler.jsonc` remains the single source of truth for the existing `verityloop` Worker. It points to `apps/marketing/worker/index.ts`, builds only marketing, and uploads only `apps/marketing/out/`. Its Worker name, bindings, routing, compatibility date, and notification settings are preserved.

Keeping this entry point preserves the existing repository-root `npx wrangler deploy` command. It also keeps local Worker credentials at root. There is no second Wrangler configuration to drift out of sync.

Expected Cloudflare Workers Builds settings:

| Setting | Value |
| --- | --- |
| Root directory | Repository root |
| Deploy command | `npm run deploy:marketing` (existing `npx wrangler deploy` also works) |
| Separate build command | May be empty; Wrangler's build hook runs `npm run build:marketing` |
| Optional explicit build command | `npm run build:marketing` (would duplicate the Wrangler build) |
| Suggested include watch paths | `apps/marketing/*`, `package.json`, `package-lock.json`, `wrangler.jsonc` |

Cloudflare watch paths match descendants, so `apps/marketing/*` includes files below `src/`. Add shared-package paths when marketing starts consuming them. A root lockfile change should trigger a marketing build because it may change marketing dependencies. These settings are recommendations; this migration does not edit the Cloudflare dashboard.

Cloudflare documents independent Workers and watch paths in [advanced monorepo setups](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/). The current root entry point is an intentional compatibility choice. When product hosting is selected, give it its own deploy configuration and command; never repoint the existing marketing Worker at the product.

## Future growth

- Add product features within `apps/product/src/`; do not pre-create services for unimplemented features.
- Add `apps/api` or `apps/jobs` only if a separately deployed backend or worker is actually needed.
- Add shared packages when both apps have a concrete need, with explicit exports and dependencies.
- CI should install once with `npm ci`, then run tests, typechecks, and builds. A future product test suite should declare a `test` script so root `npm test` includes it. Currently tests cover marketing and waitlist behavior only.
- Introduce dependency-aware build/test selection once shared packages make app-only path filters insufficient.
- Keep generated `.next/`, `out/`, `node_modules/`, environment secrets, and TypeScript build caches ignored at every depth.
