/**
 * About Page — Brand story, mission, and affiliate disclosure
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Target, Users, Dumbbell, Shield } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-performance-BHAKq5p7sKAjoSwdMbb35q.webp";

const VALUES = [
  {
    icon: Target,
    title: "Curated for Athletes",
    description: "Every product is selected for performance, quality, and value. We focus on what men and boys actually need to train, compete, and perform.",
  },
  {
    icon: Dumbbell,
    title: "Built for the Game",
    description: "From the weight room to the field, the court to the track — we carry gear for every sport and every level of athlete.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by athletes who understand what gear matters. We keep the catalog focused so you spend less time searching and more time training.",
  },
  {
    icon: Shield,
    title: "Authentic Products",
    description: "Every brand in our catalog is verified. No knockoffs, no fakes — just the real thing from the brands you know and trust.",
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
                GEAR FOR<br />
                <span className="text-primary">ATHLETES.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Laced Up by VibeFlex Sports is a curated athletic storefront built
                for men, boys, and serious athletes. We cut through the noise and
                bring you the activewear, training equipment, and sporting goods
                that actually perform.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're training for a sport, staying active, or repping
                your team — we've got the gear. Every product in our catalog is
                hand-selected from top athletic brands for quality, authenticity,
                and value.
              </p>
              <Link
                href="/collections/activewear"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors"
              >
                SHOP THE COLLECTION <ArrowRight size={16} />
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
                alt="Men's athletic training gear"
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

      {/* Disclosure — matter-of-fact, not prominent */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="font-display font-bold text-xl mb-4 text-foreground">
            Disclosure
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Laced Up by VibeFlex Sports works with select athletic brands and
              retailers through affiliate programs. When you click a product link
              and make a purchase on a retailer's site, we may earn a commission
              at no additional cost to you.
            </p>
            <p>
              Our product selection is based on quality and relevance to our
              audience — not commission rates. We only carry brands we'd
              actually recommend.
            </p>
            <p>
              Questions? Reach us at{" "}
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
