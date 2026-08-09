window.VIBEFLEX_CONFIG = {
  // Canonical runtime: Supabase project uluyuqrikzicapnezmqd
  // ("vibeflex-printful-automation", org "Vibelink & VibeFlex HQ").
  // This is the only ACTIVE_HEALTHY project and the only one holding the
  // Printful credential and the proven POD Studio Edge Functions.
  supabaseUrl: "https://uluyuqrikzicapnezmqd.supabase.co",

  // Publishable anon key. Safe for the browser by design -- it grants no
  // privileged access on its own. Private Shopify / Printful / Airtable
  // credentials live only in Supabase Edge Function secrets.
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdXl1cXJpa3ppY2FwbmV6bXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzIwNjAsImV4cCI6MjEwMDkwODA2MH0.prVa4xN_XskaWgqu8VmAJAYtFRXLmGByPJzsvq_eqMY",

  // These two domains are intentionally different. Do not collapse them.
  //   shopifyApiDomain    -> Admin API + OAuth (server-side calls)
  //   shopifyPublicDomain -> customer-facing storefront links
  shopifyApiDomain: "hbipmy-3g.myshopify.com",
  shopifyPublicDomain: "vibeflex-813.myshopify.com",

  // Optional public Storefront API token. Left empty on purpose: the store
  // currently serves product reads through tokenless Storefront access.
  storefrontToken: ""
};
