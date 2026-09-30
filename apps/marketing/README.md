# VerityLoop Marketing Site

The static marketing site for VerityLoop, an AI product decision system for founders and product teams.

## Stack

- Next.js App Router with TypeScript
- React Server Components with focused Client Components for interactions
- Tailwind CSS v4 and selected shadcn/ui primitives
- Vitest and React Testing Library
- Static export deployed through Cloudflare Workers assets

## Local development

Run the commands below from the repository root. App source and configuration are in `apps/marketing/`.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Next.js development server previews the marketing UI. To exercise the live waitlist Worker locally, copy `.dev.vars.example` to `.dev.vars`, add the provider credentials, then run:

```bash
npx wrangler dev
```

Wrangler builds the static export and serves both the site and `/api/waitlist` on the URL printed in the terminal.

## Waitlist setup

Waitlist submissions are stored in the existing private `public.waitlist` table before the notification email is sent. Repeated submissions use the table's unique email constraint and do not create duplicate rows or notifications.

1. In **Supabase → Project Settings → API Keys**, copy the Project URL and a server-only `sb_secret_...` key. Never expose that key to the browser or commit it.
2. In Resend, verify `runverityloop.com` so `Run Verity Loop <team@runverityloop.com>` is an authorized sender.
3. For local Worker development, set the following in `.dev.vars`:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_YOUR_SERVER_ONLY_KEY
RESEND_API_KEY=re_YOUR_RESEND_KEY
```

The notification recipient is configured in `wrangler.jsonc` as `inshaaqib2001@gmail.com`.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
```

`npm run build:marketing` writes this site to `apps/marketing/out/`. Root `npm run build` builds both apps.

## Cloudflare deployment

The Cloudflare asset directory is `./apps/marketing/out`, so dependencies and source files are never uploaded as static assets. Wrangler is configured to run `npm run build:marketing` before deployment, which creates `apps/marketing/out/`.

```bash
npm run deploy
```

In the Cloudflare dashboard, use the repository root as the working directory and `npx wrangler deploy` as the deploy command.

For a Git-connected deployment, open **Workers & Pages → verityloop → Settings → Variables and Secrets** and add these encrypted secrets:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`

`WAITLIST_NOTIFICATION_EMAIL` is a non-secret Wrangler variable committed in `wrangler.jsonc`.
