# VibeFlex POD Studio — canonical configuration

Everything below was confirmed against the live connected systems. Prefer these
values over anything found in older repositories, historical `.env` files, or
archived architecture docs — several of those are known to be wrong.

## Canonical systems

| Role | Canonical value |
| --- | --- |
| Commerce source of truth | Shopify `vibeflex-813.myshopify.com` |
| Code source of truth | `daa25/vibeflex-headless` |
| Server runtime + secrets | Supabase project `uluyuqrikzicapnezmqd` |
| Operations control plane | Airtable base `appuaF1jfeBr2PPqn` |
| Studio implementation | `vibeflex-studio-pages/` in this repo |
| Internal tenant | 490 Movement (`490-movement`) |
| First production supplier | Printful |

`daa25/VibeFlex-Studio` is **not** the Studio implementation despite the name.
The Studio lives here, in `vibeflex-studio-pages/`.

## Non-secret configuration

```
VIBEFLEX_ENV=production
VIBEFLEX_INTERNAL_TENANT=490-movement
SHOPIFY_API_DOMAIN=hbipmy-3g.myshopify.com
SHOPIFY_PUBLIC_DOMAIN=vibeflex-813.myshopify.com
AIRTABLE_BASE_ID=appuaF1jfeBr2PPqn
AIRTABLE_TABLE_ID=tbl7t3sguT93pYwbV
SUPABASE_PROJECT_REF=uluyuqrikzicapnezmqd
SUPABASE_PUBLIC_URL=https://uluyuqrikzicapnezmqd.supabase.co
```

None of these are secrets. The Supabase anon key is likewise publishable and
belongs in `vibeflex-studio-pages/config.js`.

### The two Shopify domains are not interchangeable

- `hbipmy-3g.myshopify.com` — Admin API and OAuth. Server-side only.
- `vibeflex-813.myshopify.com` — customer-facing storefront links.

Collapsing them into one value breaks either checkout links or Admin auth.
This has already been fixed once; do not undo it.

## Secrets

Secrets live **only** in Supabase Edge Function secrets on project
`uluyuqrikzicapnezmqd`. Never in this repo, the browser, Airtable, Drive,
commits, or a chat transcript.

Refer to secrets by name. Never read or print a value.

| Secret | Consumer | State |
| --- | --- | --- |
| Printful token | `printful-*`, `pod-studio-verify-product`, `integrations` | present, but see below |
| `SHOPIFY_CLIENT_ID` | `integrations` (Admin OAuth) | missing |
| `SHOPIFY_CLIENT_SECRET` | `integrations` (Admin OAuth) | missing |
| `AIRTABLE_TOKEN` | `integrations` | missing |
| `OWNER_USER_ID` | owner gate on Shopify writes | missing |
| `ALLOW_DRAFT_PRODUCT_CREATE` | owner gate on Shopify writes | not enabled |

### Known defect: the Printful secret is misnamed

The project holds exactly one custom secret and it is named
`Shopify & VibeFlex Studio` — a label pasted into the name field. It actually
carries the Printful token, which is why `PRINTFUL_API_KEY is not set` appears
in the logs while Printful calls still succeed.

The working functions cope via a fallback that picks the single non-Shopify
secret. **That fallback breaks the moment a second custom secret is added**,
because it requires exactly one candidate. Adding `SHOPIFY_CLIENT_ID` or
`AIRTABLE_TOKEN` will therefore silently break Printful unless the token is
first re-added under the name `PRINTFUL_TOKEN`.

Do that rename **before** adding any other secret.

## Deployed Edge Functions (project `uluyuqrikzicapnezmqd`)

| Function | Purpose |
| --- | --- |
| `integrations` | action router the Studio UI calls |
| `pod-studio-verify-product` | artwork → storage → variants → real cost → margin → mockup |
| `printful-catalog-lookup` | read-only catalog and variant lookup |
| `printful-create-product` | supplier sync product (owner-gated) |
| `printful-canary` | end-to-end supplier check |
| `env-probe` | reports secret names only, never values |

Deployed function source can drift from `supabase/functions/` in this repo.
Treat the deployed version as the running truth and reconcile deliberately.

## Guardrails

Never, without explicit owner authorization:

- publish or replace the live Shopify theme (draft `161962623213` stays draft)
- activate a product, or change a live price
- place a paid supplier order, or auto-confirm pending Printful orders
- message customers
- rotate, print, or relocate a credential
- create a second backend, a duplicate Shopify product, or another Airtable base

Studio validation uses Shopify **DRAFT** products. Terminal state is
`READY_FOR_APPROVAL`, never `ACTIVE`.

## Current state

- Shopify: 18 active / 21 draft / 39 total. **0 orders, 0 customers.**
- Supplier cost exists for only 5 of 39 products, so margin is uncomputable
  for the rest. This blocks revenue intelligence more than the missing orders
  do, and unlike orders it is fixable now.
- Demand and revenue forecasting are not buildable until real orders exist.
  Do not ship forecasts built on zero observations.

## Commands

```bash
pnpm install
node scripts/vibeflex-doctor.mjs   # non-secret config + integration health
pnpm vitest run                    # tests
```
