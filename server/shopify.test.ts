import { describe, expect, it } from "vitest";

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-04";
const hasLiveCredentials = Boolean(SHOP_DOMAIN && CLIENT_ID && CLIENT_SECRET);

async function getAdminToken() {
  const response = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  expect(response.ok).toBe(true);
  const payload = (await response.json()) as { access_token?: string };
  expect(payload.access_token).toBeDefined();
  return payload.access_token!;
}

const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive("Shopify Admin API integration", () => {
  it("exchanges client credentials for a temporary Admin token", async () => {
    const token = await getAdminToken();
    expect(token.length).toBeGreaterThan(10);
  });

  it("can fetch products from Shopify Admin GraphQL API", async () => {
    const token = await getAdminToken();
    const response = await fetch(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "query { products(first: 1) { nodes { id title } } }",
        }),
      },
    );

    expect(response.ok).toBe(true);
    const payload = (await response.json()) as {
      data?: { products?: { nodes?: Array<{ id: string; title: string }> } };
      errors?: unknown[];
    };
    expect(payload.errors).toBeUndefined();
    expect(payload.data?.products?.nodes).toBeDefined();
  });
});

describe("Shopify integration configuration", () => {
  it("does not require private Shopify credentials for normal CI", () => {
    expect(typeof hasLiveCredentials).toBe("boolean");
  });
});
