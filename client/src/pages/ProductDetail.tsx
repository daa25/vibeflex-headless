/**
 * Product Detail Page — /products/:handle
 * Shows product images, variants, pricing, and related products
 */

import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Truck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  getAffiliateUrl,
  isAffiliate,
  formatPrice,
  getDiscount,
  type ShopifyProduct,
} from "@/lib/shopify";
import { trpc } from "@/lib/trpc";

export default function ProductDetail() {
  const params = useParams<{ handle: string }>();
  const handle = params.handle || "";

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const { data: product, isLoading: loadingProduct } = trpc.shopify.getProductByHandle.useQuery(
    { handle },
    { enabled: !!handle }
  );

  const { data: metafields } = trpc.shopify.getProductMetafields.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const { data: allProducts } = trpc.shopify.getProducts.useQuery(
    { limit: 20 },
    { enabled: !!product }
  );

  const affiliateUrl = useMemo(() => {
    if (!metafields) return null;
    return getAffiliateUrl(metafields);
  }, [metafields]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((rp: ShopifyProduct) => rp.id !== product.id && (rp.product_type === product.product_type || rp.vendor === product.vendor))
      .slice(0, 4);
  }, [product, allProducts]);

  const affiliate = product ? (isAffiliate(product) || !!affiliateUrl) : false;

  if (loadingProduct) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-secondary rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-secondary rounded w-1/4" />
              <div className="h-8 bg-secondary rounded w-3/4" />
              <div className="h-6 bg-secondary rounded w-1/3" />
              <div className="h-32 bg-secondary rounded" />
              <div className="h-12 bg-secondary rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/collections/all" className="text-primary hover:underline font-medium">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const price = variant?.price || "0";
  const compareAt = variant?.compare_at_price;
  const discount = getDiscount(price, compareAt);
  const images = product.images || [];

  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border py-4">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-foreground transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden mb-4">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.src}
                    alt={images[selectedImage]?.alt || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}

                {/* Discount badge only */}
                {discount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded font-display">
                      -{discount}% OFF
                    </span>
                  </div>
                )}

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? "border-primary" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <p className="label-caps mb-2">{product.vendor}</p>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="price text-2xl font-bold text-foreground">
                  {formatPrice(price)}
                </span>
                {compareAt && parseFloat(compareAt) > parseFloat(price) && (
                  <span className="price text-lg text-muted-foreground line-through">
                    {formatPrice(compareAt)}
                  </span>
                )}
                {discount && (
                  <span className="bg-destructive/10 text-destructive text-sm font-bold px-3 py-1 rounded font-display">
                    SAVE {discount}%
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3 font-display">Size / Style</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v: any, i: number) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          i === selectedVariant
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA — uniform "SHOP NOW" for all products */}
              <div className="mb-8">
                {affiliate && affiliateUrl ? (
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-display font-bold text-base tracking-wide hover:bg-primary/90 transition-colors w-full justify-center sm:w-auto"
                  >
                    SHOP NOW <ExternalLink size={16} />
                  </a>
                ) : (
                  <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-display font-bold text-base tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center">
                    ADD TO CART
                  </button>
                )}
                {/* Subtle sold-by note for affiliate products */}
                {affiliate && (
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    Sold by {product.vendor}. You'll complete your purchase on their site.
                  </p>
                )}
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={16} className="text-primary" />
                  <span>Authentic Product</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck size={16} className="text-primary" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star size={16} className="text-primary" />
                  <span>Top Rated</span>
                </div>
              </div>

              {/* Description */}
              {product.body_html && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-lg mb-3">Description</h3>
                  <div
                    className="text-muted-foreground text-sm leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.body_html }}
                  />
                </div>
              )}

              {/* Tags — show clean tags, skip internal ones */}
              {product.tags && (
                <div>
                  <h3 className="font-display font-bold text-sm mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(",")
                      .map((tag: string) => tag.trim())
                      .filter((tag: string) => !tag.startsWith("source:") && !tag.startsWith("catalog:") && !tag.startsWith("brand:") && !tag.startsWith("imported-by") && tag !== "affiliate")
                      .map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-card/50">
          <div className="container">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p: ShopifyProduct, i: number) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
