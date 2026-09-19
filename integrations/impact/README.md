# VibeFlex × Impact.com integration

Two-sided affiliate integration for the VibeFlex Sports store.

- **Side A — Publisher.** VibeFlex earns commission promoting partner brands
  (Fanatics, Nike, New Era, etc.). We pull our Actions (commissions) and
  generate tracking links.
- **Side B — Advertiser.** VibeFlex lists its own catalog on the Impact
  marketplace so affiliates promote us. We publish a priced catalog into a
  Shopify shop metafield (`impact.catalog_json`) the storefront can read.

## Pieces

| Piece | Where it lives | Status |
| --- | --- | --- |
| Universal Tracking Tag (UTT) | Storefront theme — `snippets/impact-utt.liquid`, gated on **Theme settings → Impact.com Affiliate → Impact UTT ID** | Installed in the draft theme; **off until the UTT ID is set** |
| Conversion tag | Shopify **Settings → Checkout → Order status page → Additional scripts** | Owner step (checkout-only surface) |
| Sync module | `impact-sync.mjs` (this folder) | Reference; deploy to a Node host or adapt into a Supabase Edge Function |

## Security

- `IMPACT_ACCOUNT_SID` and `IMPACT_AUTH_TOKEN` are **secrets**. They live only
  in the server environment (Supabase secret / host env). Never in the theme,
  the browser, Airtable, or git.
- The **UTT ID is public** by design (it appears in page source) and belongs in
  the theme setting — not in this module.
- The module writes only a DRAFT-safe metafield. It never activates, publishes,
  or places a paid order.

## Environment (names only — fill values in the host)

```
IMPACT_ACCOUNT_SID        Impact account SID (also the Basic-auth username)
IMPACT_AUTH_TOKEN         Impact API auth token (Basic-auth password)
IMPACT_API_BASE           default https://api.impact.com
IMPACT_ACTIONS_PAGE_SIZE  default 1000
MARGIN_PCT                advertiser catalog markup, default 15
SHOPIFY_STORE             e.g. hbipmy-3g.myshopify.com
SHOPIFY_ADMIN_TOKEN       Shopify Admin API access token
SHOPIFY_API_VERSION       default 2025-07
```

## Usage

```bash
node impact-sync.mjs actions            # Side A: pull recent commissions as JSON
node impact-sync.mjs links <programId>  # Side A: list a program's tracking links
node impact-sync.mjs catalog            # Side B: build priced catalog -> Shopify metafield
```

Requires Node 18+ (global `fetch`). The functions are also importable:
`pullActions`, `listTrackingLinks`, `buildAdvertiserCatalog`,
`pushCatalogToShopifyMetafield`.

## Why it isn't run here

The cloud dev sandbox only reaches `api.github.com`. `api.impact.com` and the
Shopify Admin domain are not allowlisted, so the network paths can't be
exercised in-session. The pure logic (margin math, catalog shaping) is unit-
tested and passing; the network calls run once deployed where egress + secrets
exist (Supabase project `uluyuqrikzicapnezmqd` is the canonical home).

## Two credentials still needed from the owner

1. **Impact UTT ID** (public) — paste into Theme settings, or hand it over and
   it gets set for you.
2. **Impact Account SID + Auth Token** (secret) — add to the server env /
   Supabase secrets so the sync module can authenticate.
