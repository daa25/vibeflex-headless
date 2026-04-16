import { Link } from "wouter";
import { motion } from "framer-motion";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatPrice, getDiscount } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const image = product.images?.[0]?.src;
  const variant = product.variants?.[0];
  const price = variant?.price || "0";
  const compareAt = variant?.compare_at_price;
  const discount = getDiscount(price, compareAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
          {image ? (
            <img
              src={image}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-xs">No Image</span>
            </div>
          )}

          {/* Discount badge only */}
          {discount && (
            <div className="absolute top-3 left-3">
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded font-display tracking-wide">
                -{discount}%
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="inline-block bg-foreground text-background text-xs font-semibold px-4 py-2 rounded font-display tracking-wide w-full text-center">
              SHOP NOW
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase font-display">
            {product.vendor}
          </p>
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors font-display">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="price text-sm font-semibold text-foreground">
              {formatPrice(price)}
            </span>
            {compareAt && parseFloat(compareAt) > parseFloat(price) && (
              <span className="price text-xs text-muted-foreground line-through">
                {formatPrice(compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
