import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "#UNCOOKED", href: "/collections/uncooked" },
  { label: "490 Movement", href: "/collections/490-movement" },
  { label: "Stay Ready", href: "/collections/stay-ready" },
  { label: "Lock Down", href: "/collections/lock-down" },
  { label: "Relentless", href: "/collections/relentless" },
];

const COMMUNITY_LINKS = [
  { label: "Athlete Community", href: "/community" },
  { label: "Ambassador Program", href: "/ambassador" },
  { label: "Our Story", href: "/about" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
    setSearchOpen(false);
    setSearchQuery("");
  };

  const isActive = (href: string) => location.startsWith(href);

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-primary-foreground">
        <p className="font-display text-[11px] font-semibold tracking-[0.18em] sm:text-xs">
          FREE SHIPPING OVER $75 · BUILT DIFFERENT · STAY READY
        </p>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-5">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="-ml-2 p-2 text-foreground/70 transition-colors hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="VibeFlex Sports home">
            <span className="font-display text-xl font-black tracking-[-0.04em] text-foreground md:text-2xl">
              VIBE<span className="text-primary">FLEX</span>
            </span>
            <span className="hidden border-l border-border pl-2 text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Sports
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap font-display text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/community"
              className={`whitespace-nowrap font-display text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-primary ${
                isActive("/community") || isActive("/ambassador") ? "text-primary" : "text-foreground/70"
              }`}
            >
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="rounded-full p-2.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <Search size={19} />
            </button>
            <Link
              href="/cart"
              className="relative rounded-full p-2.5 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={19} />
            </Link>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border bg-background"
            >
              <form onSubmit={handleSearch} className="container py-5" role="search">
                <div className="relative mx-auto max-w-3xl">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search VibeFlex collections and products"
                    className="w-full rounded-xl border border-border bg-secondary py-3.5 pl-12 pr-4 font-body text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm overflow-y-auto border-r border-border bg-background p-6 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="mb-9 flex items-center justify-between">
                <Link href="/" onClick={() => setMobileOpen(false)} className="font-display text-2xl font-black tracking-[-0.04em]">
                  VIBE<span className="text-primary">FLEX</span>
                </Link>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full p-2 text-foreground/70 hover:bg-secondary hover:text-foreground" aria-label="Close navigation">
                  <X size={20} />
                </button>
              </div>

              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Collections</p>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3.5 font-display text-sm font-semibold transition-colors ${
                      isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="my-6 h-px bg-border" />
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">VibeFlex</p>
              <div className="flex flex-col gap-1">
                {COMMUNITY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${
                      isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3.5 text-sm font-medium text-foreground/75 transition hover:bg-secondary hover:text-foreground">
                  Contact
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
