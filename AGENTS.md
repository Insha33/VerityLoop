# AGENTS.md

Instructions for any coding agent (Claude Code, Codex, and others) working in this repository. Claude Code v2.1.277+ reads this file when no `CLAUDE.md` exists. Don't add a `CLAUDE.md` beside it: by default that would replace this file instead of adding to it. For an older client, use a one-line `CLAUDE.md` containing `@AGENTS.md`.

## Repository map

```text
apps/
  marketing/        Public site (Next.js static export) + /api/waitlist Cloudflare Worker
  platform-fe/      Product UI. Currently a frontend-only onboarding preview (sessionStorage)
services/
  platform-be/      README only: product API, auth, workspaces, connectors (not built)
  agent-worker/     README only: evidence pipeline and brief jobs (not built)
packages/           Shared libraries; none yet
docs/               Architecture, plans, product direction, design specs
```

Start with [docs/architecture.md](docs/architecture.md) for how the parts fit together and what is real versus planned.

## Commands (run from the repo root)

| Command | Purpose |
| --- | --- |
| `npm ci` | Install every workspace from the single root lockfile |
| `npm run dev:marketing` / `npm run dev:platform-fe` | Run the marketing site (3000) or the product UI (3001) |
| `npm run typecheck` | Typecheck all workspaces |
| `npm test --workspace=@verityloop/marketing` | Marketing unit tests (Vitest) |
| `npm run test:platform-fe` | Product Playwright journeys; needs `npm run dev:platform-fe` running |
| `npm run build` | Build all workspaces |
| `npm run deploy:check` | Validate the marketing Worker bundle without deploying |

Install a dependency into the workspace that uses it: `npm install <pkg> --workspace=@verityloop/<name>`. Never create app-level lockfiles.

## Boundaries

- Apps never import another app's source. Shared code goes in `packages/*` with explicit exports.
- `services/*` gets code only after its stack decision is approved (see each service README). When a service gets a `package.json`, add `services/*` to the root `workspaces`.
- The marketing waitlist Worker is not the product API. Root `wrangler.jsonc` and `.dev.vars` belong to marketing only.
- `apps/platform-fe` role checks are UI-only and **not a security boundary**. Never describe preview behavior as shipped.

## Keeping docs true to the code

Docs here are working instructions, not history. A doc that disagrees with the code misleads the next agent.

1. **Update docs in the same change as the code.** If a change alters behavior, a path, a command, a token, or a decision recorded in any `.md` file (READMEs, `DESIGN.md`, `docs/**`, plans, the decision ledger), edit that file in the same commit.
2. **One source of truth per topic.** Link to it; don't restate it elsewhere:

   | Topic | Source of truth |
   | --- | --- |
   | System design, components, real vs planned | `docs/architecture.md` |
   | Marketing visual system (tokens, components, motion) | `DESIGN.md` |
   | Product positioning and MVP scope | `docs/verityloop-positioning-and-mvp.md`, `PRODUCT.md` |
   | Product onboarding screens and copy | `docs/design/pm-onboarding.md` (+ `v8/` references) |
   | Repo layout decisions and deploy settings | `docs/monorepo.md` |
   | Each workspace's setup and commands | that workspace's `README.md` |
   | Agent and git rules | this file |

3. **Plans and ledgers carry a status line** (`proposed`, `approved`, `in progress`, `shipped`, or `superseded by <link>`), plus the date it last changed. When work ships, update the status and fix anything the plan now gets wrong. When a plan is replaced, mark it superseded. Don't silently leave it.
4. **Check claims against the code before writing them.** Cite real file paths. Before finishing, confirm every path you mention still exists (`git ls-files <path>`).
5. **External docs (Google Docs PRD and others) aren't edited from here.** If the code or a repo doc now contradicts one, say so in your summary so a person can update it.
6. **Delete or fold stale docs** instead of adding a newer one beside them. Removed history stays in git.

## Git

- Name branches `<type>/<short-kebab-description>`, using the same type as the commit: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`. Example: `feat/early-access-waitlist-offer`.
- Never create branches with a `claude/` prefix. If a session starts on one, rename it before the first push.
- Write commit messages as Conventional Commits with a scope, e.g. `feat(marketing): ...`, `fix(waitlist): ...`, `refactor(platform-fe): ...`.
- Keep unrelated changes on separate branches.
