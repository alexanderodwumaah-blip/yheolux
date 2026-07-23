"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-emerald-950/60" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-emerald-950/60" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-emerald-950/60" />
            <div className="h-24 w-full animate-pulse rounded bg-emerald-950/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-ivory/70">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-gold-400 underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images.length ? product.images : ["/icons/icon-512.png"];
  const hasDiscount =
    product.original_price && product.original_price > product.selling_price;

  function handleAdd() {
    if (!product) return;
    addItem(
      {
        product_id: product.id,
        name: product.name,
        selling_price: product.selling_price,
        image: images[0],
        seller_phone: product.seller_phone,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-fadeUp">
      <nav className="mb-6 text-xs uppercase tracking-widest text-ivory/50">
        <Link href="/" className="hover:text-gold-400">
          Shop
        </Link>{" "}
        / <span className="text-ivory/70">{product.category}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold-500/15 bg-emerald-950/50">
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-950">
                Sale
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border transition-colors ${
                    i === activeImage
                      ? "border-gold-400"
                      : "border-gold-500/15 hover:border-gold-500/40"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-400">
            {product.category}
          </p>
          <h1 className="mt-1 font-display text-3xl text-ivory">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-gold-300">
              {formatGHS(product.selling_price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-ivory/40 line-through">
                {formatGHS(product.original_price!)}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-ivory/75">
            {product.description}
          </p>

          {!product.in_stock ? (
            <p className="mt-8 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              Currently out of stock.
            </p>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-ivory/60">Quantity</span>
                <div className="flex items-center overflow-hidden rounded-full border border-gold-500/30">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-ivory hover:bg-emerald-800"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-ivory">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-1.5 text-ivory hover:bg-emerald-800"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded-full border border-gold-500/50 px-6 py-3 font-semibold text-gold-300 transition-colors hover:bg-gold-500/10"
                >
                  {added ? "Added ✓" : "Add to Bag"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105"
                >
                  Order Now
                </button>
              </div>
              <p className="text-xs text-ivory/40">
                No online payment. You&apos;ll confirm details with the seller
                via WhatsApp or a call before paying.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
