import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const SHOP_DOMAIN = "fitforgeshop-33574-mc01z.myshopify.com";
const ADMIN_TOKEN = process.env.SHOP_TOKEN || "";

if (!ADMIN_TOKEN) {
  console.error('[ERROR] SHOP_TOKEN environment variable is not set!');
  console.error('[DEBUG] Available env vars:', Object.keys(process.env).filter(k => k.includes('SHOP') || k.includes('TOKEN')).join(', '));
}

// ─── Vendors / product types to exclude from the storefront ─────────────────
// Focus: Men's / Boys' activewear and sporting goods
const EXCLUDED_VENDORS = new Set(["DHgate"]);

const EXCLUDED_TYPE_PATTERNS = [
  /women'?s/i,
  /bath additives/i,
  /home & garden/i,
  /cosmetic bag/i,
  /scarf/i,
  /scarves/i,
  /fashion accessories > hats, scarves/i,
  /apparel > new fashion clothing/i,
  /plus size/i,
];

function isMensRelevant(product: { vendor: string; product_type: string; tags: string }): boolean {
  if (EXCLUDED_VENDORS.has(product.vendor)) return false;
  const type = product.product_type || "";
  for (const pattern of EXCLUDED_TYPE_PATTERNS) {
    if (pattern.test(type)) return false;
  }
  return true;
}

async function shopifyFetch(endpoint: string, params: Record<string, string> = {}) {
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  shopify: router({
    // Fetch active products, filtered to men's/boys' activewear & sporting goods
    getProducts: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(250).default(50),
        page: z.number().min(1).default(1),
      }).optional())
      .query(async ({ input }) => {
        // Fetch extra to account for filtered items
        const limit = input?.limit || 50;
        const fetchLimit = Math.min(limit * 3, 250);
        const data = await shopifyFetch("products.json", {
          limit: String(fetchLimit),
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        const filtered = (data.products as any[]).filter(isMensRelevant);
        return filtered.slice(0, limit);
      }),

    // Fetch products in a specific collection, filtered
    getProductsByCollection: publicProcedure
      .input(z.object({
        collectionId: z.number().int().positive(),
        limit: z.number().min(1).max(250).default(50),
      }).optional())
      .query(async ({ input }) => {
        const collectionId = input?.collectionId || 0;
        const limit = input?.limit || 50;
        // Step 1: Get product IDs in the collection using Collects API
        const collectsData = await shopifyFetch("collects.json", {
          collection_id: String(collectionId),
          limit: "250",
          fields: "product_id",
        });
        
        const productIds = (collectsData.collects as any[]).map((c: any) => c.product_id);
        
        if (productIds.length === 0) {
          return [];
        }
        
        // Step 2: Fetch the actual products
        const data = await shopifyFetch("products.json", {
          limit: "250",
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        
        // Step 3: Filter to only include products in the collection and apply men's relevance filter
        const filtered = (data.products as any[])
          .filter((p: any) => productIds.includes(p.id))
          .filter(isMensRelevant);
        
        return filtered.slice(0, limit);
      }),

    // Fetch single product by handle (no filtering needed — direct lookup)
    getProductByHandle: publicProcedure
      .input(z.object({ handle: z.string() }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("products.json", {
          handle: input.handle,
          limit: "1",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        return data.products[0] || null;
      }),

    // Fetch product metafields for affiliate URL resolution
    getProductMetafields: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const data = await shopifyFetch(`products/${input.productId}/metafields.json`);
        return data.metafields || [];
      }),

    // Smart collections (curated by Shopify rules)
    getSmartCollections: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(250).default(50) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const data = await shopifyFetch("smart_collections.json", {
          limit: String(limit),
          fields: "id,title,handle,body_html,image",
        });
        return data.smart_collections || [];
      }),

    // Custom collections (manually curated)
    getCustomCollections: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(250).default(50) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const data = await shopifyFetch("custom_collections.json", {
          limit: String(limit),
          fields: "id,title,handle,body_html,image",
        });
        return data.custom_collections || [];
      }),

    // Search products by title, filtered to men's/boys' focus
    searchProducts: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().min(1).max(50).default(20) }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("products.json", {
          title: input.query,
          limit: "50",
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        const filtered = (data.products as any[]).filter(isMensRelevant);
        return filtered.slice(0, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
