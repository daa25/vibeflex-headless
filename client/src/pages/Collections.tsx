/**
 * Collections Index — /collections
 * Lists all available Shopify collections
 */

import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const CATEGORY_IMAGES: Record<string, string> = {
  footwear: "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-footwear-jTrZ76YGezk7RFYTcSazan.webp",
  streetwear: "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-streetwear-jvG5oERfhzFgLQ6BS4FJuu.webp",
  "training-equipment": "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-performance-BHAKq5p7sKAjoSwdMbb35q.webp",
};

export default function Collections() {
  const { data: smartCollections, isLoading: loadingSmart } = trpc.shopify.getSmartCollections.useQuery({ limit: 50 });
  const { data: customCollections, isLoading: loadingCustom } = trpc.shopify.getCustomCollections.useQuery({ limit: 50 });

  const loading = loadingSmart || loadingCustom;

  const collections = useMemo(() => [
    ...(smartCollections || []),
    ...(customCollections || []),
  ], [smartCollections, customCollections]);

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
            All Collections
          </motion.h1>
          <p className="text-muted-foreground mt-3">
            Browse our curated categories of athletic and streetwear products.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-10">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-secondary rounded-xl mb-3" />
                  <div className="h-5 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection: any, i: number) => {
                const img = collection.image?.src || CATEGORY_IMAGES[collection.handle] || "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80";
                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/collections/${collection.handle}`} className="group block relative aspect-[16/9] rounded-xl overflow-hidden">
                      <img
                        src={img}
                        alt={collection.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                        <h3 className="font-display font-bold text-xl text-white">
                          {collection.title}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={14} className="text-white" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
