import { Link } from "wouter";

const FOOTER_LINKS = {
  Shop: [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Training & Equipment", href: "/collections/train" },
    { label: "Activewear", href: "/collections/activewear" },
    { label: "Footwear", href: "/collections/footwear" },
    { label: "Fan Gear", href: "/collections/fan-gear" },
    { label: "Recovery", href: "/collections/recovery-smart" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Return Policy", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-display font-extrabold text-2xl tracking-tight block mb-4">
              LACED<span className="text-primary">UP</span>
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Activewear, training equipment, and sporting goods for men, boys, and athletes — curated from top athletic brands.
            </p>
            <p className="label-caps text-muted-foreground">
              By VibeFlex Sports
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="label-caps mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="section-divider mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Laced Up by VibeFlex Sports. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Some products are sold by third-party retailers. We may earn a commission on purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
