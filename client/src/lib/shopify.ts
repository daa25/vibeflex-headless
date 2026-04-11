/**
 * Shopify Storefront API Client
 * Connects to the Laced Up Shopify store via the Storefront API
 * Falls back to Admin API proxy for product data
 */

const SHOP_DOMAIN = "fitforgeshop-33574-mc01z.myshopify.com";
const ADMIN_TOKEN = "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";

// Types
export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  images: { src: string; alt?: string }[];
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
  }[];
  metafields?: { namespace: string; key: string; value: string }[];
}

export interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  image?: { src: string; alt?: string };
}

interface ProductsResponse {
  products: ShopifyProduct[];
}

interface CollectionsResponse {
  smart_collections?: ShopifyCollection[];
  custom_collections?: ShopifyCollection[];
  collections?: ShopifyCollection[];
}

// Fetch wrapper for Shopify Admin API
async function shopifyFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`https://${SHOP_DOMAIN}/admin/api/2024-01/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "X-Shopify-Access-Token": ADMIN_TOKEN,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Get all products with pagination
export async function getProducts(limit = 50): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsResponse>("products.json", {
    limit: String(limit),
    status: "active",
    fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
  });
  return data.products;
}

// Get products by collection
export async function getProductsByCollection(collectionId: number, limit = 50): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsResponse>("products.json", {
    collection_id: String(collectionId),
    limit: String(limit),
    status: "active",
    fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
  });
  return data.products;
}

// Get single product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ProductsResponse>("products.json", {
    handle,
    limit: "1",
    fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
  });
  return data.products[0] || null;
}

// Get product metafields (for affiliate URL)
export async function getProductMetafields(productId: number): Promise<{ namespace: string; key: string; value: string }[]> {
  const data = await shopifyFetch<{ metafields: { namespace: string; key: string; value: string }[] }>(
    `products/${productId}/metafields.json`
  );
  return data.metafields || [];
}

// Get all smart collections
export async function getSmartCollections(limit = 50): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>("smart_collections.json", {
    limit: String(limit),
    fields: "id,title,handle,body_html,image",
  });
  return data.smart_collections || [];
}

// Get all custom collections
export async function getCustomCollections(limit = 50): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>("custom_collections.json", {
    limit: String(limit),
    fields: "id,title,handle,body_html,image",
  });
  return data.custom_collections || [];
}

// Get all collections (smart + custom)
export async function getAllCollections(): Promise<ShopifyCollection[]> {
  const [smart, custom] = await Promise.all([
    getSmartCollections(50),
    getCustomCollections(50),
  ]);
  return [...smart, ...custom];
}

// Search products
export async function searchProducts(query: string, limit = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsResponse>("products.json", {
    title: query,
    limit: String(limit),
    status: "active",
    fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
  });
  return data.products;
}

// Check if product is affiliate
export function isAffiliate(product: ShopifyProduct): boolean {
  return product.tags?.toLowerCase().includes("affiliate") || false;
}

// Get affiliate URL from metafields
export function getAffiliateUrl(metafields: { namespace: string; key: string; value: string }[]): string | null {
  const field = metafields.find(
    (m) => (m.namespace === "impact" && m.key === "affiliate_url") ||
           (m.namespace === "custom" && m.key === "external_affiliate_url")
  );
  return field?.value || null;
}

// Format price
export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

// Get discount percentage
export function getDiscount(price: string, compareAt: string | null): number | null {
  if (!compareAt) return null;
  const p = parseFloat(price);
  const c = parseFloat(compareAt);
  if (c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}
