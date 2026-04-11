/**
 * Search Page — /search?q=...
 * Searches products by title via tRPC Shopify proxy
 */

import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { type ShopifyProduct } from "@/lib/shopify";
import { trpc } from "@/lib/trpc";

export default function Search() {
  const searchString = useSearch();
  const queryParams = new URLSearchParams(searchString);
  const query = queryParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);

  // Fetch all products and filter client-side for broader matching
  const { data: allProducts, isLoading: loading } = trpc.shopify.getProducts.useQuery({ limit: 50 });

  // Client-side search filter
  const results = useMemo(() => {
    if (!allProducts) return [];
    if (!query) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(
      (p: ShopifyProduct) =>
        p.title.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q) ||
        p.product_type?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
    );
  }, [allProducts, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

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
            className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-6"
          >
            {query ? (
              <>
                Results for "<span className="text-primary">{query}</span>"
              </>
            ) : (
              "Search Products"
            )}
          </motion.h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search footwear, gear, and more..."
                className="w-full bg-secondary text-foreground pl-12 pr-4 py-3.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-muted-foreground"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-8">
            {loading ? "Searching..." : `${results.length} product${results.length !== 1 ? "s" : ""} found`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary rounded-lg mb-3" />
                  <div className="h-3 bg-secondary rounded w-1/3 mb-2" />
                  <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">No products found for "{query}"</p>
              <p className="text-muted-foreground text-sm mb-6">Try a different search term or browse our collections.</p>
              <Link href="/collections/all" className="text-primary hover:underline text-sm font-medium">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product: ShopifyProduct, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
