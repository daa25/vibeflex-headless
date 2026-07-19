import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { type ShopifyProduct } from "@/lib/shopify";
import { trpc } from "@/lib/trpc";

const TAMPA_HERO =
  "https://images.unsplash.com/photo-1585463857724-eb1a3e57ef06?auto=format&fit=crop&w=2400&q=88";
const TRAINING_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-performance-BHAKq5p7sKAjoSwdMbb35q.webp";
const STREET_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-streetwear-jvG5oERfhzFgLQ6BS4FJuu.webp";
const FOOTWEAR_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485645033/SbCABGDP28y5zwW9QsdJLu/hero-footwear-jTrZ76YGezk7RFYTcSazan.webp";

const movements = [
  { name: "#UNCOOKED", line: "Still becoming. Never finished.", image: TRAINING_IMG, href: "/collections/uncooked" },
  { name: "490 MOVEMENT", line: "Purpose over pressure.", image: STREET_IMG, href: "/collections/490-movement" },
  { name: "STAY READY", line: "Preparation is the advantage.", image: FOOTWEAR_IMG, href: "/collections/stay-ready" },
];

const marquee = ["TAMPA BUILT", "PRESSURE TESTED", "REP YOUR VIBE", "NO AVERAGE DAYS"];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { data: products, isLoading } = trpc.shopify.getProducts.useQuery({ limit: 12 });

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <section className="relative min-h-[92svh] overflow-hidden border-b border-white/10">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          src={TAMPA_HERO}
          alt="Downtown Tampa skyline at night"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_40%,rgba(35,99,255,0.28),transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/30" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 flex min-h-[92svh] items-end pb-16 pt-32 md:items-center md:pb-0">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <motion.div initial="hidden" animate="visible" className="max-w-4xl">
              <motion.div variants={reveal} custom={0} className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-white/65">
                <span className="h-px w-10 bg-blue-500" />
                <MapPin size={13} className="text-blue-400" /> Tampa, Florida
              </motion.div>

              <motion.h1 variants={reveal} custom={0.08} className="font-display text-[15vw] font-black uppercase leading-[0.76] tracking-[-0.07em] sm:text-8xl lg:text-[8.5rem]">
                Rep Your
                <span className="block bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Vibe.</span>
              </motion.h1>

              <motion.p variants={reveal} custom={0.18} className="mt-8 max-w-xl text-base leading-relaxed text-white/68 md:text-lg">
                Performance apparel for athletes, creators, and competitors who refuse average. Born in Tampa. Built for wherever the work takes you.
              </motion.p>

              <motion.div variants={reveal} custom={0.28} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/collections" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 text-sm font-extrabold uppercase tracking-[0.16em] transition hover:bg-blue-500">
                  Shop the movement <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/community" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/25 bg-white/[0.06] px-8 text-sm font-bold uppercase tracking-[0.16em] backdrop-blur-md transition hover:bg-white/12">
                  <Play size={15} fill="currentColor" /> Our story
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.76 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto hidden aspect-square w-full max-w-[420px] place-items-center lg:grid">
              <div className="absolute inset-8 rounded-full border border-blue-400/20 shadow-[0_0_120px_rgba(37,99,235,.25)]" />
              <div className="absolute inset-16 rounded-full border border-white/10" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-white/20" />
              <motion.div animate={{ rotateY: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }} style={{ transformStyle: "preserve-3d" }} className="relative grid h-56 w-56 place-items-center rounded-full border border-blue-400/45 bg-black/45 shadow-[inset_0_0_60px_rgba(37,99,235,.2),0_0_80px_rgba(37,99,235,.25)] backdrop-blur-xl">
                <div className="text-center font-display font-black uppercase leading-none">
                  <span className="block text-6xl tracking-[-0.08em]">VF</span>
                  <span className="mt-2 block text-[10px] tracking-[0.45em] text-blue-300">Sports</span>
                </div>
              </motion.div>
              <span className="absolute bottom-3 text-[10px] font-bold uppercase tracking-[0.38em] text-white/45">Est. Tampa Bay</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-blue-600 py-4">
        <div className="flex min-w-max animate-[marquee_22s_linear_infinite] items-center gap-10 whitespace-nowrap px-6 text-xs font-black uppercase tracking-[0.28em]">
          {[...marquee, ...marquee, ...marquee].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item}<Sparkles size={13} /><span className="text-blue-200">VIBEFLEX SPORTS</span>
            </span>
          ))}
        </div>
      </section>

      <section className="px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.p variants={reveal} className="text-xs font-extrabold uppercase tracking-[0.32em] text-blue-400">Choose your energy</motion.p>
              <motion.h2 variants={reveal} custom={0.08} className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] md:text-8xl">More than a collection. A mindset.</motion.h2>
            </div>
            <Link href="/collections" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/70 hover:text-white">View all drops <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {movements.map((movement, index) => (
              <motion.div key={movement.name} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: index * 0.1 }}>
                <Link href={movement.href} className="group relative block min-h-[580px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                  <img src={movement.image} alt={movement.name} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-blue-300">Movement 0{index + 1}</p>
                    <h3 className="font-display text-4xl font-black uppercase tracking-[-0.04em] md:text-5xl">{movement.name}</h3>
                    <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-5 text-sm text-white/70">
                      <span>{movement.line}</span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/10 transition group-hover:bg-blue-600"><ArrowRight size={17} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090b10] py-24 md:py-32">
        <div className="container">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-blue-400">Shop now</p>
              <h2 className="mt-4 font-display text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">The latest drop.</h2>
            </div>
            <Link href="/collections/new-arrivals" className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-white/70 hover:text-white sm:flex">Shop all <ArrowRight size={16} /></Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {(products || []).slice(0, 8).map((product: ShopifyProduct, index: number) => <ProductCard key={product.id} product={product} index={index} />)}
            </div>
          )}
        </div>
      </section>

      <section className="relative min-h-[760px] overflow-hidden">
        <img src={TRAINING_IMG} alt="Athlete training in VibeFlex performance apparel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="container relative z-10 flex min-h-[760px] items-center py-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-3xl">
            <motion.p variants={reveal} className="text-xs font-extrabold uppercase tracking-[0.32em] text-blue-400">Built in Tampa</motion.p>
            <motion.h2 variants={reveal} custom={0.08} className="mt-5 font-display text-6xl font-black uppercase leading-[0.86] tracking-[-0.06em] md:text-8xl">Pressure doesn’t break you. It introduces you.</motion.h2>
            <motion.p variants={reveal} custom={0.18} className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">From pre-dawn sessions to the final rep, VibeFlex is made for the moments nobody applauds—the work that creates the person everybody notices.</motion.p>
            <motion.div variants={reveal} custom={0.26} className="mt-9"><Link href="/about" className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] backdrop-blur-md transition hover:bg-white/20">Meet VibeFlex <ArrowRight size={16} /></Link></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 text-black md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px] rounded-[2rem] bg-[#e9eefc] px-6 py-16 md:px-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-blue-700">Members get first access</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] md:text-8xl">Don’t follow the movement. Be early.</h2>
            </div>
            <form onSubmit={subscribe} className="rounded-3xl bg-white p-3 shadow-xl shadow-blue-900/10">
              {subscribed ? (
                <div className="px-5 py-4 font-bold">You’re in. Watch your inbox for the next drop.</div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email address" className="min-h-14 flex-1 rounded-full border border-black/10 bg-[#f6f7fb] px-6 text-sm outline-none transition focus:border-blue-600" />
                  <button type="submit" className="min-h-14 rounded-full bg-black px-7 text-xs font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-blue-600">Join VibeFlex</button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1500px] grid-cols-1 gap-8 border-t border-black/10 pt-10 sm:grid-cols-3">
          {[{ icon: Truck, title: "Fast fulfillment", text: "Tracked delivery on every order." }, { icon: RotateCcw, title: "Easy returns", text: "A straightforward return process." }, { icon: ShieldCheck, title: "Secure checkout", text: "Shopify-powered payment protection." }].map((item) => (
            <div key={item.title} className="flex gap-4"><item.icon className="mt-1 text-blue-700" size={21} /><div><h3 className="font-display text-lg font-black uppercase">{item.title}</h3><p className="mt-1 text-sm text-black/55">{item.text}</p></div></div>
          ))}
        </div>
      </section>
    </main>
  );
}
