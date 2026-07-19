import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-card/40">
        <div className="container py-20 md:py-28">
          <span className="label-caps mb-4 block">Contact VibeFlex</span>
          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[.95] tracking-tight md:text-7xl">LET'S BUILD THE<br /><span className="text-primary">NEXT MOVE.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Questions about an order, partnership, team request, wholesale opportunity, or the VibeFlex community? Send it directly to the team.</p>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-[.75fr_1.25fr] lg:py-20">
        <div className="space-y-5">
          <article className="rounded-2xl border border-border bg-card p-7">
            <Mail className="text-primary" size={24} />
            <h2 className="mt-5 font-display text-xl font-bold">Customer Support</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Order questions, sizing, returns, shipping, and product support.</p>
            <a href="mailto:support@vibeflexsports.com" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">support@vibeflexsports.com</a>
          </article>
          <article className="rounded-2xl border border-border bg-card p-7">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="mt-5 font-display text-xl font-bold">Partnerships</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Athlete collaborations, teams, events, wholesale, and brand partnerships.</p>
            <a href="mailto:partners@vibeflexsports.com" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">partners@vibeflexsports.com</a>
          </article>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
          {sent ? (
            <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={30} /></div>
              <h2 className="mt-6 font-display text-3xl font-bold">Message Sent</h2>
              <p className="mt-3 max-w-md text-muted-foreground">Your message is ready for the VibeFlex team. We will respond using the email address provided.</p>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="space-y-5">
              <div><h2 className="font-display text-3xl font-bold">Send a Message</h2><p className="mt-2 text-sm text-muted-foreground">Include your order number when contacting us about an existing purchase.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Name<input required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
                <label className="text-sm font-medium">Email<input required type="email" className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
              </div>
              <label className="block text-sm font-medium">Topic<select required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"><option value="">Select a topic</option><option>Order support</option><option>Returns and exchanges</option><option>Ambassador program</option><option>Team or wholesale order</option><option>Brand partnership</option><option>Other</option></select></label>
              <label className="block text-sm font-medium">Order number <span className="text-muted-foreground">(optional)</span><input className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
              <label className="block text-sm font-medium">Message<textarea required rows={6} className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-display text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90">SEND MESSAGE <Send size={16} /></button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
