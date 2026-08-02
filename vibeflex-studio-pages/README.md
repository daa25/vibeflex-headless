# VibeFlex Studio — GitHub Pages Edition

This is a no-build, mobile-first GitHub Pages frontend with a Supabase Edge Function backend.

## Why it is split

GitHub Pages serves static files only. It cannot safely store or execute Shopify Client Secret, Printful token, or Airtable PAT. Those private values belong in Supabase Edge Function secrets.

## Included

- polished mobile dashboard
- Shopify, Printful, and Airtable connection tests
- 24-variant 490 Hoodie validation
- Shopify Draft product creation gate
- live Shopify Storefront preview
- Supabase Edge Function source

## Deploy GitHub Pages

1. Configure `config.js` with your Supabase project URL and browser-safe public key.
2. In repository Settings → Pages, choose GitHub Actions.
3. Run the `Deploy VibeFlex Studio Pages` workflow.

## Deploy the secure backend

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy integrations
npx supabase secrets set \
SHOPIFY_SHOP_DOMAIN=vibeflex-813.myshopify.com \
SHOPIFY_CLIENT_ID=YOUR_VALUE \
SHOPIFY_CLIENT_SECRET=YOUR_VALUE \
PRINTFUL_TOKEN=YOUR_VALUE \
AIRTABLE_TOKEN=YOUR_VALUE \
AIRTABLE_BASE_ID=appuaF1jfeBr2PPqn \
AIRTABLE_TABLE_ID=tbl7t3sguT93pYwbV
```

Never put private credentials into `config.js`, GitHub Pages, Airtable, screenshots, or chat.

## Current limitation

The app validates the complete 24-row hoodie matrix and safely creates a Shopify Draft shell with Color and Size options. Bulk creation of all 24 Shopify variants remains gated until the current Admin GraphQL mutation is tested against the live app scopes.
