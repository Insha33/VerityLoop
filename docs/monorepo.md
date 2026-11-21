# Monorepo organization

Research reviewed on September 30, 2026 against current official npm, Turborepo, Next.js, and Cloudflare documentation. Layout last changed 2026-11-21: `apps/product` became `apps/dashboard`, `apps/api` and `apps/worker` were added (README only), and Turborepo now runs the root tasks. The layout follows what popular Next.js and AI-agent monorepos do (cal.com, dub, midday, next-forge, Langfuse, trigger.dev and others). For how the parts connect, see [architecture.md](architecture.md).

## Decisions and reasons

1. **Every deployable goes in `apps/`; everything imported goes in `packages/`.** `apps/marketing` owns the public site, SEO, assets, and waitlist endpoint. `apps/dashboard` owns the product UI. `apps/api` (product API) and `apps/worker` (evidence jobs) hold only READMEs that set each app's boundary; they get code and a `package.json` once their stack decision is approved, and the existing `apps/*` workspace glob picks them up. This is the [Turborepo convention](https://turborepo.com/docs/crafting-your-repository/structuring-a-repository) ("`apps/` for applications and services"). Apps are named for what they are, not by front end or back end. Each app has its own manifest, dependencies, framework config, TypeScript config and output directory. Product server features must not inherit marketing's `output: "export"` constraint.
2. **Keep npm and one root lockfile.** The repo already used npm. [Native workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) provide package linking and per-app commands without a package-manager migration. Dependencies belong to the app using them; root dependencies are repository tooling. Use [`npm ci`](https://docs.npmjs.com/cli/v11/commands/npm-ci/) for reproducible installs in CI.
3. **Turborepo runs the root tasks.** `turbo.json` defines `build` (outputs `.next/**` without `.next/cache`, and `out/**`), `typecheck`, `test` (unit tests) and `test:e2e` (Playwright, never cached). Each task hashes its workspace's files, dependencies and declared environment variables; an unchanged task replays from `.turbo/` instead of running. `"dependsOn": ["^build"]` builds packages before the apps that use them. Environment variables are strict by default: a task only sees variables listed in `turbo.json`, so add any new build-time variable there. Turborepo hashes only files Git tracks, so `build` also lists `.env*` in its `inputs`; without that, changing a value in an ignored `.env.local` would replay a build with the old value. Arguments after `--` reach the underlying tool, for example `npm run test:e2e -- --headed`. Deploys bypass the cache: the Wrangler build hook runs the marketing workspace build directly. Remote caching is not configured.
4. **Share code only when a real consumer exists.** `packages/` currently holds guidance, not an artificial UI or business-logic library. Future packages expose a deliberate API and are declared in consumers' manifests. Do not import across apps. See [internal packages](https://turborepo.dev/docs/core-concepts/internal-packages).
5. **Keep builds and deployments independent.** Root `build` builds every app; `build:marketing` and `build:dashboard` target one (`turbo run build --filter=...`). Root `deploy` targets marketing only. The dashboard gets its own deployment once its runtime/provider is selected.
6. **Keep secrets and tests near their owner.** Next.js environment files live inside each app. Marketing tests moved with their source. The waitlist Worker stays inside marketing because it is deployed with that site; it is not the main product API. Root `.dev.vars` is the compatibility exception described below.

## Marketing deployment compatibility

The root `wrangler.jsonc` remains the single source of truth for the existing `verityloop` Worker. It points to `apps/marketing/worker/index.ts`, builds only marketing, and uploads only `apps/marketing/out/`. Its Worker name, bindings, routing, compatibility date, and notification settings are preserved.

Keeping this entry point preserves the existing repository-root `npx wrangler deploy` command. It also keeps local Worker credentials at root. There is no second Wrangler configuration to drift out of sync.

Expected Cloudflare Workers Builds settings:

| Setting | Value |
| --- | --- |
| Root directory | Repository root |
| Deploy command | `npm run deploy:marketing` (existing `npx wrangler deploy` also works) |
| Separate build command | May be empty; Wrangler's build hook runs `npm run build --workspace=@verityloop/marketing` (no Turborepo cache) |
| Optional explicit build command | `npm run build --workspace=@verityloop/marketing` (would duplicate the Wrangler build) |
| Suggested include watch paths | `apps/marketing/*`, `package.json`, `package-lock.json`, `wrangler.jsonc`, `turbo.json` |

Cloudflare watch paths match descendants, so `apps/marketing/*` includes files below `src/`. Add shared-package paths when marketing starts consuming them. A root lockfile change should trigger a marketing build because it may change marketing dependencies. These settings are recommendations; this migration does not edit the Cloudflare dashboard.

Cloudflare documents independent Workers and watch paths in [advanced monorepo setups](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/). The current root entry point is an intentional compatibility choice. When product hosting is selected, give it its own deploy configuration and command; never repoint the existing marketing Worker at the product.

## Future growth

- Add product UI features within `apps/dashboard/src/features/<domain>/`, named for the product domain. Backend and job code go in `apps/api` and `apps/worker` once their stack is approved. Use the same domain folder names in every app (for example `briefs`), and put the shared schema and job types in `packages/db` and `packages/contracts`. Don't add placeholder code before then.
- If the API ends up as Next.js route handlers inside `apps/dashboard`, remove `apps/api`, keep the schema in `packages/db`, and update [architecture.md](architecture.md).
- Add shared packages when both apps have a concrete need, with explicit exports and dependencies.
- CI should install once with `npm ci`, then run `npm run typecheck`, `npm test` and `npm run build`, then `npx playwright install chromium` and `npm run test:e2e`. Playwright starts the dashboard dev server itself (`webServer` in `playwright.config.ts`); with `CI` set it never reuses a stray server. Use `npx turbo run <task> --affected` to run only what changed against the base branch.
- Add Turborepo remote caching only when CI times justify it, and never cache deploy tasks.
- Keep generated `.next/`, `out/`, `.turbo/`, `node_modules/`, environment secrets, and TypeScript build caches ignored at every depth.
