const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "https://daa25.github.io";

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function reply(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

function required(name: string, fallback?: string) {
  const value = Deno.env.get(name) ?? fallback;
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

let cachedToken = "";
let tokenExpiresAt = 0;

async function shopifyToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const shop = Deno.env.get("SHOPIFY_SHOP") ?? Deno.env.get("SHOPIFY_SHOP_DOMAIN");
  const clientId = required("SHOPIFY_CLIENT_ID");
  const clientSecret = required("SHOPIFY_CLIENT_SECRET");
  if (!shop) throw new Error("SHOPIFY_SHOP is not configured.");

  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || `Shopify authentication failed (${response.status}).`);
  }

  cachedToken = payload.access_token;
  tokenExpiresAt = Date.now() + Number(payload.expires_in ?? 86_399) * 1000;
  return cachedToken;
}

async function shopify(query: string, variables: Record<string, unknown> = {}) {
  const shop = Deno.env.get("SHOPIFY_SHOP") ?? Deno.env.get("SHOPIFY_SHOP_DOMAIN");
  if (!shop) throw new Error("SHOPIFY_SHOP is not configured.");
  const apiVersion = Deno.env.get("SHOPIFY_API_VERSION") ?? "2026-07";
  const token = await shopifyToken();

  const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors) {
    throw new Error(payload.errors?.[0]?.message || `Shopify API failed (${response.status}).`);
  }
  return payload.data;
}

async function testShopify() {
  const data = await shopify(`query {
    shop { name }
    products(first: 3) { nodes { id title } }
    currentAppInstallation { accessScopes { handle } }
  }`);
  const scopes = data.currentAppInstallation?.accessScopes?.map((scope: { handle: string }) => scope.handle) ?? [];
  return {
    message: `Connected to ${data.shop.name}. Read ${data.products.nodes.length} products.`,
    scopes,
  };
}

async function testPrintful() {
  const token = required("PRINTFUL_TOKEN");
  const response = await fetch("https://api.printful.com/stores", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Printful connection failed (${response.status}).`);
  const payload = await response.json();
  return { message: `Connected to Printful. Found ${payload.result?.length || 0} store(s).` };
}

async function testAirtable() {
  const token = required("AIRTABLE_TOKEN");
  const base = Deno.env.get("AIRTABLE_BASE_ID") ?? "appuaF1jfeBr2PPqn";
  const table = Deno.env.get("AIRTABLE_TABLE_ID") ?? "tbl7t3sguT93pYwbV";
  const response = await fetch(`https://api.airtable.com/v0/${base}/${table}?maxRecords=3`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Airtable connection failed (${response.status}).`);
  const payload = await response.json();
  return { message: `Connected to Airtable. Read ${payload.records?.length || 0} records.` };
}

function jwtClaims(req: Request): Record<string, unknown> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return {};
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return {};
  }
}

function requireOwnerForWrite(req: Request) {
  if (Deno.env.get("ALLOW_DRAFT_PRODUCT_CREATE") !== "true") {
    throw new Error("Shopify draft creation is disabled until owner authentication is configured.");
  }
  const claims = jwtClaims(req);
  const ownerId = required("OWNER_USER_ID");
  if (claims.role !== "authenticated" || claims.sub !== ownerId) {
    throw new Error("Owner authentication is required for Shopify writes.");
  }
}

function validateVariants(variants: Array<{ sku: string }>) {
  if (variants.length !== 24) throw new Error(`Expected 24 variants; received ${variants.length}.`);
  if (new Set(variants.map((variant) => variant.sku)).size !== 24) {
    throw new Error("Duplicate SKUs detected.");
  }
}

async function runDemo(req: Request, product: any) {
  requireOwnerForWrite(req);
  validateVariants(product.variants);
  const input = {
    title: product.title,
    status: "DRAFT",
    productOptions: [
      { name: "Color", values: product.colors.map((name: string) => ({ name })) },
      { name: "Size", values: product.sizes.map((name: string) => ({ name })) },
    ],
  };
  const data = await shopify(
    `mutation Create($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id title status }
        userErrors { field message }
      }
    }`,
    { product: input },
  );
  if (data.productCreate.userErrors?.length) {
    throw new Error(data.productCreate.userErrors.map((error: { message: string }) => error.message).join("; "));
  }
  const productCreated = data.productCreate.product;
  return {
    message: `Created Shopify DRAFT ${productCreated.id}. All 24 SKUs validated. Bulk variant creation remains gated until the live mutation is verified.`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return reply(req, { error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    if (body.action === "test-shopify") return reply(req, await testShopify());
    if (body.action === "test-printful") return reply(req, await testPrintful());
    if (body.action === "test-airtable") return reply(req, await testAirtable());
    if (body.action === "run-hoodie-demo") return reply(req, await runDemo(req, body.product));
    return reply(req, { error: "Unknown action" }, 400);
  } catch (error) {
    return reply(req, { error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
