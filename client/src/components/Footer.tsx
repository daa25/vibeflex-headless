import { Link } from "wouter";
import { ArrowRight, Instagram, Facebook, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Collections: [
    { label: "#UNCOOKED", href: "/collections/uncooked" },
    { label: "490 Movement", href: "/collections/490-movement" },
    { label: "Stay Ready", href: "/collections/stay-ready" },
    { label: "Lock Down", href: "/collections/lock-down" },
    { label: "Relentless", href: "/collections/relentless" },
  ],
  Community: [
    { label: "Athlete Community", href: "/community" },
    { label: "Ambassador Program", href: "/ambassador" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="VibeFlex Sports home">
              <span className="font-display text-3xl font-black tracking-[-0.05em]">
                VIBE<span className="text-primary">FLEX</span>
              </span>
              <span className="border-l border-border pl-2 text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Sports
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium athletic lifestyle apparel for competitors, creators, and everyday athletes who refuse to show up unprepared.
            </p>
            <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground">
              Built Different. Stay Ready.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {[
                { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/vibeflexsports" },
                { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/vibeflexsports" },
                { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/@vibeflexsports" },
              ].map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h2 className="mb-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground">{title}</h2>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-5 rounded-2xl border border-border bg-background p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="font-display text-xl font-bold">Get first access to new drops.</p>
            <p className="mt-1 text-sm text-muted-foreground">Limited releases, athlete stories, and members-only offers.</p>
          </div>
          <Link href="/community" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:opacity-90">
            Join the Movement <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} VibeFlex Sports. All rights reserved.</p>
          <p>Laced Up by VibeFlex Sports</p>
        </div>
      </div>
    </footer>
  );
}
