import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
  "Personal ambassador code and tracked rewards",
  "Early access to limited VibeFlex drops",
  "Feature opportunities across brand channels",
  "Campaign, event, and product collaboration access",
];

export default function Ambassador() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-card/40">
        <div className="container grid gap-12 py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-32">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}>
            <span className="label-caps mb-5 block">VibeFlex Ambassador Program</span>
            <h1 className="font-display text-5xl font-extrabold leading-[.93] tracking-tight md:text-7xl">
              REPRESENT THE<br /><span className="text-primary">MOVEMENT.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We partner with athletes, coaches, creators, and community leaders who live the standard: stay ready, work relentlessly, and bring others with them.
            </p>
            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={14} /></span>
                  <span className="text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }} className="rounded-2xl border border-border bg-card p-7 shadow-2xl shadow-black/10 md:p-9">
            {submitted ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={30} /></div>
                <h2 className="font-display text-3xl font-bold">Application Received</h2>
                <p className="mt-3 max-w-sm text-muted-foreground">Your ambassador application has been submitted for review. The VibeFlex team will follow up using the contact information provided.</p>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div><h2 className="font-display text-3xl font-bold">Apply Now</h2><p className="mt-2 text-sm text-muted-foreground">Tell us who you are and how you move your community.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">First name<input required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary" /></label>
                  <label className="text-sm font-medium">Last name<input required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary" /></label>
                </div>
                <label className="block text-sm font-medium">Email<input type="email" required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary" /></label>
                <label className="block text-sm font-medium">Primary social profile<input required placeholder="@handle or profile URL" className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary" /></label>
                <label className="block text-sm font-medium">Why VibeFlex?<textarea required rows={5} className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary" /></label>
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-display text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90">SUBMIT APPLICATION <ArrowRight size={16} /></button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
