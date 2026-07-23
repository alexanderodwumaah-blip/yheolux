"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product, CATEGORY_TREE } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import InstallPrompt from "@/components/InstallPrompt";

const ALL = "All";

export default function HomePage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");
  const [activeMain, setActiveMain] = useState(ALL);
  const [activeSub, setActiveSub] = useState(ALL);

  useEffect(() => {
    let active = true;
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) { setProducts((data as Product[]) || []); setLoading(false); }
      });
    return () => { active = false; };
  }, []);

  function handleMainClick(main: string) {
    setActiveMain(main);
    setActiveSub(ALL);
  }

  const availableSubs: string[] =
    activeMain !== ALL
      ? [ALL, ...Array.from(new Set(
          products.filter((p) => p.main_category === activeMain).map((p) => p.category)
        ))]
      : [];

  const filtered = products.filter((p) => {
    const matchesSearch = (p.name + p.category + p.main_category).toLowerCase().includes(query.toLowerCase());
    const matchesMain   = activeMain === ALL || p.main_category === activeMain;
    const matchesSub    = activeSub === ALL  || p.category === activeSub;
    return matchesSearch && matchesMain && matchesSub;
  });

  const mainCats = [ALL, ...Array.from(new Set([
    ...Object.keys(CATEGORY_TREE),
    ...products.map((p) => p.main_category).filter(Boolean),
  ]))];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-gold-600/15">
        {/* Floating orbs */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-600/10 blur-3xl animate-floatSlow" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-gold-600/5 blur-2xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center sm:gap-6 sm:px-6 sm:py-28">
          {/* Coin badge */}
          <div
            className="coin-badge flex h-16 w-16 items-center justify-center rounded-full animate-fadeUp sm:h-20 sm:w-20"
          >
            <Image
              src="/icons/icon-192.png"
              alt="YHEOLUX"
              width={56}
              height={56}
              className="rounded-full"
            />
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.35em] text-gold-500 animate-fadeUp sm:text-xs"
            style={{ animationDelay: "0.1s" }}
          >
            Signature Collection · Ghana
          </p>

          <h1
            className="shimmer-text animate-shimmer font-display text-3xl leading-tight animate-fadeUp sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.18s" }}
          >
            Elegance in<br className="sm:hidden" /> Every Detail
          </h1>

          <p
            className="max-w-sm px-2 text-sm text-ivory/60 animate-fadeUp sm:max-w-lg sm:text-base sm:px-0"
            style={{ animationDelay: "0.26s" }}
          >
            Handpicked pieces, delivered across Ghana. Order in a few taps —
            confirm on WhatsApp, no card required.
          </p>

          <div
            className="flex flex-col gap-3 animate-fadeUp sm:flex-row"
            style={{ animationDelay: "0.34s" }}
          >
            <a
              href="#shop"
              className="btn-gold rounded-full px-7 py-3.5 font-semibold text-emerald-950 text-sm sm:text-base"
            >
              Shop the Collection
            </a>
            <a
              href="#about"
              className="rounded-full border border-gold-600/40 px-7 py-3.5 text-sm font-semibold text-ivory/70 transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              Our Story
            </a>
          </div>

          {/* Trust strip */}
          <div
            className="mt-2 flex flex-wrap items-center justify-center gap-4 animate-fadeUp sm:gap-8"
            style={{ animationDelay: "0.42s" }}
          >
            {["📦 No Card", "🚀 Fast Delivery", "💬 WhatsApp Order", "✨ Authentic"].map((t) => (
              <span key={t} className="text-[11px] text-ivory/35 sm:text-xs">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Install prompt */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-8">
        <InstallPrompt />
      </div>

      {/* ── SHOP SECTION ── */}
      <section id="shop" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold-500 sm:text-xs">The Collection</p>
            <h2 className="mt-1 font-display text-2xl text-ivory sm:text-3xl">Shop Signature Pieces</h2>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ivory/30">🔍</span>
            <input
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-gold-600/25 bg-emerald-900/50 py-2.5 pl-10 pr-4 text-sm
                text-ivory placeholder:text-ivory/30 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category tabs — scrollable on mobile */}
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {mainCats.map((cat) => (
            <button
              key={cat}
              onClick={() => handleMainClick(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeMain === cat
                  ? "bg-gold-600 text-emerald-950 shadow-[0_0_10px_rgba(201,162,39,0.3)]"
                  : "border border-gold-600/25 text-ivory/60 hover:border-gold-500 hover:text-ivory"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-category pills */}
        {availableSubs.length > 1 && (
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {availableSubs.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  activeSub === sub
                    ? "border border-gold-500 bg-gold-600/15 text-gold-300"
                    : "border border-gold-600/15 text-ivory/45 hover:border-gold-600/40 hover:text-ivory/70"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-emerald-900/50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gold-600/15 bg-emerald-900/30 p-12 text-center">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 text-ivory/50">
              {query ? `No results for "${query}"` : "No products here yet — check back soon."}
            </p>
          </div>
        ) : (
          <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── STORY SECTION ── */}
      <section id="about" className="border-t border-gold-600/15 bg-emerald-900/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="animate-slideLeft">
              <p className="text-[10px] uppercase tracking-widest text-gold-500 sm:text-xs">Our Story</p>
              <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">
                Crafted for those who notice the details
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60 sm:text-base">
                YHEOLUX curates signature pieces you won&apos;t find everywhere else. Every order is confirmed
                personally — no card details, ever. Pay on delivery or in advance, pick up at a point near you.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["✦ Curated", "✦ Authentic", "✦ Personal"].map((t) => (
                  <span key={t} className="rounded-full border border-gold-600/20 px-4 py-1.5 text-xs text-gold-500/80">{t}</span>
                ))}
              </div>
            </div>

            {/* Delivery locations grid */}
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-gold-500/70 sm:text-xs">Pickup & Delivery Points</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["Akuse", "Asutuarey", "Kpong", "Agormanya", "Somanya", "Natriku"].map((loc) => (
                  <div
                    key={loc}
                    className="rounded-xl border border-gold-600/15 bg-emerald-900/50 px-3 py-3 text-center text-sm text-ivory/70"
                  >
                    {loc}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium text-gold-500">✓ No delivery fee on all orders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
