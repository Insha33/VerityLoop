# Monorepo organization

Research reviewed on September 30, 2026 against current official npm, Turborepo, Next.js, and Cloudflare documentation. Layout last changed 2026-11-21: `apps/product` became `apps/dashboard`, `apps/api` and `apps/worker` were added (README only), Turborepo now runs the root tasks, and both apps deploy from GitHub Actions. The layout follows what popular Next.js and AI-agent monorepos do (cal.com, dub, midday, next-forge, Langfuse, trigger.dev and others). For how the parts connect, see [architecture.md](architecture.md).

## Decisions and reasons

1. **Every deployable goes in `apps/`; everything imported goes in `packages/`.** `apps/marketing` owns the public site, SEO, assets, and waitlist endpoint. `apps/dashboard` owns the product UI. `apps/api` (product API) and `apps/worker` (evidence jobs) hold only READMEs that set each app's boundary; they get code and a `package.json` once their stack decision is approved, and the existing `apps/*` workspace glob picks them up. This is the [Turborepo convention](https://turborepo.com/docs/crafting-your-repository/structuring-a-repository) ("`apps/` for applications and services"). Apps are named for what they are, not by front end or back end. Each app has its own manifest, dependencies, framework config, TypeScript config and output directory. Product server features must not inherit marketing's `output: "export"` constraint.
2. **Keep npm and one root lockfile.** The repo already used npm. [Native workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) provide package linking and per-app commands without a package-manager migration. Dependencies belong to the app using them; root dependencies are repository tooling. Use [`npm ci`](https://docs.npmjs.com/cli/v11/commands/npm-ci/) for reproducible installs in CI.
3. **Turborepo runs the root tasks.** `turbo.json` defines `build` (outputs `.next/**` without `.next/cache`, and `out/**`), `typecheck`, `test` (unit tests) and `test:e2e` (Playwright, never cached). Each task hashes its workspace's files, dependencies and declared environment variables; an unchanged task replays from `.turbo/` instead of running. `"dependsOn": ["^build"]` builds packages before the apps that use them. Environment variables are strict by default: a task only sees variables listed in `turbo.json`, so add any new build-time variable there. Turborepo hashes only files Git tracks, so `build` also lists `.env*` in its `inputs`; without that, changing a value in an ignored `.env.local` would replay a build with the old value. Arguments after `--` reach the underlying tool, for example `npm run test:e2e -- --headed`. Deploys bypass the cache: the Wrangler build hook runs the marketing workspace build directly, and OpenNext runs the dashboard build directly. Remote caching is not configured.
4. **Share code only when a real consumer exists.** `packages/` currently holds guidance, not an artificial UI or business-logic library. Future packages expose a deliberate API and are declared in consumers' manifests. Do not import across apps. See [internal packages](https://turborepo.dev/docs/core-concepts/internal-packages).
5. **Keep builds and deployments independent.** Root `build` builds every app; `build:marketing` and `build:dashboard` target one (`turbo run build --filter=...`). Each app has its own Wrangler config, Worker and deploy command (`deploy:marketing`, `deploy:dashboard`); root `deploy` still means marketing. Never repoint one app's Worker at the other.
6. **Keep secrets and tests near their owner.** Next.js environment files live inside each app. Marketing tests moved with their source. The waitlist Worker stays inside marketing because it is deployed with that site; it is not the main product API. Root `.dev.vars` is the compatibility exception described below.

## Deployment

Both apps run on Cloudflare Workers in the account behind `runverityloop.com`, and both deploy from GitHub Actions when started by hand. Status: CI and CD workflows added 2026-11-21; production deploys start once the one-time setup below is done.

| App | Wrangler config | Worker | Domain | Build |
| --- | --- | --- | --- | --- |
| Marketing + waitlist API | root `wrangler.jsonc` | `verityloop` | `runverityloop.com` | Wrangler build hook runs `npm run build --workspace=@verityloop/marketing` and uploads `apps/marketing/out/` |
| Dashboard | `apps/dashboard/wrangler.jsonc` | `verityloop-platform` | `platform.runverityloop.com` | [OpenNext](https://opennext.js.org/cloudflare) (`opennextjs-cloudflare build`) runs `next build` and bundles `.open-next/` |

Custom domains are attached in the Cloudflare dashboard, not in either Wrangler config, so a deploy never moves a domain.

### Pipeline

Production deploys are manual: **Actions → Deploy marketing** (or **Deploy dashboard**) **→ Run workflow**, with `main` selected. Merging to `main` deploys nothing by itself.

| Workflow | Runs when | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Every pull request; called by both deploy workflows before production | `verify`: `npm run typecheck`, `npm test`, `npm run deploy:check`, `npm run deploy:check:dashboard` (each builds its app the way production does and validates the Worker bundle). `e2e`: dashboard Playwright journeys, with traces uploaded on failure |
| `.github/workflows/deploy-marketing.yml` | Run by hand; and pull requests that change `apps/marketing/**`, root `wrangler.jsonc`, root `package.json` or `package-lock.json`, or the workflow itself | Manual run on `main`: CI, then `wrangler deploy` to `production-marketing`. PR: preview |
| `.github/workflows/deploy-dashboard.yml` | Run by hand; and pull requests that change `apps/dashboard/**`, root `package.json` or `package-lock.json`, or the workflow itself | Manual run on `main`: CI, then OpenNext build and `wrangler deploy` to `production-dashboard`. PR: preview |

- **A manual run from any branch other than `main`** runs CI and stops; only `main` reaches production.
- **Preview deploys.** For pull requests from this repository, the deploy workflow uploads a Worker version with the alias `pr-<number>` (`wrangler versions upload --preview-alias`). This happens automatically, filtered by the `paths` lists above. A version never takes production traffic. Its URL (`https://pr-<number>-<worker>.<subdomain>.workers.dev`) appears as the PR's `preview-marketing` or `preview-dashboard` deployment and in the job summary. Fork and Dependabot PRs can't read secrets and get CI only. Preview versions share the Worker's production secrets and bindings, so a waitlist signup on a marketing preview writes to the real Supabase table.
- **Ordering.** Each deploy workflow has one concurrency group per branch: a second production run waits for the first instead of cancelling it, and a new push to a PR cancels that PR's previous preview run.
- **Shared code.** When an app starts importing a package from `packages/`, add that package's path to its deploy workflow's `paths` list, or PRs changing it won't get a preview.
- Deploys use [`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action) with the repository's own Wrangler version, and never use the Turborepo cache.

### Roll back

Production rollback is a Cloudflare operation: `npx wrangler rollback` (root, marketing) or `npx wrangler rollback --config apps/dashboard/wrangler.jsonc`, or **Workers & Pages → the Worker → Deployments** in the dashboard. Then revert the commit on `main` so the next deploy doesn't reintroduce it. Re-running an old deploy run also redeploys its commit, so prefer the rollback command.

### One-time setup

Done: the dashboard Worker is `verityloop-platform`, and the `CLOUDFLARE_API_TOKEN` (from the "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID` repository secrets are set. Remaining, for someone with access to the Cloudflare account:

1. **Disconnect Workers Builds from the `verityloop` Worker** (Workers & Pages → verityloop → Settings → Builds → Disconnect). Until then, every push to `main` still deploys marketing automatically, without waiting for CI.
2. Optionally add required reviewers to the `production-*` environments (Settings → Environments) to approve each production deploy, and require the CI checks in a branch protection rule for `main`.

The first dashboard deploy replaces the hand-deployed build, along with any bindings that build had that `apps/dashboard/wrangler.jsonc` doesn't declare. Run **Actions → Deploy dashboard → Run workflow** on `main` to ship the current dashboard.

Cloudflare documents version uploads and preview URLs in [versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/) and [preview URLs](https://developers.cloudflare.com/workers/configuration/previews/).

## Future growth

- Add product UI features within `apps/dashboard/src/features/<domain>/`, named for the product domain. Backend and job code go in `apps/api` and `apps/worker` once their stack is approved. Use the same domain folder names in every app (for example `briefs`), and put the shared schema and job types in `packages/db` and `packages/contracts`. Don't add placeholder code before then.
- If the API ends up as Next.js route handlers inside `apps/dashboard`, remove `apps/api`, keep the schema in `packages/db`, and update [architecture.md](architecture.md).
- Add shared packages when both apps have a concrete need, with explicit exports and dependencies.
- `npx turbo run <task> --affected` runs only what changed against the base branch, if CI time ever matters.
- Add Turborepo remote caching only when CI times justify it, and never cache deploy tasks.
- Keep generated `.next/`, `out/`, `.turbo/`, `node_modules/`, environment secrets, and TypeScript build caches ignored at every depth.
