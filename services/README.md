# Services

Backend processes that run on their own, apart from a web app. **None are implemented yet.** Each folder holds only a README with the service's job, its boundaries, and the open decisions. Add code here only once that service's stack is approved.

| Folder | Job | Status |
| --- | --- | --- |
| [`platform-be/`](platform-be/README.md) | API for the product: auth, workspaces, membership, connectors, briefs, decisions | Not started. Its job is documented. |
| [`agent-worker/`](agent-worker/README.md) | Long-running evidence jobs: connector sync, change capture, claim checks, roadmap matching, brief drafting | Not started. Its job is documented. |

The only server code in the repository today is the marketing waitlist endpoint, [`apps/marketing/worker/`](../apps/marketing/worker/index.ts). It deploys with the marketing site and is not the product API.

## Rules

- `services/*` is **not** an npm workspace yet. Add `"services/*"` to the root `package.json` `workspaces` when the first service gets a `package.json`.
- Services never import an app's source. Shared types and contracts go in a `packages/*` library, such as `@verityloop/contracts`, that both sides declare as a dependency.
- Each service owns its own environment variables, tests, and deploy configuration. Do not put service secrets in the root `.dev.vars`; that file belongs to the marketing Worker.
- When a service ships, update [`docs/architecture.md`](../docs/architecture.md) in the same change.
