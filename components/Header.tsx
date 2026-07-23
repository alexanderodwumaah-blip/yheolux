"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold-600/30 bg-emerald-950/95 shadow-[0_4px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "border-b border-gold-600/10 bg-emerald-950/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="coin-badge relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/icons/icon-192.png"
              alt="YHEOLUX"
              width={34}
              height={34}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-widest text-ivory">
              YHEOLUX
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500/80">
              Signature Collection
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 font-body text-xs uppercase tracking-widest md:flex">
          {[
            { href: "/", label: "Shop" },
            { href: "/#about", label: "Our Story" },
            { href: "/signup", label: "Updates" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-ivory/70 transition-colors duration-200 hover:text-gold-400
                after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold-500
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="group relative flex items-center gap-2 rounded-full border border-gold-600/40 px-4 py-2 text-sm text-ivory/80 transition-all duration-300 hover:border-gold-500 hover:bg-gold-600/10 hover:text-gold-300"
          >
            <span className="text-base transition-transform duration-300 group-hover:scale-110">
              🛍️
            </span>
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="animate-pulseGlow absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-emerald-950">
                {count}
              </span>
            )}
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-600/30 text-ivory/70 transition-colors hover:border-gold-500 hover:text-gold-400 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="text-sm">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col border-t border-gold-600/20 bg-emerald-950 px-6 py-4">
          {[
            { href: "/", label: "Shop" },
            { href: "/#about", label: "Our Story" },
            { href: "/signup", label: "Updates" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-gold-600/10 py-3 text-sm uppercase tracking-widest text-ivory/80 last:border-0 hover:text-gold-400"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
