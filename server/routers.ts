import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const SHOP_DOMAIN = "fitforgeshop-33574-mc01z.myshopify.com";
const ADMIN_TOKEN = process.env.SHOP_TOKEN || "";

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
    getProducts: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(250).default(50) }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("products.json", {
          limit: String(input.limit),
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        return data.products;
      }),

    getProductsByCollection: publicProcedure
      .input(z.object({
        collectionId: z.number(),
        limit: z.number().min(1).max(250).default(50),
      }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("products.json", {
          collection_id: String(input.collectionId),
          limit: String(input.limit),
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        return data.products;
      }),

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

    getProductMetafields: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const data = await shopifyFetch(`products/${input.productId}/metafields.json`);
        return data.metafields || [];
      }),

    getSmartCollections: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(250).default(50) }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("smart_collections.json", {
          limit: String(input.limit),
          fields: "id,title,handle,body_html,image",
        });
        return data.smart_collections || [];
      }),

    getCustomCollections: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(250).default(50) }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("custom_collections.json", {
          limit: String(input.limit),
          fields: "id,title,handle,body_html,image",
        });
        return data.custom_collections || [];
      }),

    searchProducts: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().min(1).max(50).default(20) }))
      .query(async ({ input }) => {
        const data = await shopifyFetch("products.json", {
          title: input.query,
          limit: String(input.limit),
          status: "active",
          fields: "id,title,handle,body_html,vendor,product_type,tags,images,variants",
        });
        return data.products;
      }),
  }),
});

export type AppRouter = typeof appRouter;
