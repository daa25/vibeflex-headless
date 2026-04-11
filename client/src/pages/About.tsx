/**
 * About Page — Brand story, mission, and affiliate disclosure
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Target, Users, Globe, Shield } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-streetwear-jvG5oERfhzFgLQ6BS4FJuu.webp";

const VALUES = [
  {
    icon: Target,
    title: "Curated Selection",
    description: "Every product is hand-picked from trusted athletic brands. We don't carry everything — just the best.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by athletes and sneakerheads who understand what gear matters and why quality counts.",
  },
  {
    icon: Globe,
    title: "Global Brands",
    description: "We partner with world-class brands like Fanatics, Angles90, and more to bring you authentic products.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We're upfront about our affiliate partnerships. You get the best deals, and we earn a small commission.",
  },
];

export default function About() {
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
            About Laced Up
          </motion.h1>
        </div>
      </section>

      {/* Hero Split */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps block mb-4">Our Story</span>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight mb-6">
                WHERE SPORT<br />
                MEETS <span className="text-primary">STYLE.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Laced Up by VibeFlex Sports is a curated athletic commerce platform
                that connects you with the world's best sports and streetwear brands.
                We don't just sell products — we curate experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                From premium sneakers to performance training gear, every item in our
                catalog has been hand-selected for quality, authenticity, and value.
                We partner with leading retailers through affiliate programs to bring
                you the best deals without the markup.
              </p>
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors"
              >
                EXPLORE THE COLLECTION <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                src={HERO_IMG}
                alt="VibeFlex Sports streetwear collection"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="label-caps block mb-2">What We Stand For</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <span className="label-caps block mb-2">Transparency</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-6">
            Affiliate Disclosure
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Laced Up by VibeFlex Sports participates in affiliate programs with
              various athletic and sports brands, including but not limited to
              Fanatics, Angles90, Baleaf, Tru Grit Fitness, and others.
            </p>
            <p>
              When you click on a product link and make a purchase on a partner
              retailer's website, we may earn a small commission at no additional
              cost to you. This commission helps us maintain the platform, curate
              new products, and continue providing you with the best deals.
            </p>
            <p>
              All affiliate links are clearly marked with a "Partner Deal" badge
              and the "View Deal" call-to-action button. These links will redirect
              you to the partner retailer's website where you can complete your
              purchase directly.
            </p>
            <p>
              We only partner with brands and retailers that meet our quality
              standards. Our product recommendations are based on genuine curation,
              not commission rates. Your trust is our most valuable asset.
            </p>
            <p className="text-sm">
              For questions about our affiliate partnerships, please contact us at{" "}
              <a href="mailto:support@vibeflexsports.com" className="text-primary hover:underline">
                support@vibeflexsports.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
