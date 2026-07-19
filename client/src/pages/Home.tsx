import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Droplets,
  Gauge,
  Instagram,
  MapPin,
  Play,
  ShieldCheck,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

const SHOP_URL = "https://lacedupvfs.myshopify.com";
const TAMPA_HERO =
  "https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?auto=format&fit=crop&w=2400&q=92";
const CAMPAIGN_ONE =
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1800&q=88";
const CAMPAIGN_TWO =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=88";
const CAMPAIGN_THREE =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1800&q=88";
const ATHLETE_STORY =
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=2200&q=88";

const movements = [
  { name: "#UNCOOKED", line: "Still becoming. Never finished.", image: CAMPAIGN_ONE },
  { name: "BUILT DIFFERENT", line: "Average was never invited.", image: CAMPAIGN_TWO },
  { name: "490 MOVEMENT", line: "Pressure creates purpose.", image: CAMPAIGN_THREE },
  { name: "STAY READY", line: "Preparation is the advantage.", image: CAMPAIGN_ONE },
  { name: "LOCK DOWN", line: "Own every inch.", image: CAMPAIGN_THREE },
  { name: "RELENTLESS", line: "The work does not negotiate.", image: CAMPAIGN_TWO },
];

const products = [
  { name: "VibeFlex Performance Tee", price: "$34", image: CAMPAIGN_ONE, label: "New Drop" },
  { name: "490 Movement Training Short", price: "$42", image: CAMPAIGN_TWO, label: "Best Seller" },
  { name: "Stay Ready Performance Hat", price: "$32", image: CAMPAIGN_THREE, label: "Tampa Edition" },
  { name: "#UNCOOKED Compression Top", price: "$48", image: ATHLETE_STORY, label: "Limited" },
];

const tech = [
  { icon: Wind, title: "Airflow", body: "Engineered ventilation that moves heat away when the pace rises." },
  { icon: Droplets, title: "Moisture Control", body: "Fast-drying performance fabric built for Florida intensity." },
  { icon: Gauge, title: "Adaptive Stretch", body: "Four-way movement without losing shape or structure." },
  { icon: ShieldCheck, title: "Built to Last", body: "Durable construction made for training, travel, and repeat wear." },
];

const reveal = {
  hidden: { opacity: 0, y: 42, filter: "blur(10px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const join = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  return (
    <main className="overflow-hidden bg-[#030407] text-white selection:bg-blue-600 selection:text-white">
      <section className="relative min-h-[100svh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
          src={TAMPA_HERO}
          alt="Tampa skyline at blue hour"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(37,99,235,.34),transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030407] via-transparent to-black/35" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:72px_72px]" />

        <nav className="absolute left-1/2 top-5 z-30 flex w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full border border-white/15 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur-2xl md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-blue-400/45 bg-blue-600/15 font-display text-sm font-black">VF</span>
            <span className="hidden font-display text-sm font-black uppercase tracking-[0.2em] sm:block">VibeFlex Sports</span>
          </Link>
          <div className="hidden items-center gap-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white/65 md:flex">
            <a href="#movements" className="transition hover:text-white">Movements</a>
            <a href="#shop" className="transition hover:text-white">Shop</a>
            <a href="#stories" className="transition hover:text-white">Stories</a>
            <Link href="/community" className="transition hover:text-white">Community</Link>
          </div>
          <a href={`${SHOP_URL}/collections/all`} className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[11px] font-black uppercase tracking-[0.16em] text-black transition hover:scale-[1.03]">
            Shop <ArrowRight size={14} />
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1500px] items-end gap-10 px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:pb-0">
          <motion.div initial="hidden" animate="visible" className="max-w-5xl">
            <motion.div variants={reveal} className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.36em] text-blue-200/80">
              <span className="h-px w-12 bg-blue-500" />
              <MapPin size={13} /> Tampa, Florida
            </motion.div>
            <motion.h1 variants={reveal} custom={0.08} className="font-display text-[18vw] font-black uppercase leading-[0.72] tracking-[-0.075em] sm:text-[7rem] lg:text-[9.4rem]">
              Rep Your
              <span className="block bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-transparent">Vibe.</span>
            </motion.h1>
            <motion.p variants={reveal} custom={0.18} className="mt-8 max-w-2xl text-base leading-relaxed text-white/68 md:text-xl">
              Performance apparel inspired by athletes, competitors, creators, and everyone who refuses average. Tampa built. Pressure tested.
            </motion.p>
            <motion.div variants={reveal} custom={0.28} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={`${SHOP_URL}/collections/all`} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 text-xs font-black uppercase tracking-[0.18em] shadow-[0_0_60px_rgba(37,99,235,.35)] transition hover:bg-blue-500">
                Shop Collection <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </a>
              <a href="#movement" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.07] px-8 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-xl transition hover:bg-white/14">
                <Play size={15} fill="currentColor" /> Join the Movement
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto hidden aspect-square w-full max-w-[460px] place-items-center lg:grid">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-white/18" />
            <div className="absolute inset-10 rounded-full border border-blue-400/20 shadow-[0_0_140px_rgba(37,99,235,.3)]" />
            <motion.div animate={{ rotateY: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformStyle: "preserve-3d" }} className="relative grid h-64 w-64 place-items-center rounded-full border border-blue-300/50 bg-black/45 shadow-[inset_0_0_80px_rgba(37,99,235,.22),0_0_90px_rgba(37,99,235,.3)] backdrop-blur-2xl">
              <div className="text-center font-display font-black uppercase leading-none">
                <span className="block text-7xl tracking-[-0.09em]">VF</span>
                <span className="mt-3 block text-[11px] tracking-[0.48em] text-blue-300">Sports</span>
              </div>
            </motion.div>
            <span className="absolute bottom-5 text-[10px] font-black uppercase tracking-[0.42em] text-white/42">Tampa Bay • 2026</span>
          </motion.div>
        </div>

        <a href="#movement" className="absolute bottom-6 left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-xl">
          <ChevronDown size={18} />
        </a>
      </section>

      <section className="border-y border-white/10 bg-blue-600 py-4">
        <div className="flex min-w-max animate-[marquee_24s_linear_infinite] items-center gap-10 whitespace-nowrap px-6 text-[11px] font-black uppercase tracking-[0.3em]">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="flex items-center gap-10">Tampa Built <Sparkles size={13} /> Pressure Tested <Sparkles size={13} /> Rep Your Vibe</span>
          ))}
        </div>
      </section>

      <section id="movement" className="relative px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="text-xs font-black uppercase tracking-[0.34em] text-blue-400">Built in Tampa</motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} custom={0.08} className="mt-5 max-w-6xl font-display text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] md:text-8xl lg:text-[7.5rem]">
            Not another clothing brand. A performance movement.
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} custom={0.16} className="mt-8 max-w-2xl text-lg leading-relaxed text-white/55">
            VibeFlex is built for the work nobody sees—the repetitions, pressure, recovery, and discipline that create the person everybody notices.
          </motion.p>
        </div>
      </section>

      <section id="movements" className="pb-28 md:pb-40">
        <div className="mb-10 flex items-end justify-between px-5 md:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-400">Choose your energy</p>
            <h2 className="mt-4 font-display text-5xl font-black uppercase tracking-[-0.055em] md:text-7xl">The movements.</h2>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.24em] text-white/35 md:block">Swipe to explore →</span>
        </div>
        <div className="flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none]">
          {movements.map((item, index) => (
            <motion.a key={item.name} href={`${SHOP_URL}/collections/all`} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="group relative min-h-[560px] w-[84vw] max-w-[430px] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">Movement 0{index + 1}</p>
                <h3 className="mt-3 font-display text-4xl font-black uppercase tracking-[-0.05em]">{item.name}</h3>
                <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-5 text-sm text-white/65">
                  <span>{item.line}</span><span className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition group-hover:bg-blue-600 group-hover:text-white"><ArrowRight size={17} /></span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="shop" className="border-y border-white/10 bg-[#080a0f] px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex items-end justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.34em] text-blue-400">Shop the drop</p><h2 className="mt-4 font-display text-5xl font-black uppercase tracking-[-0.055em] md:text-7xl">Performance, edited.</h2></div>
            <a href={`${SHOP_URL}/collections/all`} className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.18em] md:flex">Shop all <ArrowRight size={15} /></a>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {products.map((product, index) => (
              <motion.a key={product.name} href={`${SHOP_URL}/collections/all`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black ${index === 0 ? "min-h-[680px] lg:col-span-7 lg:row-span-2" : "min-h-[330px] lg:col-span-5"}`}>
                <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/15" />
                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] backdrop-blur-xl">{product.label}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="flex items-end justify-between gap-4"><div><h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em] md:text-3xl">{product.name}</h3><p className="mt-2 text-sm text-white/55">Performance essential • Tampa edition</p></div><span className="text-xl font-black">{product.price}</span></div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-5"><div className="flex gap-2"><span className="h-5 w-5 rounded-full border border-white/40 bg-black"/><span className="h-5 w-5 rounded-full border border-white/40 bg-blue-600"/><span className="h-5 w-5 rounded-full border border-white/40 bg-white"/></div><span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick shop →</span></div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="relative min-h-[850px] overflow-hidden">
        <img src={ATHLETE_STORY} alt="Athlete training" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/15" />
        <div className="relative z-10 mx-auto flex min-h-[850px] max-w-[1500px] items-center px-5 py-24 md:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl">
            <motion.p variants={reveal} className="text-xs font-black uppercase tracking-[0.34em] text-blue-400">Athlete story 001</motion.p>
            <motion.h2 variants={reveal} custom={0.08} className="mt-5 font-display text-6xl font-black uppercase leading-[0.86] tracking-[-0.06em] md:text-8xl">Pressure doesn’t break you. It introduces you.</motion.h2>
            <motion.p variants={reveal} custom={0.18} className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">Real athletes. Real work. Real stories from Tampa and beyond—built around the moments before anybody is watching.</motion.p>
            <motion.a variants={reveal} custom={0.26} href="#community" className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-xl"><Play size={15} fill="currentColor" /> Watch the story</motion.a>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.34em] text-blue-400">Performance technology</p><h2 className="mt-5 font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] md:text-7xl">Made to move. Built to endure.</h2></div><p className="max-w-2xl text-lg leading-relaxed text-white/52">Technical comfort without the technical clutter. Every VibeFlex piece is designed around movement, heat, recovery, and repeat performance.</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{tech.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7"><item.icon className="text-blue-400" size={28}/><h3 className="mt-10 font-display text-xl font-black uppercase">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/48">{item.body}</p></motion.div>)}</div>
        </div>
      </section>

      <section id="community" className="border-t border-white/10 bg-blue-600 px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div><p className="text-xs font-black uppercase tracking-[0.34em] text-blue-100">Join the movement</p><h2 className="mt-5 font-display text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] md:text-8xl">Drops. Stories. Tampa energy.</h2><p className="mt-6 max-w-xl text-lg text-blue-100/80">Get first access to limited drops, athlete stories, community events, and ambassador opportunities.</p></div>
          <form onSubmit={join} className="rounded-[2rem] border border-white/25 bg-black/20 p-5 backdrop-blur-xl md:p-7">
            {joined ? <div className="grid min-h-28 place-items-center text-center"><div><Zap className="mx-auto"/><p className="mt-3 font-display text-2xl font-black uppercase">You’re in.</p><p className="mt-1 text-sm text-white/70">Welcome to the movement.</p></div></div> : <><label className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100">Email address</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="min-h-14 flex-1 rounded-full border border-white/20 bg-black/25 px-6 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60"/><button className="min-h-14 rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.18em] text-black">Join now</button></div><p className="mt-4 text-xs text-blue-100/60">No spam. Only drops, stories, and opportunities worth opening.</p></>}
          </form>
        </div>
      </section>

      <footer className="bg-[#030407] px-5 py-14 md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-10 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between"><div><div className="font-display text-4xl font-black uppercase tracking-[-0.05em]">VibeFlex Sports</div><p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-white/38">Tampa built • Rep your vibe</p></div><div className="flex gap-3"><a href="https://instagram.com" className="grid h-12 w-12 place-items-center rounded-full border border-white/15"><Instagram size={18}/></a><a href={`${SHOP_URL}/collections/all`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-xs font-black uppercase tracking-[0.16em] text-black">Shop now <ArrowRight size={14}/></a></div></div>
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 pt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 sm:flex-row sm:justify-between"><span>© 2026 VibeFlex Sports</span><span>Performance movement • Tampa, Florida</span></div>
      </footer>
    </main>
  );
}
