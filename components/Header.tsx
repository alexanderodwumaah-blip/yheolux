"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-500/20 bg-emerald-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/icons/icon-192.png"
            alt="YHEOLUX"
            width={38}
            height={38}
            className="rounded-full transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="font-display text-xl tracking-wide text-ivory">
            YHEOLUX
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm uppercase tracking-widest text-ivory/80 md:flex">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Shop
          </Link>
          <Link href="/#about" className="hover:text-gold-400 transition-colors">
            Our Story
          </Link>
          <Link href="/signup" className="hover:text-gold-400 transition-colors">
            Updates
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-gold-500/40 px-3 py-1.5 text-sm text-ivory transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <span aria-hidden>🛍️</span>
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-emerald-950">
                {count}
              </span>
            )}
          </Link>
          <button
            className="text-ivory md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold-500/20 bg-emerald-950 px-4 py-3 font-body text-sm uppercase tracking-widest text-ivory/90 md:hidden">
          <Link href="/" className="py-2" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <Link href="/#about" className="py-2" onClick={() => setOpen(false)}>
            Our Story
          </Link>
          <Link href="/signup" className="py-2" onClick={() => setOpen(false)}>
            Updates
          </Link>
        </nav>
      )}
    </header>
  );
}
