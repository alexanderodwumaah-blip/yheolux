import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gold-500/20 bg-emerald-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg text-gold-400">YHEOLUX</h3>
            <p className="mt-2 text-sm text-ivory/60">
              Signature — Elegance in every detail. Handpicked pieces, delivered
              across Ghana.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-ivory/50">
              Pickup &amp; Delivery
            </h4>
            <p className="mt-2 text-sm text-ivory/60">
              Akuse · Asutuarey · Kpong · Agormanya · Somanya · Natriku
            </p>
            <p className="mt-1 text-sm text-gold-400">No delivery fee</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-ivory/50">
              Stay in the loop
            </h4>
            <Link
              href="/signup"
              className="mt-2 inline-block text-sm text-ivory/70 underline decoration-gold-500/50 underline-offset-4 hover:text-gold-400"
            >
              Get notified about new arrivals →
            </Link>
          </div>
        </div>
        <div className="gold-divider my-8" />
        <p className="text-center text-xs text-ivory/40">
          © {new Date().getFullYear()} YHEOLUX. All rights reserved.{" "}
          <Link href="/admin/login" className="hover:text-gold-400">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
