/**
 * Home Page — "Midnight Luxe Sport" Editorial Design
 * Men's / Boys' Activewear & Sporting Goods Focus
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RotateCcw, Zap } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { type ShopifyProduct } from "@/lib/shopify";
import { trpc } from "@/lib/trpc";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-main-jwGPCrqveTDaTdN9ZH66p9.webp";
const TRAINING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-performance-BHAKq5p7sKAjoSwdMbb35q.webp";
const ACTIVEWEAR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-streetwear-jvG5oERfhzFgLQ6BS4FJuu.webp";
const FOOTWEAR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-footwear-jTrZ76YGezk7RFYTcSazan.webp";

const CATEGORIES = [
  {
    title: "Training & Equipment",
    subtitle: "Build Strength",
    href: "/collections/train",
    image: TRAINING_IMG,
  },
  {
    title: "Activewear",
    subtitle: "Move Better",
    href: "/collections/activewear",
    image: ACTIVEWEAR_IMG,
  },
  {
    title: "Footwear",
    subtitle: "Premium Kicks",
    href: "/collections/footwear",
    image: FOOTWEAR_IMG,
  },
  {
    title: "Fan Gear",
    subtitle: "Rep Your Team",
    href: "/collections/fan-gear",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
  },
];

const TRUST_ITEMS = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over $75" },
  { icon: Shield, label: "Authentic Only", desc: "Top athletic brands" },
  { icon: RotateCcw, label: "Easy Returns", desc: "Hassle-free process" },
  { icon: Zap, label: "Fast Delivery", desc: "2–5 business days" },
];

const BRANDS = [
  "Adidas", "Baleaf", "Angles90", "Fanatics", "Gymshark", "Jordan", "ASICS",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: products, isLoading } = trpc.shopify.getProducts.useQuery({ limit: 12 });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Men's athletic gear"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative container h-full flex items-center">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} custom={0} className="label-caps inline-block mb-4">
              Men's &amp; Boys' Athletic Gear
            </motion.span>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-white mb-6"
            >
              BUILT TO<br />
              <span className="text-primary">PERFORM.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-white/70 max-w-lg mb-8 font-body leading-relaxed"
            >
              Activewear, training equipment, and sporting goods for men, boys,
              and athletes — curated from the top brands in the game.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                href="/collections/activewear"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors"
              >
                SHOP ACTIVEWEAR <ArrowRight size={16} />
              </Link>
              <Link
                href="/collections/train"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-white/20 transition-colors border border-white/20"
              >
                TRAINING GEAR
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-border py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-display">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY GRID ===== */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="label-caps block mb-2">Browse</span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/collections"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              All Collections <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <Link href={cat.href} className="group block relative aspect-[4/5] rounded-xl overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs text-white/60 font-medium tracking-wider uppercase mb-1 font-display">
                      {cat.subtitle}
                    </p>
                    <h3 className="font-display font-bold text-2xl text-white">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="label-caps block mb-2">Featured</span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Trending Now
              </h2>
            </div>
            <Link
              href="/collections/new-arrivals"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(products || []).slice(0, 8).map((product: ShopifyProduct, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL SPLIT — Training ===== */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden">
            <div className="relative aspect-square lg:aspect-auto">
              <img
                src={TRAINING_IMG}
                alt="Men's training gear"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-card p-10 md:p-16 flex flex-col justify-center">
              <span className="label-caps block mb-4">Train Harder</span>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight mb-6">
                GEAR BUILT<br />
                FOR THE<br />
                <span className="text-primary">GRIND.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                From resistance bands to barbells, compression tights to
                performance tees — everything a serious athlete needs to
                train at their best, every single day.
              </p>
              <div>
                <Link
                  href="/collections/train"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors"
                >
                  SHOP TRAINING <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MORE PRODUCTS ===== */}
      {(products || []).length > 8 && (
        <section className="py-20 bg-card/50">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="label-caps block mb-2">Just Dropped</span>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                  New Arrivals
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(products || []).slice(8, 12).map((product: ShopifyProduct, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BRANDS ===== */}
      <section className="py-16 border-y border-border">
        <div className="container">
          <p className="label-caps text-center mb-8">Top Athletic Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="text-xl md:text-2xl font-display font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors tracking-tight"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <span className="label-caps block mb-4">Stay in the Loop</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
              New Drops. Exclusive Deals.
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the Laced Up community for new arrivals, training tips, and
              athlete-curated picks delivered straight to your inbox.
            </p>
            {subscribed ? (
              <p className="text-primary font-display font-semibold text-lg">
                You're in. Welcome to the team.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-secondary text-foreground px-5 py-3.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors shrink-0"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
            {!subscribed && (
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
