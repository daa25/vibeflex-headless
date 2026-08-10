# VibeFlex POD Studio — Canonical Claude Project Context

## Mission

Ship one production-grade VibeFlex POD Studio workflow for 490 Movement, then prove repeatability with a second product, then evolve the same system into a multi-tenant Shopify SaaS.

Do not create another backend, storefront, or duplicate Shopify product when the existing canonical systems can be extended.

## Canonical architecture

- **GitHub:** code source of truth
- **Repository:** `daa25/vibeflex-headless`
- **Branch:** `main`
- **Studio frontend:** `vibeflex-studio-pages/`
- **Supabase runtime:** `whfbpjgqlsoshrvpsoua`
- **Supabase public URL:** `https://whfbpjgqlsoshrvpsoua.supabase.co`
- **Supabase Edge Function:** `integrations`
- **Shopify API/OAuth domain:** `hbipmy-3g.myshopify.com`
- **Shopify public domain:** `vibeflex-813.myshopify.com`
- **Airtable control plane base:** `appuaF1jfeBr2PPqn`
- **Internal proof tenant:** `490-movement`
- **First supplier to productionize:** Printful

## Existing Studio capabilities

The Studio is a static/mobile-first GitHub Pages frontend backed by Supabase Edge Functions. It already contains Shopify, Printful, and Airtable connection-test paths, a Shopify Draft product creation gate, Storefront preview, and 24-variant hoodie validation.

Private credentials must stay server-side in Supabase secrets. Never place private values in GitHub Pages, browser config, Airtable, Drive, screenshots, chat, or committed `.env` files.

## Backend environment names currently consumed by `integrations`

Do not print values. Treat these names only as configuration contracts:

- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`
- `SHOPIFY_API_VERSION` (optional, defaults to `2026-07`)
- `PRINTFUL_TOKEN`
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID` (optional; canonical value above)
- `AIRTABLE_TABLE_ID`
- `ALLOWED_ORIGIN`
- `ALLOW_DRAFT_PRODUCT_CREATE`
- `OWNER_USER_ID`

Do not add `SHOPIFY_ADMIN_ACCESS_TOKEN` unless the current implementation is intentionally changed away from its client-credentials token exchange.

## Non-secret cloud configuration

Safe values for a Claude/cloud development environment:

```env
NODE_ENV=production
VIBEFLEX_ENV=production
VIBEFLEX_INTERNAL_TENANT=490-movement
SHOPIFY_API_DOMAIN=hbipmy-3g.myshopify.com
SHOPIFY_PUBLIC_DOMAIN=vibeflex-813.myshopify.com
AIRTABLE_BASE_ID=appuaF1jfeBr2PPqn
SUPABASE_PROJECT_REF=whfbpjgqlsoshrvpsoua
SUPABASE_PUBLIC_URL=https://whfbpjgqlsoshrvpsoua.supabase.co
```

These are not credentials.

## P0 definition of done

One real operator workflow must run through the actual Studio and produce:

1. real artwork
2. real Printful blank
3. real Printful variants
4. verified supplier cost
5. margin calculation
6. real mockup
7. generated product content/SEO
8. Shopify **DRAFT** product or safe update of the designated existing draft
9. correct variants and media
10. Airtable operational record
11. Airtable Agent Run
12. final `READY_FOR_APPROVAL` state

No product activation, live-theme publication, or paid supplier order is allowed during P0.

## P1

Immediately after P0, send a second product format through the same Studio UI and backend without one-off engineering. P1 proves repeatability.

## Safety gates

Require owner approval before:

- activating/publishing Shopify products
- publishing Shopify themes
- paid supplier orders
- live price changes above the approved threshold
- credential rotation
- deleting production data
- sending customer outreach

Never use leaked or historical credentials discovered in files, Drive, docs, chat, git history, or screenshots.

## Operating rules

1. Inspect current code/live integrations before assuming.
2. Prefer extending existing code over creating parallel implementations.
3. Use Shopify as commerce truth, Supabase as secure runtime, Airtable as operations/audit, GitHub as code truth.
4. Keep drafts non-purchasable unless the owner explicitly approves activation.
5. Never fabricate supplier cost, mockup readiness, demand, revenue, or ML confidence.
6. In cold-start analytics, prioritize verified economics and instrumentation before predictive claims.
7. Log material automation executions to Airtable `Agent Runs`.
8. When blocked, return the smallest genuine owner-only action; continue all safe work that does not require it.

## Validation commands

Run before committing implementation changes:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

Run lint when the repository exposes a lint script.
