import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";

const pillars = [
  { icon: Trophy, title: "Earn Your Edge", copy: "Training, discipline, and everyday consistency built for athletes who refuse average." },
  { icon: Users, title: "Move Together", copy: "Connect with competitors, creators, coaches, and supporters pushing the culture forward." },
  { icon: Zap, title: "Stay Ready", copy: "Drops, challenges, athlete features, and opportunities designed to keep momentum high." },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.28),transparent_38%)]" />
        <div className="container relative py-28 md:py-36">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="max-w-4xl">
            <span className="label-caps mb-5 block">VibeFlex Athlete Community</span>
            <h1 className="font-display text-5xl font-extrabold leading-[.92] tracking-tight md:text-7xl lg:text-8xl">
              BUILT FOR THE<br /><span className="text-primary">ONES WHO MOVE.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              VibeFlex is more than apparel. It is a community for athletes, creators, and competitors committed to showing up prepared and leaving no doubt.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/ambassador" className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-4 font-display text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90">
                BECOME AN AMBASSADOR <ArrowRight size={16} />
              </Link>
              <Link href="/collections" className="inline-flex items-center rounded-lg border border-border bg-card px-7 py-4 font-display text-sm font-semibold tracking-wide transition hover:border-primary/60">
                SHOP THE MOVEMENT
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><item.icon size={22} /></div>
              <h2 className="font-display text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="container grid gap-10 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="label-caps mb-4 block">Community Standard</span>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">NO HYPE WITHOUT WORK.</h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The VibeFlex community celebrates preparation, resilience, leadership, and real progress. We spotlight the work behind the wins and the people who keep going when nobody is watching.
          </p>
        </div>
      </section>
    </div>
  );
}
