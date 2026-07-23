import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-gold-600/20 bg-emerald-950">
      {/* Background glow */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-gold-600/5 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 right-1/4 h-48 w-48 rounded-full bg-gold-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group mb-4 flex items-center gap-3">
              <div className="coin-badge flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110">
                <Image src="/icons/icon-192.png" alt="YHEOLUX" width={40} height={40} className="rounded-full" />
              </div>
              <div>
                <span className="block font-display text-xl tracking-widest text-ivory">YHEOLUX</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500/70">Signature Collection</span>
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/50">
              Handpicked, signature pieces delivered across Ghana. Elegance in every detail.
            </p>
            <div className="mt-5 flex gap-3">
              {["📦 No Card Needed", "🚀 Fast Delivery", "✨ Authentic"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold-600/20 bg-gold-600/5 px-3 py-1 text-[10px] uppercase tracking-wider text-gold-400/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-500">
              Pickup Points
            </h4>
            <ul className="space-y-2">
              {["Akuse", "Asutuarey", "Kpong", "Agormanya", "Somanya", "Natriku"].map((loc) => (
                <li key={loc} className="flex items-center gap-2 text-sm text-ivory/50">
                  <span className="h-1 w-1 rounded-full bg-gold-500/50" />
                  {loc}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-medium text-gold-500">✓ No delivery fee</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-500">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Shop" },
                { href: "/#about", label: "Our Story" },
                { href: "/signup", label: "Get Updates" },
                { href: "/cart", label: "Your Bag" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/50 transition-colors duration-200 hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-ivory/30">
            © {new Date().getFullYear()} YHEOLUX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-ivory/30">
            <Link href="/signup" className="hover:text-gold-400 transition-colors">
              Newsletter
            </Link>
            <span>·</span>
            <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>

        {/* Developer credit */}
        <p className="mt-6 text-center text-[11px] text-ivory/20">
          Developed by{" "}
          <span className="text-gold-600/60 font-medium">Alexander Opoku Dwumaah</span>
        </p>
      </div>
    </footer>
  );
}
