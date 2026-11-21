# Shared packages

This directory is reserved for reusable libraries; no shared runtime packages are needed yet.

When two apps need the same code, extract a focused package here, such as `ui`, `contracts`, or `config`. Give it a unique `@verityloop/*` name, `private: true`, its own `package.json`, and explicit public exports. Declare it in every consumer's dependencies using a matching local version (npm workspaces link it automatically).

Apps may depend on packages. Packages must not import apps, and apps must not reach into another app's source using relative paths or TypeScript aliases. Keep server-only code separate from browser code. Do not extract marketing-specific components simply because the product might use them later.

Turborepo builds packages before the apps that depend on them (`"dependsOn": ["^build"]` in `turbo.json`). If a package has its own build output, list it in that task's `outputs` so cached runs restore it. The first packages expected are `db` (schema and migrations shared by `apps/api` and `apps/worker`) and `contracts` (job payloads and brief types). Create them when that code exists, not before.
