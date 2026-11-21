# AGENTS.md

Instructions for any coding agent (Claude Code, Codex, and others) working in this repository. Claude Code v2.1.277+ reads this file when no `CLAUDE.md` exists. Don't add a `CLAUDE.md` beside it: by default that would replace this file instead of adding to it. For an older client, use a one-line `CLAUDE.md` containing `@AGENTS.md`.

## Repository map

```text
apps/
  marketing/        Public site (Next.js static export) + /api/waitlist Cloudflare Worker
  dashboard/        Product UI. Currently a frontend-only onboarding preview (sessionStorage)
  api/              README only: product API, auth, workspaces, connectors (not built)
  worker/           README only: evidence pipeline and brief jobs (not built)
packages/           Shared libraries; none yet
docs/               Architecture, plans, product direction, design specs
turbo.json          Turborepo task graph and cache settings
.agents/skills/     Shared agent skills (see "Agent skills" below)
```

Start with [docs/architecture.md](docs/architecture.md) for how the parts fit together and what is real versus planned.

## Commands (run from the repo root)

| Command | Purpose |
| --- | --- |
| `npm ci` | Install every workspace from the single root lockfile |
| `npm run dev` | Run every app's dev server (marketing 3000, dashboard 3001) |
| `npm run dev:marketing` / `npm run dev:dashboard` | Run one app |
| `npm run typecheck` | Typecheck all workspaces (Turborepo, cached) |
| `npm test` | Unit tests in every workspace (Vitest; Turborepo, cached) |
| `npm run test:e2e` | Browser journeys (dashboard Playwright at desktop and mobile; starts its own dev server, never cached). Needs `npx playwright install chromium` once |
| `npm run build` | Build all workspaces (Turborepo, cached) |
| `npm run deploy:check` / `npm run deploy:check:dashboard` | Validate the marketing or dashboard Worker bundle without deploying |

Turborepo runs `build`, `typecheck`, `test` and `test:e2e` from `turbo.json`. Narrow any of them with `--filter`, for example `npx turbo run build --filter=@verityloop/dashboard`. When a task's inputs, outputs or environment variables change, update `turbo.json` in the same change, or cached results will be stale. Deploys never go through the cache: the Wrangler build hook calls the marketing workspace build directly, and OpenNext calls the dashboard build. GitHub Actions (`.github/workflows/`) runs CI on pull requests; production deploys are manual runs of `deploy-marketing.yml` and `deploy-dashboard.yml` on `main`; see [docs/monorepo.md](docs/monorepo.md#deployment). When you add a check that should gate deploys, add it to `ci.yml`.

Install a dependency into the workspace that uses it: `npm install <pkg> --workspace=@verityloop/<name>`. Never create app-level lockfiles.

## Agent skills

Shared skills are committed, so every contributor's agent gets them on clone.

- Each skill lives once in `.agents/skills/<name>/` with a `SKILL.md`. Codex and other agents read this folder.
- Claude Code reads `.claude/skills/<name>`, a symlink to `../../.agents/skills/<name>`. On Windows, run `git config --global core.symlinks true` before cloning, or the links check out as plain text files.
- Invoke a skill by name, for example `/hallmark <prompt>`, `/hallmark redesign <path>` or `/hallmark audit <path>` in Claude Code, or ask your agent to use it.
- **To add a skill:** copy its folder into `.agents/skills/<name>/` (keep its `LICENSE`), run `ln -s ../../.agents/skills/<name> .claude/skills/<name>`, commit both, and add a row below. Update a skill in place; don't keep two versions.

| Skill | Use it for | In Claude Code |
| --- | --- | --- |
| `hallmark` | Designing new pages and sites that don't look generated; `redesign` or `audit` an existing page only when asked | Yes |
| `web-design-engineer` | Browser-rendered visual work in HTML, CSS or React: pages, dashboards, prototypes, decks | Yes |
| `gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins`, `gsap-utils`, `gsap-performance`, `gsap-frameworks` | Official GSAP animation guidance (the marketing site uses GSAP) | Yes |
| `motion-showreel` | Animation videos made in code, exported as MP4 with editable source | Yes |
| `web-video-presentation` | Turning an article or script into a click-through 16:9 web presentation | Yes |
| `beautiful-article` | Turning source material (URL, PDF, DOCX, Markdown, screenshots) into a designed, offline-readable article | Yes |
| `gpt-image-2` | Image generation and editing with GPT Image 2 | Yes |
| `kb-retriever` | Search and Q&A over a local knowledge-base folder | Yes |
| `impeccable` | Design critique, audit, polish and redesign passes | No link yet |
| `design-lab` | Design interviews, then five UI variations before building | No link yet |
| `frontend-ui-engineering` | Accessible, responsive production UI | No link yet |
| `interaction-design` | Microinteractions, transitions and feedback patterns | No link yet |

"No link yet" skills work in Codex and other agents that read `.agents/skills/`. Add the symlink above to use them in Claude Code.

## Boundaries

- Apps never import another app's source. Shared code goes in `packages/*` with explicit exports.
- `apps/api` and `apps/worker` get code only after their stack decision is approved (see each README). Each then owns its own `package.json`, environment variables, tests and deploy configuration.
- Code shared by the API and worker (database schema, job payloads, brief types) goes in a package such as `packages/db` or `packages/contracts`, never in either app.
- Feature folders use the product's domain names (`auth`, `workspaces`, `account`, later `briefs`), and the same name in every app that handles that domain.
- The marketing waitlist Worker is not the product API. Root `wrangler.jsonc` and `.dev.vars` belong to marketing only; the dashboard's Worker config is `apps/dashboard/wrangler.jsonc`.
- `apps/dashboard` role checks are UI-only and **not a security boundary**. Never describe preview behavior as shipped.

## UI design

These rules apply to every app. The bar is Linear's website and Apple Notes: a simple purpose, simple architecture, simple design, simple implementation. Every decision should improve the experience for users, developers and agents at once, without breaking anything.

- **One design system per app, never two in one app.**
  - `apps/dashboard` uses [Astryx](https://astryx.atmeta.com/). Import each component from its own entry (`@astryxdesign/core/Button`), and customize through its theme (`defineTheme`), not overrides. Look components and tokens up with `npx @astryxdesign/cli component <Name>` and `npx @astryxdesign/cli docs <topic>`. Don't run `npx @astryxdesign/cli init`: it creates a `CLAUDE.md`, which makes Claude Code ignore this file.
  - `apps/marketing` uses [shadcn/ui](https://ui.shadcn.com/). Add components with the shadcn CLI into `src/components/ui/`, and customize them through tokens, not by forking them.
  - The two register the same Tailwind color names (`primary`, `muted`, `border` and others) with different meanings, so mixing them breaks one of them. Use each system's standard component and prop names, so people and agents recognize them.
- **Colors come only from shared tokens.** Use the app's design-system tokens (Astryx theme tokens in the dashboard, shadcn variables such as `--background` and `--primary` in marketing), each defined for light and dark. Components and feature CSS never contain hex, `rgb()` or named colors. Brand colors are tokens too.
- **Every screen ships in light and dark mode.** Follow the system setting by default. A change isn't done until both themes are checked in a browser, at desktop and mobile widths.
- **Minimal by default.** One purpose per screen. No editorial labels or eyebrows, no counts unless the number is the content, no sparkle or "AI" icons, no extra panels or cards around content.
- **Complexity is earned and disclosed progressively.** Show the primary action. Put secondary options behind a menu, a disclosure or the next screen.
- **Cut taglines, helper text and secondary labels.** If a screen needs them to make sense, fix the layout instead. Error and validation messages aren't helper text: keep them, short and specific. Accessible names stay even when the visible label goes.
- **Accessible and steady.** Use semantic HTML and labelled controls, so tests and agents can drive the UI by role and name. Keyboard focus exposes everything hover does, with a visible `:focus-visible` style. Targets are at least 44px. Reserve space so content never shifts. With reduced motion, show the finished state immediately.
- **New pages and screens start from a design skill** in the table above, such as `hallmark`.

Each app's design doc records its tokens and any gap against these rules: [DESIGN.md](DESIGN.md) for marketing, [apps/dashboard/README.md](apps/dashboard/README.md) for the dashboard.

## Keeping docs true to the code

Docs here are working instructions, not history. A doc that disagrees with the code misleads the next agent.

1. **Update docs in the same change as the code.** If a change alters behavior, a path, a command, a token, or a decision recorded in any `.md` file (READMEs, `DESIGN.md`, `docs/**`, plans, the decision ledger), edit that file in the same commit.
2. **One source of truth per topic.** Link to it; don't restate it elsewhere:

   | Topic | Source of truth |
   | --- | --- |
   | System design, components, real vs planned | `docs/architecture.md` |
   | UI rules for every app | this file ("UI design") |
   | Marketing visual system (tokens, components, motion) | `DESIGN.md` |
   | Product positioning and MVP scope | `docs/verityloop-positioning-and-mvp.md`, `PRODUCT.md` |
   | Product onboarding screens and copy | `docs/design/pm-onboarding.md` (+ `v8/` references) |
   | Repo layout decisions and deploy settings | `docs/monorepo.md` |
   | Each workspace's setup and commands | that workspace's `README.md` |
   | Shared agent skills | `.agents/skills/`, listed in this file |
   | Agent and git rules | this file |

3. **Plans and ledgers carry a status line** (`proposed`, `approved`, `in progress`, `shipped`, or `superseded by <link>`), plus the date it last changed. When work ships, update the status and fix anything the plan now gets wrong. When a plan is replaced, mark it superseded. Don't silently leave it.
4. **Check claims against the code before writing them.** Cite real file paths. Before finishing, confirm every path you mention still exists (`git ls-files <path>`).
5. **External docs (Google Docs PRD and others) aren't edited from here.** If the code or a repo doc now contradicts one, say so in your summary so a person can update it.
6. **Delete or fold stale docs** instead of adding a newer one beside them. Removed history stays in git.

## Git

- Name branches `<type>/<short-kebab-description>`, using the same type as the commit: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`. Example: `feat/early-access-waitlist-offer`.
- Never create branches with a `claude/` prefix. If a session starts on one, rename it before the first push.
- Write commit messages as Conventional Commits with a scope, e.g. `feat(marketing): ...`, `fix(waitlist): ...`, `refactor(dashboard): ...`.
- Keep unrelated changes on separate branches.
