"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export default function ProductPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params?.id as string;
  const { addItem } = useCart();

  const [product, setProduct]       = useState<Product | null>(null);
  const [loading, setLoading]       = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty]               = useState(1);
  const [added, setAdded]           = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single()
      .then(({ data }) => { setProduct(data as Product); setLoading(false); });
  }, [id]);

  const images = product?.images?.length ? product.images : ["/icons/icon-512.png"];

  // Keyboard gallery navigation
  const prevImg = useCallback(() => {
    setImgLoaded(false);
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImg = useCallback(() => {
    setImgLoaded(false);
    setActiveImage((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevImg, nextImg]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-emerald-900/60" />
          <div className="space-y-4 pt-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-emerald-900/60" />
            <div className="h-9 w-3/4 animate-pulse rounded-xl bg-emerald-900/60" />
            <div className="h-6 w-1/3 animate-pulse rounded-lg bg-emerald-900/60" />
            <div className="mt-4 h-32 animate-pulse rounded-xl bg-emerald-900/60" />
            <div className="mt-6 h-12 animate-pulse rounded-full bg-emerald-900/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-4xl">🔍</p>
        <p className="mt-4 text-ivory/70">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-gold-500 underline">Back to shop</Link>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.selling_price;
  const savings     = hasDiscount ? product.original_price! - product.selling_price : 0;

  function handleAdd() {
    addItem({
      product_id:    product!.id,
      name:          product!.name,
      selling_price: product!.selling_price,
      image:         images[0],
      seller_phone:  product!.seller_phone,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-fadeUp">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-ivory/40">
        <Link href="/" className="transition-colors hover:text-gold-400">Shop</Link>
        <span>/</span>
        <span className="text-ivory/60">{product.main_category}</span>
        <span>/</span>
        <span className="text-gold-500/80">{product.category}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_480px]">

        {/* ── GALLERY ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gold-600/15 bg-emerald-900/50
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
            <Image
              key={activeImage}
              src={images[activeImage]}
              alt={`${product.name} — image ${activeImage + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className={`object-cover transition-all duration-700 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
              priority
              onLoad={() => setImgLoaded(true)}
            />

            {/* Gradient bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-950/60 to-transparent pointer-events-none" />

            {/* Sale badge */}
            {hasDiscount && (
              <div className="absolute left-4 top-4">
                <span className="luxury-badge rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Save {formatGHS(savings)}
                </span>
              </div>
            )}

            {/* Nav arrows — shown only if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center
                    rounded-full bg-emerald-950/70 text-ivory backdrop-blur-sm border border-gold-600/20
                    opacity-0 transition-all duration-300 group-hover:opacity-100
                    hover:bg-gold-600 hover:text-emerald-950 hover:border-gold-600"
                >
                  ‹
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center
                    rounded-full bg-emerald-950/70 text-ivory backdrop-blur-sm border border-gold-600/20
                    opacity-0 transition-all duration-300 group-hover:opacity-100
                    hover:bg-gold-600 hover:text-emerald-950 hover:border-gold-600"
                >
                  ›
                </button>
              </>
            )}

            {/* Dot counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setImgLoaded(false); setActiveImage(i); }}
                    aria-label={`View image ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeImage
                        ? "w-5 h-1.5 bg-gold-500"
                        : "w-1.5 h-1.5 bg-ivory/40 hover:bg-ivory/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setActiveImage(i); }}
                  aria-label={`Thumbnail ${i + 1}`}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    i === activeImage
                      ? "border-gold-500 shadow-[0_0_12px_rgba(201,162,39,0.4)]"
                      : "border-transparent opacity-60 hover:border-gold-500/50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── DETAILS ── */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-gold-500/80">
            {product.main_category} · {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ivory sm:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-3xl font-semibold text-gold-400">
              {formatGHS(product.selling_price)}
            </span>
            {hasDiscount && (
              <span className="mb-1 text-lg text-ivory/35 line-through">
                {formatGHS(product.original_price!)}
              </span>
            )}
            {hasDiscount && (
              <span className="mb-1 rounded-full bg-gold-600/15 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                {Math.round((savings / product.original_price!) * 100)}% off
              </span>
            )}
          </div>

          <div className="gold-divider my-6" />

          {/* Description */}
          <p className="leading-relaxed text-ivory/70">{product.description}</p>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "💬", label: "WhatsApp Order" },
              { icon: "📍", label: "No Delivery Fee" },
              { icon: "✅", label: "No Card Needed" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-gold-600/15 bg-emerald-900/30 p-3 text-center">
                <span className="text-xl">{b.icon}</span>
                <span className="text-[10px] uppercase tracking-wider text-ivory/50">{b.label}</span>
              </div>
            ))}
          </div>

          {!product.in_stock ? (
            <div className="mt-8 rounded-xl border border-red-400/30 bg-red-950/20 px-5 py-4 text-center">
              <p className="text-sm font-medium text-red-300">Currently out of stock</p>
              <p className="mt-1 text-xs text-red-300/60">Check back soon — we restock regularly.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-ivory/60">Quantity</span>
                <div className="flex items-center overflow-hidden rounded-full border border-gold-600/30 bg-emerald-900/40">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 py-2 text-center text-ivory transition-colors hover:bg-gold-600/20"
                    aria-label="Decrease"
                  >−</button>
                  <span className="w-10 text-center font-semibold text-ivory">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 py-2 text-center text-ivory transition-colors hover:bg-gold-600/20"
                    aria-label="Increase"
                  >+</button>
                </div>
                <span className="text-sm font-semibold text-gold-400">
                  = {formatGHS(product.selling_price * qty)}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAdd}
                  className={`flex-1 rounded-full border px-6 py-3.5 font-semibold transition-all duration-300 ${
                    added
                      ? "border-emerald-700 bg-emerald-800/50 text-emerald-300"
                      : "border-gold-600/50 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500"
                  }`}
                >
                  {added ? "✓ Added to Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-gold flex-1 rounded-full px-6 py-3.5 font-semibold text-emerald-950"
                >
                  Order Now
                </button>
              </div>

              <p className="text-center text-xs text-ivory/35">
                You'll confirm with the seller on WhatsApp before any payment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
