import { describe, expect, it } from "vitest";

const SHOP_DOMAIN = "fitforgeshop-33574-mc01z.myshopify.com";

describe("Shopify Admin API", () => {
  it("SHOP_TOKEN env var is set", () => {
    const token = process.env.SHOP_TOKEN;
    expect(token).toBeDefined();
    expect(token!.length).toBeGreaterThan(10);
  });

  it("can fetch products from Shopify Admin API", async () => {
    const token = process.env.SHOP_TOKEN;
    const url = `https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=1&status=active&fields=id,title`;

    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": token!,
        "Content-Type": "application/json",
      },
    });

    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.products).toBeDefined();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0].id).toBeDefined();
    expect(data.products[0].title).toBeDefined();
  });

  it("can fetch smart collections", async () => {
    const token = process.env.SHOP_TOKEN;
    const url = `https://${SHOP_DOMAIN}/admin/api/2024-01/smart_collections.json?limit=1&fields=id,title,handle`;

    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": token!,
        "Content-Type": "application/json",
      },
    });

    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.smart_collections).toBeDefined();
  });
});
