/**
 * VibeFlex × Impact.com — sync reference implementation
 * =====================================================
 * A single, dependency-light Node module (ESM, Node 18+ for global fetch)
 * that covers the two sides of the VibeFlex Impact.com integration:
 *
 *   Side A — PUBLISHER  : VibeFlex earns commission promoting partner brands.
 *                         Pull performance (Actions) so we can see what our
 *                         affiliate links earned, and generate tracking links.
 *
 *   Side B — ADVERTISER : VibeFlex lists its own catalog on the Impact
 *                         marketplace so affiliates promote VibeFlex and we
 *                         pay them commission. We push a priced catalog into a
 *                         Shopify metafield the storefront can read, and expose
 *                         a normalized feed other systems (Airtable) can log.
 *
 * DESIGN RULES (match the VibeFlex canon):
 *   - Every credential is read from the environment. NOTHING is hardcoded.
 *   - The Impact Account SID + Auth Token are SECRETS. They live only in the
 *     server environment (Supabase secret / host env), never in the theme,
 *     never in the browser, never committed.
 *   - The Universal Tracking Tag ID is PUBLIC and lives in the theme, not here.
 *   - This module never activates products, never publishes, never places a
 *     paid order. It reads Impact and writes a Shopify DRAFT-safe metafield.
 *
 * WHY THIS SHIPS AS A REFERENCE, NOT A LIVE RUN:
 *   The cloud dev sandbox only reaches api.github.com. api.impact.com and the
 *   Shopify Admin domain are not on its allowlist, so this cannot be exercised
 *   in-session. Deploy it to a Node host or adapt the two `fetch` helpers into
 *   a Supabase Edge Function in project `uluyuqrikzicapnezmqd`, where the
 *   egress and the secrets already live.
 *
 * ENV CONTRACT (names only — fill values in the host, never here):
 *   IMPACT_ACCOUNT_SID        Impact account SID (secret; also the Basic-auth user)
 *   IMPACT_AUTH_TOKEN         Impact API auth token (secret; Basic-auth password)
 *   IMPACT_API_BASE           default https://api.impact.com
 *   IMPACT_ACTIONS_PAGE_SIZE  default 1000
 *   MARGIN_PCT                advertiser catalog markup, default 15
 *   SHOPIFY_STORE             e.g. hbipmy-3g.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN       Shopify Admin API access token (secret)
 *   SHOPIFY_API_VERSION       default 2025-07
 *
 * USAGE:
 *   node impact-sync.mjs actions            # Side A: pull recent actions -> stdout JSON
 *   node impact-sync.mjs links <programId>  # Side A: list ad tracking links for a program
 *   node impact-sync.mjs catalog            # Side B: build priced catalog -> Shopify metafield
 */

const CFG = {
  accountSid: process.env.IMPACT_ACCOUNT_SID,
  authToken: process.env.IMPACT_AUTH_TOKEN,
  apiBase: process.env.IMPACT_API_BASE || 'https://api.impact.com',
  actionsPageSize: Number(process.env.IMPACT_ACTIONS_PAGE_SIZE || 1000),
  marginPct: Number(process.env.MARGIN_PCT || 15),
  shopifyStore: process.env.SHOPIFY_STORE,
  shopifyToken: process.env.SHOPIFY_ADMIN_TOKEN,
  shopifyApiVersion: process.env.SHOPIFY_API_VERSION || '2025-07',
};

function requireEnv(keys) {
  const missing = keys.filter((k) => !CFG[k]);
  if (missing.length) {
    const envNames = {
      accountSid: 'IMPACT_ACCOUNT_SID',
      authToken: 'IMPACT_AUTH_TOKEN',
      shopifyStore: 'SHOPIFY_STORE',
      shopifyToken: 'SHOPIFY_ADMIN_TOKEN',
    };
    throw new Error(
      `Missing required env: ${missing.map((k) => envNames[k] || k).join(', ')}`
    );
  }
}

/* ---------------------------------------------------------------- Impact API */

function impactAuthHeader() {
  // Impact uses HTTP Basic auth: user = AccountSID, password = AuthToken.
  const raw = `${CFG.accountSid}:${CFG.authToken}`;
  return 'Basic ' + Buffer.from(raw).toString('base64');
}

async function impactGet(path, params = {}) {
  requireEnv(['accountSid', 'authToken']);
  const url = new URL(`${CFG.apiBase}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: impactAuthHeader(), Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Impact GET ${path} -> ${res.status} ${res.statusText} ${body.slice(0, 400)}`);
  }
  return res.json();
}

/**
 * Side A — pull the publisher's Actions (conversions/commissions) with paging.
 * Returns a normalized array; the raw Impact shape is preserved under `_raw`.
 */
export async function pullActions({ startDate, endDate } = {}) {
  const path = `/Mediapartners/${CFG.accountSid}/Actions`;
  const out = [];
  let page = 1;
  // Impact paginates with Page / PageSize and returns @nextpageuri.
  // We follow pages defensively up to a sane ceiling.
  for (let guard = 0; guard < 100; guard++) {
    const data = await impactGet(path, {
      Page: page,
      PageSize: CFG.actionsPageSize,
      StartDate: startDate,
      EndDate: endDate,
    });
    const actions = data.Actions || [];
    for (const a of actions) {
      out.push({
        id: a.Id,
        campaign: a.CampaignName,
        state: a.State,
        payout: Number(a.Payout || 0),
        saleAmount: Number(a.Amount || 0),
        currency: a.Currency,
        actionDate: a.EventDate || a.CreationDate,
        _raw: a,
      });
    }
    if (!data['@nextpageuri'] || actions.length === 0) break;
    page += 1;
  }
  return out;
}

/**
 * Side A — list the ad / tracking-link set for a program we've joined, so the
 * store (or Airtable) can attach the right affiliate URL to each partner item.
 */
export async function listTrackingLinks(programId) {
  if (!programId) throw new Error('listTrackingLinks(programId) requires a programId');
  const path = `/Mediapartners/${CFG.accountSid}/Ads`;
  const data = await impactGet(path, { ProgramId: programId, PageSize: CFG.actionsPageSize });
  return (data.Ads || []).map((ad) => ({
    adId: ad.Id,
    name: ad.Name,
    type: ad.Type,
    trackingLink: ad.TrackingLink,
    landingPage: ad.LandingPageUrl,
  }));
}

/* -------------------------------------------------------------- Advertiser B */

function priceWithMargin(cost) {
  const c = Number(cost || 0);
  if (!c) return 0;
  // Round in integer cents so half-cents (e.g. 12.50 * 1.15 = 14.375) round up
  // to 14.38 instead of drifting down to 14.37 on binary float error.
  const cents = Math.round(c * 100);
  const withMargin = Math.round(cents * (1 + CFG.marginPct / 100));
  return withMargin / 100;
}

/**
 * Side B — build the normalized VibeFlex catalog Impact affiliates promote.
 * `items` is your own product source (Shopify export, DB, etc.). Kept as a
 * pure function so it is trivially testable and never touches the network.
 */
export function buildAdvertiserCatalog(items = []) {
  return items.map((p) => ({
    sku: p.sku,
    title: p.title,
    url: p.url,
    imageUrl: p.imageUrl,
    cost: Number(p.cost || 0),
    price: priceWithMargin(p.cost),
    currency: p.currency || 'USD',
    inStock: p.inStock !== false,
  }));
}

/* ------------------------------------------------------------------ Shopify */

async function shopifyGraphQL(query, variables = {}) {
  requireEnv(['shopifyStore', 'shopifyToken']);
  const res = await fetch(
    `https://${CFG.shopifyStore}/admin/api/${CFG.shopifyApiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': CFG.shopifyToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const json = await res.json();
  if (json.errors) throw new Error(`Shopify GraphQL: ${JSON.stringify(json.errors).slice(0, 400)}`);
  const userErrors = json.data?.metafieldsSet?.userErrors;
  if (userErrors?.length) throw new Error(`Shopify userErrors: ${JSON.stringify(userErrors)}`);
  return json.data;
}

/**
 * Store the catalog JSON in a shop-level metafield the storefront can read.
 * Namespace/key are DRAFT-safe: writing a metafield never activates or
 * publishes anything.
 */
export async function pushCatalogToShopifyMetafield(catalog) {
  const mutation = `
    mutation SetCatalog($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id namespace key updatedAt }
        userErrors { field message }
      }
    }`;
  // Shop-owned metafield: ownerId is the Shop GID. Fetch it once.
  const shop = await shopifyGraphQL(`{ shop { id } }`);
  const variables = {
    metafields: [
      {
        ownerId: shop.shop.id,
        namespace: 'impact',
        key: 'catalog_json',
        type: 'json',
        value: JSON.stringify(catalog),
      },
    ],
  };
  return shopifyGraphQL(mutation, variables);
}

/* --------------------------------------------------------------------- CLI */

async function main() {
  const [cmd, arg] = process.argv.slice(2);
  switch (cmd) {
    case 'actions': {
      const actions = await pullActions();
      process.stdout.write(JSON.stringify({ count: actions.length, actions }, null, 2) + '\n');
      break;
    }
    case 'links': {
      const links = await listTrackingLinks(arg);
      process.stdout.write(JSON.stringify(links, null, 2) + '\n');
      break;
    }
    case 'catalog': {
      // Replace this stub source with your real product source.
      const source = [];
      const catalog = buildAdvertiserCatalog(source);
      const result = await pushCatalogToShopifyMetafield(catalog);
      process.stdout.write(JSON.stringify({ pushed: catalog.length, result }, null, 2) + '\n');
      break;
    }
    default:
      process.stderr.write(
        'Usage: node impact-sync.mjs <actions | links <programId> | catalog>\n'
      );
      process.exit(1);
  }
}

// Run as a CLI only when invoked directly; otherwise export the functions.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + '\n');
    process.exit(1);
  });
}
