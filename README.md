# VerityLoop Marketing Site

The static marketing site for VerityLoop, an AI product decision system for founders and product teams.

## Stack

- Next.js App Router with TypeScript
- React Server Components with focused Client Components for interactions
- Tailwind CSS v4 and selected shadcn/ui primitives
- Vitest and React Testing Library
- Static export deployed through Cloudflare Workers assets

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm test
npm run typecheck
npm run build
```

`npm run build` writes the production site to `out/`.

## Cloudflare deployment

The Cloudflare asset directory is `./out`, so dependencies and source files are never uploaded as static assets. Wrangler is configured to run `npm run build` before deployment, which creates `out/`.

```bash
npm run deploy
```

In the Cloudflare dashboard, use the repository root as the working directory and `npx wrangler deploy` as the deploy command.
