# Project TODO — Laced Up Headless Storefront

- [x] Midnight Luxe Sport dark theme with custom CSS variables
- [x] Google Fonts: Plus Jakarta Sans (display), Inter (body), JetBrains Mono (prices)
- [x] Hero section with editorial photography and animated text
- [x] Trust bar with shipping, authenticity, returns, delivery icons
- [x] Category grid with 4 categories (Footwear, Streetwear, Performance, Fan Gear)
- [x] Featured products section (Trending Now) from Shopify API
- [x] Editorial split section with footwear collection CTA
- [x] Brand partners section
- [x] Newsletter signup section
- [x] Navbar with announcement bar, navigation links, search, cart icons
- [x] Footer with brand info, quick links, categories, social links
- [x] Collection page with sort and vendor filter
- [x] Collections index page listing all Shopify collections
- [x] Product detail page with image gallery, variants, pricing, affiliate CTA
- [x] Search page with client-side filtering
- [x] About page with brand story and affiliate disclosure
- [x] ProductCard component with discount badges and affiliate indicators
- [x] Shopify Admin API integration via tRPC server proxy
- [x] SEO meta tags (OG, Twitter, canonical)
- [x] Vitest tests for Shopify API connectivity
- [x] SHOP_TOKEN environment variable configured

## Refocus: Men's/Boys' Activewear & Sporting Goods

- [x] Audit Shopify catalog — identify product types, vendors, tags for filtering
- [x] Update navigation categories to men's activewear focus (Training, Activewear, Footwear, Fan Gear, Recovery)
- [x] Update hero section copy for men's/boys' athletic audience
- [x] Update category grid images and labels for activewear/sporting goods
- [x] Add server-side product filtering to exclude women's-only, fashion accessories, DHgate items
- [x] Update editorial split section messaging for athletic focus
- [x] Update About page copy for men's activewear positioning
- [x] Update brand partners section to highlight athletic brands
- [x] Generate new hero imagery for men's athletic focus
- [x] Test all pages with filtered product set

## Remove "Partner" branding — make affiliate discreet

- [x] Remove "PARTNER" badge from ProductCard component
- [x] Remove "PARTNER DEAL" badge from ProductDetail page
- [x] Change "VIEW DEAL" CTA to something neutral like "SHOP NOW"
- [x] Remove prominent affiliate redirect warning on ProductDetail
- [x] Replace with subtle "Sold by [retailer]" note on product page
- [x] Keep affiliate disclosure only in footer/about page as matter-of-fact


## PHASE 1: Final Catalog Audit

**Status: BLOCKER - Environment Variable Issue**
- [x] Identified root cause: tRPC query parameter parsing broken → FIXED
- [x] Fixed tRPC input validation by making parameters optional
- [x] Fixed navbar routes to match Shopify collection handles  
- [x] Implemented Collects API for proper collection product fetching
- [ ] BLOCKER: SHOP_TOKEN environment variable not injected into server process
- [ ] Debug and fix environment variable injection
- [ ] Verify collection pages display products correctly

- [ ] Verify every published product has real image
- [ ] Verify every published product has valid title
- [ ] Verify every published product has useful description
- [ ] Verify every published product has variants where appropriate
- [ ] Verify every published product has price
- [ ] Verify every published product belongs to correct collection
- [ ] Verify every published product has correct tags
- [ ] Verify every published product has working Add to Cart
- [ ] Verify every published product has working Checkout
- [ ] Verify no broken images across all products
- [ ] Verify no duplicate products
- [ ] Archive low-quality products (do not delete)

## PHASE 2: Curate 12 Collections

- [ ] Finalize VibeFlex Originals collection
- [ ] Finalize Best Sellers collection
- [ ] Finalize Fan Gear collection
- [ ] Finalize NFL collection
- [ ] Finalize NBA collection
- [ ] Finalize MLB collection
- [ ] Finalize Soccer collection
- [ ] Finalize Training Gear collection
- [ ] Finalize Accessories collection
- [ ] Finalize Digital Products collection
- [ ] Finalize UNCOOKED collection
- [ ] Finalize The 490 Movement collection
- [ ] Verify no empty collections
- [ ] Verify no filler products in collections
- [ ] Verify no duplicates in collections

## PHASE 3: Manually Curate Best Sellers

- [ ] Add Built Different to Best Sellers
- [ ] Add Earned Not Given to Best Sellers
- [ ] Add Rise Above to Best Sellers
- [ ] Add Stay Ready to Best Sellers
- [ ] Add Relentless to Best Sellers
- [ ] Add UNCOOKED to Best Sellers
- [ ] Add 490 Movement to Best Sellers
- [ ] Add highest-quality affiliate products to Best Sellers
- [ ] Verify intentional curation (not random ordering)

## PHASE 4: Enhance VibeFlex Originals Product Data

- [ ] Update titles for premium athletic branding
- [ ] Update descriptions for premium athletic branding
- [ ] Add feature bullets to all VibeFlex Originals
- [ ] Write SEO titles for all VibeFlex Originals
- [ ] Write meta descriptions for all VibeFlex Originals
- [ ] Update tags for all VibeFlex Originals
- [ ] Add product recommendations for all VibeFlex Originals
- [ ] Add related products for all VibeFlex Originals

## PHASE 5: Visual Polish and QA

- [ ] Verify homepage renders correctly
- [ ] Verify collections render correctly
- [ ] Verify product pages render correctly
- [ ] Verify cart renders correctly
- [ ] Verify checkout loads correctly
- [ ] Verify no stretched images
- [ ] Verify no placeholder images
- [ ] Verify no broken images
- [ ] Verify no empty product cards
- [ ] Verify no dead links
- [ ] Verify no broken buttons
- [ ] Verify consistent spacing
- [ ] Verify premium typography
- [ ] Verify premium product presentation
- [ ] Test on mobile
- [ ] Test on desktop

## PHASE 6: Shopify Health Verification

- [ ] Verify Shopify products sync correctly
- [ ] Verify Impact products display correctly
- [ ] Verify Gelato products display correctly
- [ ] Verify collections populate correctly
- [ ] Verify search works
- [ ] Verify filters work
- [ ] Verify navigation works
- [ ] Verify footer works
- [ ] Verify policies work
- [ ] Verify contact page works

## PHASE 7: SEO Validation

- [ ] Verify every product has SEO title
- [ ] Verify every product has meta description
- [ ] Verify every product has canonical URL
- [ ] Verify every product has alt text
- [ ] Verify every product has clean URL
- [ ] Verify every collection has SEO title
- [ ] Verify every collection has meta description
- [ ] Verify every collection has canonical URL
- [ ] Verify no placeholder SEO

## PHASE 8: Final Launch QA and Report

- [ ] Complete customer journey on desktop: Home → Collection → Product → Add to Cart → Cart → Checkout
- [ ] Complete customer journey on mobile: Home → Collection → Product → Add to Cart → Cart → Checkout
- [ ] Verify Shopify checkout loads correctly
- [ ] Generate final status report
