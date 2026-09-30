# VerityLoop product

Minimal Next.js App Router starter for the main product. Its only page is a development placeholder, and its metadata requests no indexing. This is not access control; add authentication before serving private data.

From the repository root:

```bash
npm run dev:product
npm run build:product
npm run start:product
```

Development and production preview use port 3001. Marketing uses port 3000.

Start routes in `src/app/`. Add feature modules inside `src/` as the product takes shape. Keep product environment variables in `.env.local` here and add non-secret examples when integrations are implemented.

This app has its own Next.js config and does not use marketing's static-export setting. It can grow to include server-rendered routes and API handlers. No production hosting provider, domain, database, authentication system, or deployment pipeline is configured yet. Root `npm run deploy` deploys only marketing.
