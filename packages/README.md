# Shared packages

This directory is reserved for reusable libraries; no shared runtime packages are needed yet.

When two apps need the same code, extract a focused package here, such as `ui`, `contracts`, or `config`. Give it a unique `@verityloop/*` name, `private: true`, its own `package.json`, and explicit public exports. Declare it in every consumer's dependencies using a matching local version (npm workspaces link it automatically).

Apps may depend on packages. Packages must not import apps, and apps must not reach into another app's source using relative paths or TypeScript aliases. Keep server-only code separate from browser code. Do not extract marketing-specific components simply because the product might use them later.

If a package needs compilation before its consumers build, add dependency-aware task orchestration (for example Turborepo) at that point. The current npm workspace build runs in workspace order, not dependency order.
