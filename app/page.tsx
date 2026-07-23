"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import InstallPrompt from "@/components/InstallPrompt";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) {
          setProducts((data as Product[]) || []);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = products.filter((p) =>
    (p.name + p.category).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gold-500/15">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl animate-floatSlow" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="coin-badge flex h-20 w-20 items-center justify-center rounded-full animate-fadeUp">
            <Image
              src="/icons/icon-192.png"
              alt="YHEOLUX coin emblem"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <p
            className="text-xs uppercase tracking-[0.35em] text-gold-400 animate-fadeUp"
            style={{ animationDelay: "0.1s" }}
          >
            Signature Collection
          </p>
          <h1
            className="shimmer-text animate-shimmer font-display text-4xl leading-tight sm:text-6xl animate-fadeUp"
            style={{ animationDelay: "0.18s" }}
          >
            Elegance in Every Detail
          </h1>
          <p
            className="max-w-xl text-ivory/70 animate-fadeUp"
            style={{ animationDelay: "0.26s" }}
          >
            Handpicked pieces, delivered across Ghana. Order in a few taps —
            confirm with the seller on WhatsApp, no card required.
          </p>
          <a
            href="#shop"
            className="animate-fadeUp rounded-full bg-gold-500 px-8 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105"
            style={{ animationDelay: "0.34s" }}
          >
            Shop the Collection
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <InstallPrompt />
      </div>

      {/* SHOP */}
      <section id="shop" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-400">
              The Collection
            </p>
            <h2 className="font-display text-2xl text-ivory sm:text-3xl">
              Shop Signature Pieces
            </h2>
          </div>
          <input
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gold-500/30 bg-emerald-950/60 px-4 py-2 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold-400 sm:w-64"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-emerald-950/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-gold-500/15 bg-emerald-950/50 p-10 text-center text-ivory/60">
            No products found. Check back soon — new arrivals are on the way.
          </p>
        ) : (
          <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* STORY */}
      <section
        id="about"
        className="border-t border-gold-500/15 bg-emerald-950/40"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-400">
              Our Story
            </p>
            <h2 className="mt-2 font-display text-3xl text-ivory">
              Crafted for those who notice the details
            </h2>
            <p className="mt-4 text-ivory/70">
              YHEOLUX curates signature pieces you won&apos;t find everywhere
              else. Every order is confirmed personally — no card details,
              ever. Choose to pay in advance or on delivery, then pick up at
              a point near you or have it delivered, at no extra cost.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            {["Akuse", "Asutuarey", "Kpong", "Agormanya", "Somanya", "Natriku"].map(
              (loc) => (
                <div
                  key={loc}
                  className="rounded-xl border border-gold-500/15 bg-emerald-950/60 py-4 text-sm text-ivory/80"
                >
                  {loc}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
