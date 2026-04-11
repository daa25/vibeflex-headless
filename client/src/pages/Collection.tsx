/**
 * Collection Page — Shows products filtered by collection
 * Supports: /collections/:handle
 */

import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { type ShopifyProduct } from "@/lib/shopify";
import { trpc } from "@/lib/trpc";

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

export default function Collection() {
  const params = useParams<{ handle: string }>();
  const handle = params.handle || "all";

  const [sort, setSort] = useState<SortOption>("newest");
  const [vendorFilter, setVendorFilter] = useState<string>("all");

  // Fetch collections to find the current one
  const { data: smartCollections } = trpc.shopify.getSmartCollections.useQuery({ limit: 50 });
  const { data: customCollections } = trpc.shopify.getCustomCollections.useQuery({ limit: 50 });

  const allCollections = useMemo(() => [
    ...(smartCollections || []),
    ...(customCollections || []),
  ], [smartCollections, customCollections]);

  const currentCollection = allCollections.find((c: any) => c.handle === handle);

  // Fetch products — either by collection or all
  const { data: allProducts, isLoading: loadingAll } = trpc.shopify.getProducts.useQuery(
    { limit: 50 },
    { enabled: handle === "all" || !currentCollection }
  );

  const { data: collectionProducts, isLoading: loadingCollection } = trpc.shopify.getProductsByCollection.useQuery(
    { collectionId: currentCollection?.id || 0, limit: 50 },
    { enabled: !!currentCollection && handle !== "all" }
  );

  const products: ShopifyProduct[] = (handle === "all" || !currentCollection) ? (allProducts || []) : (collectionProducts || []);
  const loading = (handle === "all" || !currentCollection) ? loadingAll : loadingCollection;

  // Get unique vendors
  const vendors = useMemo(() => {
    const v = new Set(products.map((p: ShopifyProduct) => p.vendor).filter(Boolean));
    return Array.from(v).sort();
  }, [products]);

  // Filter and sort
  const displayProducts = useMemo(() => {
    let filtered = [...products];

    if (vendorFilter !== "all") {
      filtered = filtered.filter((p: ShopifyProduct) => p.vendor === vendorFilter);
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a: ShopifyProduct, b: ShopifyProduct) => parseFloat(a.variants[0]?.price || "0") - parseFloat(b.variants[0]?.price || "0"));
        break;
      case "price-desc":
        filtered.sort((a: ShopifyProduct, b: ShopifyProduct) => parseFloat(b.variants[0]?.price || "0") - parseFloat(a.variants[0]?.price || "0"));
        break;
      case "name":
        filtered.sort((a: ShopifyProduct, b: ShopifyProduct) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, sort, vendorFilter]);

  const title = currentCollection?.title || (handle === "all" ? "All Products" : handle.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-extrabold text-4xl md:text-5xl tracking-tight"
          >
            {title}
          </motion.h1>
          {currentCollection?.body_html && (
            <p className="text-muted-foreground mt-3 max-w-2xl" dangerouslySetInnerHTML={{ __html: currentCollection.body_html }} />
          )}
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-10">
        <div className="container">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-sm text-muted-foreground">
              {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              {vendors.length > 1 && (
                <div className="relative">
                  <select
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="appearance-none bg-secondary text-foreground text-sm pl-4 pr-10 py-2.5 rounded-lg border border-border focus:border-primary outline-none cursor-pointer font-display"
                  >
                    <option value="all">All Brands</option>
                    {vendors.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              )}

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-secondary text-foreground text-sm pl-4 pr-10 py-2.5 rounded-lg border border-border focus:border-primary outline-none cursor-pointer font-display"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <SlidersHorizontal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary rounded-lg mb-3" />
                  <div className="h-3 bg-secondary rounded w-1/3 mb-2" />
                  <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">No products found in this collection.</p>
              <Link href="/collections/all" className="text-primary hover:underline text-sm font-medium">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map((product: ShopifyProduct, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
